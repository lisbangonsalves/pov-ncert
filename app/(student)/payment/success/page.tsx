import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PaymentSuccessPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-10 shadow-sm">
          <div className="w-20 h-20 bg-[#cde182] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-[#1a2e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#1a2e00] mb-2">Payment Successful!</h1>
          <p className="text-[#3b6d11] mb-6">
            You now have lifetime access to all paid Biology chapters.
          </p>

          <div className="bg-[#f9fbf2] border border-[#d6e8a0] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-[#1a2e00] mb-2">What&apos;s unlocked:</p>
            <ul className="space-y-1">
              {[
                'All paid Biology chapters',
                'Chapter-wise PDF notes',
                'Lifetime access',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#3b6d11]">
                  <span className="text-[#3b6d11] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/dashboard?tab=paid"
            className="block w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
