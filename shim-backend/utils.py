import os
import uuid
import random
import string
import mailtrap as mt
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
    """Sends the license key to the user via Mailtrap API."""
    mailtrap_token = os.getenv("MAILTRAP_API_TOKEN")
    
    if not mailtrap_token:
        print("ERROR: MAILTRAP_API_TOKEN is not set. Email not sent.")
        return False

    html = f"""\
    <html>
      <body style="font-family: sans-serif; background-color: #000; color: #fff; padding: 20px;">
        <h2 style="color: #a855f7;">Welcome to Shim</h2>
        <p>Your payment has been successfully verified.</p>
        <p>Here is your official <strong>{tier.capitalize()}</strong> license key:</p>
        <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #333; margin: 20px 0;">
            <code style="color: #a855f7; font-size: 18px; font-weight: bold;">{license_key}</code>
        </div>
        <p>Enter this key into the Shim extension to activate your features. This key is valid for 30 days.</p>
        <p style="color: #888; font-size: 12px; margin-top: 40px;">If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """

    try:
        mail = mt.Mail(
            sender=mt.Address(email="hello@demomailtrap.co", name="Shim Official"),
            to=[mt.Address(email=recipient_email)],
            subject=f"Your Shim {tier.capitalize()} License Key",
            html=html,
            category="License Delivery",
        )

        client = mt.MailtrapClient(token=mailtrap_token)
        response = client.send(mail)
        print(f"License email sent to {recipient_email} via Mailtrap: {response}")
        return True
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {e}")
        return False
