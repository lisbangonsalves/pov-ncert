import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Refund Policy — POV:NCERT' }

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1a2e00] mb-2">Refund Policy</h1>
        <p className="text-sm text-[#3b6d11] mb-8">Last updated: March 2025</p>

        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📋</span>
            <h2 className="text-xl font-bold text-[#1a2e00]">Our Refund Policy</h2>
          </div>
          <p className="text-[#3b6d11] text-lg leading-relaxed font-medium">
            Due to the digital nature of our product, all sales are final. Once access to NEET
            Biology notes is granted, no refunds will be issued.
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-[#1a2e00] mb-2">Dispute Resolution</h2>
            <p className="text-[#3b6d11] leading-relaxed">
              If you believe there has been an error with your payment or you did not receive
              access after a successful payment, please contact us within{' '}
              <strong>48 hours</strong> of the transaction. We will investigate and resolve
              genuine technical issues.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e00] mb-2">How to Contact Us</h2>
            <p className="text-[#3b6d11] leading-relaxed">
              For payment disputes, please use our{' '}
              <a href="/contact" className="text-[#1a2e00] underline font-medium">
                Contact page
              </a>{' '}
              and include your registered email address, the date of payment, and a description
              of the issue. We aim to respond within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e00] mb-2">Exceptions</h2>
            <p className="text-[#3b6d11] leading-relaxed">
              Refunds will not be provided for accounts suspended due to violation of our Terms
              and Conditions, including sharing account credentials or attempting to bypass
              security measures.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
