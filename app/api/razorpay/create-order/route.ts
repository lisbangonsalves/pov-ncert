import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { razorpay } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabase'

const BASE_PRICE_PAISE = 59900 // ₹599

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id as string
  let finalAmountPaise = BASE_PRICE_PAISE
  let appliedPromoId: string | null = null

  try {
    const body = await request.json().catch(() => ({}))
    const promoCode: string | undefined = body.promo_code

    if (promoCode) {
      const supabase = getSupabaseAdmin()
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (promo) {
        const expired = promo.expires_at && new Date(promo.expires_at) < new Date()
        const exhausted = promo.max_uses !== null && promo.uses_count >= promo.max_uses

        if (!expired && !exhausted) {
          const basePrice = 599
          const discountedRupees =
            promo.discount_type === 'percent'
              ? Math.round(basePrice * (1 - promo.discount_value / 100))
              : Math.max(0, basePrice - promo.discount_value)
          finalAmountPaise = discountedRupees * 100
          appliedPromoId = promo.id
        }
      }
    }

    const order = await razorpay.orders.create({
      amount: finalAmountPaise,
      currency: 'INR',
      receipt: `rcpt_${userId.slice(0, 8)}_${Date.now().toString().slice(-8)}`,
    })

    const supabase = getSupabaseAdmin()
    await supabase.from('payments').insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount: finalAmountPaise,
      status: 'pending',
      promo_code_id: appliedPromoId,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmountPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('Razorpay order creation failed:', {
      message: error?.message,
      description: error?.error?.description,
      keyId: process.env.RAZORPAY_KEY_ID ? 'set' : 'MISSING',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'set' : 'MISSING',
    })
    return NextResponse.json(
      { error: 'Failed to create order', detail: error?.error?.description || error?.message },
      { status: 500 }
    )
  }
}
