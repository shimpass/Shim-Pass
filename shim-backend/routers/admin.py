import os
import secrets
from fastapi import APIRouter, Depends, HTTPException, status, Header, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from database import get_db
import models, schemas, utils

router = APIRouter(prefix="/admin", tags=["Admin"])

def verify_admin(admin_secret: Optional[str] = Header(None)):
    expected_secret = os.getenv("ADMIN_SECRET")
    if not expected_secret:
        raise HTTPException(status_code=500, detail="Server configuration error: ADMIN_SECRET is not set")
    if not admin_secret or not secrets.compare_digest(admin_secret, expected_secret):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin secret")

@router.get("/payments/pending", response_model=List[schemas.PaymentResponse], dependencies=[Depends(verify_admin)])
def get_pending_payments(
    db: Session = Depends(get_db)
):
    payments = db.query(models.Payment).filter(models.Payment.status == "pending").all()
    return payments

@router.post("/payments/{payment_id}/verify", dependencies=[Depends(verify_admin)])
def verify_payment(
    payment_id: int,
    tier: str, # "pro" or "ultra"
    user_email: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    if tier not in ["pro", "ultra"]:
        raise HTTPException(status_code=400, detail="Invalid tier. Must be 'pro' or 'ultra'.")
        
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment.status != "pending":
        raise HTTPException(status_code=400, detail="Payment is already verified or rejected")
    
    # Update payment status
    payment.status = "verified"
    
    # Generate License Key
    new_key = utils.generate_license_key(tier)
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    
    db_license = models.LicenseKey(
        key=new_key,
        tier=tier,
        user_email=user_email,
        expires_at=expires
    )
    db.add(db_license)
    db.commit()
    
    # Send email in background
    background_tasks.add_task(utils.send_license_email, user_email, new_key, tier)
    
    return {"message": "Payment verified and email sent", "key": new_key, "tier": tier, "expires_at": expires}

@router.post("/payments/{payment_id}/reject", dependencies=[Depends(verify_admin)])
def reject_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
        
    payment.status = "rejected"
    db.commit()
    return {"message": "Payment rejected"}

@router.get("/licenses", response_model=List[schemas.LicenseKeyResponse], dependencies=[Depends(verify_admin)])
def get_all_licenses(db: Session = Depends(get_db)):
    licenses = db.query(models.LicenseKey).order_by(models.LicenseKey.created_at.desc()).all()
    return licenses

@router.post("/licenses/{key}/revoke", dependencies=[Depends(verify_admin)])
def revoke_license(key: str, db: Session = Depends(get_db)):
    license = db.query(models.LicenseKey).filter(models.LicenseKey.key == key).first()
    if not license:
        raise HTTPException(status_code=404, detail="License not found")
        
    license.is_active = False
    db.commit()
    return {"message": "License permanently revoked"}

@router.post("/licenses/{key}/unbind", dependencies=[Depends(verify_admin)])
def admin_unbind_license(key: str, db: Session = Depends(get_db)):
    license = db.query(models.LicenseKey).filter(models.LicenseKey.key == key).first()
    if not license:
        raise HTTPException(status_code=404, detail="License not found")
        
    license.device_id = None
    db.commit()
    return {"message": "Device successfully unbound by Admin"}
