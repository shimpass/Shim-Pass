from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) # Clerk user ID
    user_email = Column(String)
    screenshot_url = Column(String)
    status = Column(String, default="pending") # pending, verified, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LicenseKey(Base):
    __tablename__ = "license_keys"

    key = Column(String, primary_key=True, index=True)
    tier = Column(String) # pro, ultra
    user_email = Column(String)
    device_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
