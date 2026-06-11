import os
import uuid
import random
import string
import requests
import cloudinary
import cloudinary.uploader
from datetime import datetime, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address

# Global Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "").strip(),
    api_key=os.getenv("CLOUDINARY_API_KEY", "").strip(),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "").strip()
)

def upload_image_to_cloudinary(file_content, filename):
    """Uploads an image to Cloudinary and returns the secure URL."""
    try:
        result = cloudinary.uploader.upload(
            file_content,
            folder="shim_payments"
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

def generate_license_key(tier: str):
    """Generates a secure 15-character random license key e.g., SHIM-ULTRA-9A2X5-B7M1K-P4L0Z"""
    chunk1 = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    chunk2 = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    chunk3 = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"SHIM-{tier.upper()}-{chunk1}-{chunk2}-{chunk3}"

def send_license_email(recipient_email: str, license_key: str, tier: str):
    """Sends the license key to the user by proxying to the Vercel frontend."""
    frontend_url = os.getenv("FRONTEND_URL", "https://shim-pass.vercel.app")
    internal_secret = os.getenv("INTERNAL_API_SECRET")

    if not internal_secret:
        print("ERROR: INTERNAL_API_SECRET is not set. Email not sent.")
        return False

    url = f"{frontend_url.rstrip('/')}/api/send-email"
    headers = {
        "Authorization": f"Bearer {internal_secret}",
        "Content-Type": "application/json"
    }
    payload = {
        "recipient_email": recipient_email,
        "license_key": license_key,
        "tier": tier,
        "frontend_url": frontend_url.rstrip('/')
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        print(f"License email successfully proxied to Vercel for {recipient_email}")
        return True
    except Exception as e:
        print(f"Failed to proxy email to Vercel for {recipient_email}: {e}")
        if isinstance(e, requests.exceptions.HTTPError) and e.response is not None:
            print(f"Response: {e.response.text}")
        return False
