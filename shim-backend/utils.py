import os
import uuid
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
    """Sends the license key to the user via Google SMTP."""
    sender_email = "officialshimpass@gmail.com"
    sender_password = os.getenv("SMTP_PASSWORD")

    if not sender_password:
        print("ERROR: SMTP_PASSWORD is not set. Email not sent.")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Your Shim {tier.capitalize()} License Key"
    msg["From"] = f"Shim <{sender_email}>"
    msg["To"] = recipient_email

    html = f"""\
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 40px 20px; line-height: 1.6;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; overflow: hidden;">
        <tr>
          <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #e4e4e7;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
              <tr>
                <td style="padding-right: 16px; vertical-align: middle;">
                  <img src="https://shim-pass.vercel.app/shim-logo.svg" alt="Shim" width="40" height="40" style="display: block; border-radius: 8px;">
                </td>
                <td style="vertical-align: middle;">
                  <h1 style="color: #000000; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.5px; line-height: 1;">SHIM</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <h2 style="margin-top: 0; font-size: 20px; font-weight: 700; color: #000000;">Welcome to Shim {tier.capitalize()}</h2>
            <p style="color: #52525b; font-size: 16px; margin-bottom: 24px;">Your payment has been successfully verified. We are thrilled to have you on board!</p>
            <p style="color: #18181b; font-size: 16px; margin-bottom: 12px;">Here is your official <strong>{tier.capitalize()}</strong> license key:</p>
            
            <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; border: 1px solid #e4e4e7; text-align: center; margin: 24px 0;">
                <code style="color: #000000; font-size: 20px; font-weight: bold; letter-spacing: 1px;">{license_key}</code>
            </div>
            
            <p style="color: #52525b; font-size: 15px; margin-bottom: 32px;">Please enter this key directly into the Shim extension to activate your premium features. This key is valid for the next 30 days.</p>
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="text-align: center;">
                  <a href="https://shim-pass.vercel.app/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 15px;">Go to Dashboard</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 40px; background-color: #fafafa; text-align: center; border-top: 1px solid #e4e4e7;">
            <p style="color: #71717a; font-size: 13px; margin: 0;">If you did not request this email, please ignore it.</p>
            <p style="color: #71717a; font-size: 13px; margin: 8px 0 0 0;">&copy; 2026 Shim Tech. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        print(f"License email sent to {recipient_email} via Gmail")
        return True
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {e}")
        return False
