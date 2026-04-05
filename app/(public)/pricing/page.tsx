import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Pricing — POV:NCERT' }

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1a2e00] mb-3">Simple, Transparent Pricing</h1>
          <p className="text-[#3b6d11] text-lg">Start free. Unlock NEET when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="bg-white border-2 border-[#d6e8a0] rounded-2xl p-8">
            <div className="mb-6">
              <span className="bg-[#e2ecb7] text-[#3b6d11] text-xs font-bold px-3 py-1 rounded-full">
                FREE
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1a2e00] mb-1">Free Content</h2>
            <p className="text-[#3b6d11] text-sm mb-6">Foundation notes to build your base</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1a2e00]">₹0</span>
              <span className="text-[#3b6d11] ml-2">forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'All free Biology chapters',
                'Chapter-wise PDFs',
                'Secure in-browser viewer',
                'No download required',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#3b6d11]">
                  <span className="text-[#cde182] font-bold text-base">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center w-full border-2 border-[#1a2e00] text-[#1a2e00] font-bold py-3 rounded-xl hover:bg-[#e2ecb7] transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Paid Tier */}
          <div className="bg-[#1a2e00] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cde182] opacity-10 rounded-full -translate-y-8 translate-x-8" />
            <div className="mb-6">
              <span className="bg-[#cde182] text-[#1a2e00] text-xs font-bold px-3 py-1 rounded-full">
                NEET PACK
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Paid Content</h2>
            <p className="text-[#e2ecb7] text-sm mb-6">Exam-focused notes from an MBBS student</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#cde182]">₹599</span>
              <span className="text-[#e2ecb7] ml-2">one-time</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Free tier',
                'All paid Biology chapters',
                'Exam-focused tips & shortcuts',
                'High-yield topics highlighted',
                'Lifetime access',
                'Future updates included',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#e2ecb7]">
                  <span className="text-[#cde182] font-bold text-base">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center w-full bg-[#cde182] text-[#1a2e00] font-bold py-3 rounded-xl hover:bg-[#b8d06e] transition-colors"
            >
              Get NEET Notes
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-[#3b6d11] mt-8">
          Questions?{' '}
          <Link href="/contact" className="underline font-medium text-[#1a2e00]">
            Contact us
          </Link>
          {' '}·{' '}
          <Link href="/refund-policy" className="underline font-medium text-[#1a2e00]">
            Refund Policy
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
