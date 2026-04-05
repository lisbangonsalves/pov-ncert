'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState<{
    code: string
    discount_type: 'percent' | 'flat'
    discount_value: number
    final_price: number
  } | null>(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const finalPrice = promoApplied ? promoApplied.final_price : 599

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const applyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoError('')
    setPromoApplied(null)
    setPromoLoading(true)
    const res = await fetch('/api/promo/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoInput.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setPromoApplied(data)
    } else {
      setPromoError(data.error || 'Invalid promo code')
    }
    setPromoLoading(false)
  }

  const removePromo = () => {
    setPromoApplied(null)
    setPromoInput('')
    setPromoError('')
  }

  const handlePayment = async () => {
    setError('')
    setLoading(true)

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setError('Failed to load payment gateway. Please try again.')
      setLoading(false)
      return
    }

    const orderRes = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promo_code: promoApplied?.code }),
    })

    if (!orderRes.ok) {
      setError('Failed to create order. Please try again.')
      setLoading(false)
      return
    }

    const { orderId, amount, currency, keyId } = await orderRes.json()

    const options = {
      key: keyId,
      amount,
      currency,
      name: 'POV:NCERT',
      description: 'Paid Content — Lifetime Access',
      order_id: orderId,
      prefill: {
        email: session?.user?.email || '',
        name: session?.user?.name || '',
      },
      theme: { color: '#cde182' },
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

        if (verifyRes.ok) {
          await update()
          router.push('/payment/success')
        } else {
          setError('Payment verification failed. Contact support if amount was deducted.')
          setLoading(false)
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => {
      setError('Payment failed. Please try again.')
      setLoading(false)
    })
    rzp.open()
  }

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <nav className="bg-white border-b border-[#d6e8a0] h-14 flex items-center px-4">
        <Link href="/dashboard" className="text-[#3b6d11] text-sm flex items-center gap-1">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-12">
        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-8 shadow-sm">
          {/* Order Summary */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Order Summary</h1>
            <p className="text-sm text-[#3b6d11]">Paid Content — Lifetime Access</p>
          </div>

          <div className="border border-[#d6e8a0] rounded-xl p-4 mb-6 bg-[#f9fbf2]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#cde182] rounded-lg flex items-center justify-center">
                <span className="text-[#1a2e00] font-bold">📚</span>
              </div>
              <div>
                <p className="font-semibold text-[#1a2e00] text-sm">Biology — Paid Content</p>
                <p className="text-xs text-[#3b6d11]">All paid chapters · Lifetime access</p>
              </div>
            </div>

            <ul className="space-y-1.5 mb-4">
              {[
                'All paid Biology chapters',
                'Chapter-wise PDF notes',
                'Secure in-browser viewer',
                'Lifetime access',
                'Future updates',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-[#3b6d11]">
                  <span className="text-[#cde182] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="border-t border-[#d6e8a0] pt-3 space-y-1">
              {promoApplied && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#3b6d11]">Original price</span>
                  <span className="line-through text-gray-400">₹599</span>
                </div>
              )}
              {promoApplied && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">
                    Promo: {promoApplied.code} (
                    {promoApplied.discount_type === 'percent'
                      ? `${promoApplied.discount_value}% off`
                      : `₹${promoApplied.discount_value} off`}
                    )
                  </span>
                  <span className="text-green-600 font-medium">
                    −{promoApplied.discount_type === 'percent'
                      ? `₹${599 - promoApplied.final_price}`
                      : `₹${promoApplied.discount_value}`}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#3b6d11]">Total</span>
                <span className="text-xl font-bold text-[#1a2e00]">₹{finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#3b6d11] mb-1.5">Promo Code</label>
            {promoApplied ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                <div>
                  <span className="text-sm font-bold text-green-700">{promoApplied.code}</span>
                  <span className="text-xs text-green-600 ml-2">applied</span>
                </div>
                <button
                  onClick={removePromo}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  className="flex-1 border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
                />
                <button
                  onClick={applyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-4 py-2 bg-[#e2ecb7] text-[#1a2e00] text-sm font-bold rounded-lg hover:bg-[#cde182] transition-colors disabled:opacity-50"
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {promoError && (
              <p className="mt-1.5 text-xs text-red-600">{promoError}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-4 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60 text-lg"
          >
            {loading ? 'Processing...' : `Proceed to Pay ₹${finalPrice}`}
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-xs text-[#3b6d11]">Secured by</span>
            <span className="font-bold text-[#3b6d11] text-sm">Razorpay</span>
          </div>

          <p className="text-xs text-center text-[#3b6d11] mt-3">
            By paying, you agree to our{' '}
            <Link href="/terms-and-conditions" className="underline">Terms</Link> and{' '}
            <Link href="/refund-policy" className="underline">Refund Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}
