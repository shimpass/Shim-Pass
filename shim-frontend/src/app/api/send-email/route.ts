import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.INTERNAL_API_SECRET}`;

    if (!process.env.INTERNAL_API_SECRET || authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipient_email, license_key, tier } = await request.json();

    if (!recipient_email || !license_key || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sender_email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const sender_password = process.env.SMTP_PASSWORD;

    if (!sender_email || !sender_password) {
      console.error("ERROR: NEXT_PUBLIC_ADMIN_EMAIL or SMTP_PASSWORD is not set on Vercel.");
      return NextResponse.json({ error: 'SMTP Configuration missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    const htmlContent = `
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
            <h2 style="margin-top: 0; font-size: 20px; font-weight: 700; color: #000000;">Welcome to Shim ${tier.charAt(0).toUpperCase() + tier.slice(1)}</h2>
            <p style="color: #52525b; font-size: 16px; margin-bottom: 24px;">Your payment has been successfully verified. We are thrilled to have you on board!</p>
            <p style="color: #18181b; font-size: 16px; margin-bottom: 12px;">Here is your official <strong>${tier.charAt(0).toUpperCase() + tier.slice(1)}</strong> license key:</p>
            
            <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; border: 1px solid #e4e4e7; text-align: center; margin: 24px 0;">
                <code style="color: #000000; font-size: 20px; font-weight: bold; letter-spacing: 1px;">${license_key}</code>
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
    `;

    const info = await transporter.sendMail({
      from: `"Shim" <${sender_email}>`,
      to: recipient_email,
      subject: `Your Shim ${tier.charAt(0).toUpperCase() + tier.slice(1)} License Key`,
      html: htmlContent,
    });

    console.log("Email sent: %s", info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Failed to send email via Vercel proxy:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
