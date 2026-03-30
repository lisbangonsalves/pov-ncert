import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function sendOtpEmail(email: string, otp: string, name?: string) {
  const resend = getResend()
  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'POV:NCERT <noreply@povncert.in>',
    to: email,
    subject: `Your POV:NCERT login code`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; background: #f9fbf2; padding: 32px; border-radius: 16px;">
        <div style="background: #1a2e00; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: #cde182; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">POV:NCERT</h1>
        </div>
        <h2 style="color: #1a2e00; font-size: 20px; margin: 0 0 8px;">Hi${name ? ` ${name}` : ''}!</h2>
        <p style="color: #3b6d11; font-size: 15px; margin: 0 0 24px;">Use the code below to log in to POV:NCERT. It expires in <strong>10 minutes</strong>.</p>
        <div style="background: #1a2e00; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="color: #cde182; font-size: 40px; font-weight: 800; letter-spacing: 10px;">${otp}</span>
        </div>
        <p style="color: #3b6d11; font-size: 13px; margin: 0;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #d6e8a0; margin: 24px 0;" />
        <p style="color: #3b6d11; font-size: 12px; margin: 0; text-align: center;">© ${new Date().getFullYear()} POV:NCERT · All rights reserved</p>
      </div>
    `,
  })
}
