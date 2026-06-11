import os
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import json
import asyncio
from google import genai
from groq import AsyncGroq

from database import get_db
from utils import limiter
import models, schemas

router = APIRouter(tags=["Extension"])

# Configure AI Providers
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
groq_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/verify-key", response_model=schemas.VerifyKeyResponse)
@limiter.limit("5/minute")
def verify_key(request: Request, body: schemas.VerifyKeyRequest, db: Session = Depends(get_db)):
    license = db.query(models.LicenseKey).filter(models.LicenseKey.key == body.key).first()
    
    if not license or not license.is_active:
        return {"valid": False, "error": "Invalid or inactive key"}
        
    if license.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return {"valid": False, "error": "Key has expired"}
        
    if not license.device_id:
        # First use, bind device
        license.device_id = body.deviceId
        db.commit()
    elif license.device_id != body.deviceId:
        return {"valid": False, "error": "Key is bound to another device"}
        
    return {"valid": True, "tier": license.tier, "expires": license.expires_at}

async def unified_chat_stream(prompt: str):
    try:
        # Try Gemini
        response = await gemini_client.aio.models.generate_content_stream(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        async for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'text': chunk.text})}\n\n"
        yield "data: [DONE]\n\n"
    except asyncio.CancelledError:
        # Client disconnected, don't fallback to Groq
        raise
    except Exception as e:
        print(f"Gemini failed: {e}. Falling back to Groq.")
        try:
            # Fallback to Groq
            stream = await groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                stream=True
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield f"data: {json.dumps({'text': chunk.choices[0].delta.content})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as groq_e:
            print(f"Groq failed: {groq_e}")
            yield f"data: {json.dumps({'text': '[ERROR] All AI providers failed.'})}\n\n"

@router.post("/api/chat")
@limiter.limit("20/minute")
async def chat_proxy(
    request: Request,
    chat_req: schemas.ChatRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None),
    x_device_id: str = Header(None)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    key = parts[1]
    
    # Validate License
    license = db.query(models.LicenseKey).filter(models.LicenseKey.key == key).first()
    if not license or not license.is_active or license.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid or expired key")
        
    if license.device_id != x_device_id:
        raise HTTPException(status_code=403, detail="Key bound to another device")
        
    return StreamingResponse(unified_chat_stream(chat_req.prompt), media_type="text/event-stream")
