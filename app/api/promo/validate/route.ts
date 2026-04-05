import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await request.json()
  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 })
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Promo code has expired' }, { status: 400 })
  }

  if (data.max_uses !== null && data.uses_count >= data.max_uses) {
    return NextResponse.json({ error: 'Promo code usage limit reached' }, { status: 400 })
  }

  const basePrice = 599
  const discountedPrice =
    data.discount_type === 'percent'
      ? Math.round(basePrice * (1 - data.discount_value / 100))
      : Math.max(0, basePrice - data.discount_value)

  return NextResponse.json({
    valid: true,
    code: data.code,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    final_price: discountedPrice,
  })
}
