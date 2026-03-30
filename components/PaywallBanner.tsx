'use client'

import Link from 'next/link'

export default function PaywallBanner() {
  return (
    <div className="relative">
      {/* Blurred notes preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 filter blur-sm pointer-events-none select-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#d6e8a0] rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-[#e2ecb7] text-[#3b6d11] text-xs font-bold px-2 py-1 rounded-full">
                Ch. {i + 1}
              </span>
            </div>
            <div className="h-4 bg-[#e2ecb7] rounded mb-2 w-3/4" />
            <div className="h-4 bg-[#e2ecb7] rounded mb-4 w-1/2" />
            <div className="h-8 bg-[#cde182] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white border-2 border-[#cde182] rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
          <div className="w-14 h-14 bg-[#cde182] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#1a2e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1a2e00] mb-2">Unlock Paid Content</h3>
          <p className="text-[#3b6d11] text-sm mb-4">
            Get lifetime access to all paid Biology chapters — written by an MBBS student.
          </p>
          <ul className="text-left space-y-2 mb-6">
            {[
              'All paid Biology chapters',
              'Chapter-wise PDF notes',
              'Secure, watermarked viewer',
              'Lifetime access',
              'Read on any device',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-[#3b6d11]">
                <span className="text-[#cde182] font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/payment"
            className="block w-full bg-[#1a2e00] text-white font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors"
          >
            Pay Now — Get Access
          </Link>
          <p className="text-xs text-[#3b6d11] mt-3">One-time payment · Lifetime access</p>
        </div>
      </div>
    </div>
  )
}
