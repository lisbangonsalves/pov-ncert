import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendOtpEmail } from '@/lib/resend'
import { hashPassword } from '@/lib/password'

function generateOtp() {
  return randomInt(100000, 1000000).toString()
}

export async function POST(request: NextRequest) {
  const { email, name, password } = await request.json()

  if (!email || !name || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const normalizedEmail = email.toLowerCase().trim()

  // Check if a verified user already exists with this email
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Unable to create account with this email.' }, { status: 409 })
  }

  // Do NOT create the user yet — store signup data in the OTP record.
  // The user row is created only after they verify their email.
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

  return NextResponse.json({ success: true }, { status: 200 })
}
