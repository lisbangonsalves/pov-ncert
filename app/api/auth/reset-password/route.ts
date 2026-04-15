import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
  const { email, otp, new_password } = await request.json()

  if (!email || !otp || !new_password) {
    return NextResponse.json({ error: 'Email, OTP and new password are required' }, { status: 400 })
  }

  if (new_password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const normalizedEmail = email.toLowerCase().trim()

  // Atomically verify and consume the OTP
  const { data: otpId } = await supabase.rpc('verify_otp_atomic', {
    p_email: normalizedEmail,
    p_code: otp,
  })

  if (!otpId) {
    return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 })
  }

  // Look up user ID to guarantee we update the correct row
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  // Update by ID and use .select() so Supabase v2 actually returns whether any row changed
  const { data: updated, error } = await supabase
    .from('users')
    .update({ password: hashPassword(new_password), email_verified: true })
    .eq('id', user.id)
    .select('id')

  if (error || !updated?.length) {
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
