from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    user_id: str
    user_email: str
    screenshot_url: str
    status: str = "pending"

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LicenseKeyBase(BaseModel):
    key: str
    tier: str
    user_email: str
    device_id: Optional[str] = None
    is_active: bool = True

class LicenseKeyResponse(LicenseKeyBase):
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True

class VerifyKeyRequest(BaseModel):
    key: str
    deviceId: str

class VerifyKeyResponse(BaseModel):
    valid: bool
    tier: Optional[str] = None
    expires: Optional[datetime] = None
    error: Optional[str] = None

class ChatRequest(BaseModel):
    prompt: str
