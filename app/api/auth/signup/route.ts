import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendOtpEmail } from '@/lib/resend'
import { hashPassword } from '@/lib/password'

function generateOtp() {
  return randomInt(100000, 1000000).toString()
}

async function isOtpRequired(): Promise<boolean> {
  const { data } = await getSupabaseAdmin()
    .from('settings')
    .select('value')
    .eq('key', 'otp_required')
    .single()
  // Default to true if setting is missing
  return !data || data.value !== 'false'
}

export async function POST(request: NextRequest) {
  const { email, name, password } = await request.json()

  if (!email || !name || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const normalizedEmail = email.toLowerCase().trim()

  // Check if user already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Unable to create account with this email.' }, { status: 409 })
  }

  const otpRequired = await isOtpRequired()

  if (!otpRequired) {
    // OTP disabled — create account directly, no email sent
    const { error: createError } = await supabase.from('users').insert({
      email: normalizedEmail,
      name,
      password: hashPassword(password),
      role: 'student',
      is_blocked: false,
      has_paid: false,
      email_verified: true,
    })

    if (createError) {
      return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, otp_required: false }, { status: 200 })
  }

  // OTP enabled — store signup data in OTP record, create user only after verification
  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  await supabase.from('otp_codes').delete().eq('email', normalizedEmail)
  await supabase.from('otp_codes').insert({
    email: normalizedEmail,
    code: otp,
    expires_at: expiresAt,
    pending_name: name,
    pending_password: hashPassword(password),
  })

  await sendOtpEmail(normalizedEmail, otp, name)

  return NextResponse.json({ success: true, otp_required: true }, { status: 200 })
}
