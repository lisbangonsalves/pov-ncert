import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendOtpEmail } from '@/lib/resend'
import { checkOtpRateLimit } from '@/lib/rate-limit'

function generateOtp() {
  return randomInt(100000, 1000000).toString()
}

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = getSupabaseAdmin()

  // Check user exists
  const { data: user } = await supabase
    .from('users')
    .select('id, name, is_blocked')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!user) return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 })
  if (user.is_blocked) return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 })

  if (!checkOtpRateLimit(email.toLowerCase().trim())) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  // email_verified check intentionally skipped — OTP is used to verify email

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  // Invalidate any existing OTPs for this email
  await supabase.from('otp_codes').delete().eq('email', email.toLowerCase().trim())

  // Store new OTP
  await supabase.from('otp_codes').insert({
    email: email.toLowerCase().trim(),
    code: otp,
    expires_at: expiresAt,
  })

  // Send email
  await sendOtpEmail(email, otp, user.name)

  return NextResponse.json({ success: true })
}
