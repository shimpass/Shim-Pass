from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Request, Header
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from typing import Annotated, List
import os
import secrets

from database import get_db
from utils import limiter
import models, schemas, utils

router = APIRouter(prefix="/api/payments", tags=["Payments"])

def verify_internal_secret(internal_secret: str = Header(None)):
    expected_secret = os.getenv("INTERNAL_API_SECRET")
    if not expected_secret:
        raise HTTPException(status_code=500, detail="Server misconfiguration: INTERNAL_API_SECRET missing")
    if not internal_secret or not secrets.compare_digest(internal_secret, expected_secret):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Invalid internal secret")

@router.post("/upload", response_model=schemas.PaymentResponse, dependencies=[Depends(verify_internal_secret)])
@limiter.limit("5/minute")
async def upload_payment(
    request: Request,
    user_id: Annotated[str, Form()],
    user_email: Annotated[str, Form()],
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
        
    # Read file content
    content = await file.read()
    
    # Check payload size limit (5MB)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
    
    # Upload to Cloudinary without blocking the event loop
    secure_url = await run_in_threadpool(utils.upload_image_to_cloudinary, content, file.filename)
    if not secure_url:
        raise HTTPException(status_code=500, detail="Failed to upload image")
    
    # Save to database
    db_payment = models.Payment(
        user_id=user_id,
        user_email=user_email,
        screenshot_url=secure_url,
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    return db_payment

@router.get("/user/{user_email}/licenses", response_model=List[schemas.LicenseKeyResponse], dependencies=[Depends(verify_internal_secret)])
def get_user_licenses(user_email: str, db: Session = Depends(get_db)):
    licenses = db.query(models.LicenseKey).filter(models.LicenseKey.user_email == user_email).order_by(models.LicenseKey.created_at.desc()).all()
    return licenses

@router.get("/user/{user_email}/history", response_model=List[schemas.PaymentResponse], dependencies=[Depends(verify_internal_secret)])
def get_user_payment_history(user_email: str, db: Session = Depends(get_db)):
    payments = db.query(models.Payment).filter(models.Payment.user_email == user_email).order_by(models.Payment.created_at.desc()).all()
    return payments

@router.post("/licenses/{key}/unbind", dependencies=[Depends(verify_internal_secret)])
def unbind_user_device(key: str, user_email: str, db: Session = Depends(get_db)):
    license = db.query(models.LicenseKey).filter(models.LicenseKey.key == key).first()
    if not license:
        raise HTTPException(status_code=404, detail="License not found")
        
    if license.user_email != user_email:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this license key")
        
    license.device_id = None
    db.commit()
    return {"message": "Hardware lock successfully removed"}
