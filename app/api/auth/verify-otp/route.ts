import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json()
  if (!email || !otp) return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const normalizedEmail = email.toLowerCase().trim()

  // Atomic: verify OTP and mark it used in a single SQL statement to prevent race conditions
  const { data: otpId } = await supabase.rpc('verify_otp_atomic', {
    p_email: normalizedEmail,
    p_code: otp,
  })

  if (!otpId) {
    return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 })
  }

  // Read the OTP record to check if this was a signup OTP (has pending user data)
  const { data: otpRecord } = await supabase
    .from('otp_codes')
    .select('pending_name, pending_password')
    .eq('id', otpId)
    .single()

  if (otpRecord?.pending_name && otpRecord?.pending_password) {
    // Signup flow — create the user now that email is verified
    const { error: createError } = await supabase.from('users').insert({
      email: normalizedEmail,
      name: otpRecord.pending_name,
      password: otpRecord.pending_password,
      role: 'student',
      is_blocked: false,
      has_paid: false,
      email_verified: true,
    })

    if (createError) {
      return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
    }
  } else {
    // Login OTP — user already exists, just mark email verified
    await supabase.from('users').update({ email_verified: true }).eq('email', normalizedEmail)
  }

  return NextResponse.json({ success: true })
}
