import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id as string

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await request.json()

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
  }

  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  )

  if (!isValid) {
    // Mark payment as failed — best-effort, no ownership check needed here
    await getSupabaseAdmin()
      .from('payments')
      .update({ status: 'failed' })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', userId)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Atomic: verify ownership, update payment status, grant user access, and increment promo
  // in a single transaction via the complete_payment SQL function
  const { data: success } = await getSupabaseAdmin().rpc('complete_payment', {
    p_order_id: razorpay_order_id,
    p_payment_id: razorpay_payment_id,
    p_user_id: userId,
  })

  if (!success) {
    return NextResponse.json({ error: 'Payment not found or already processed' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
