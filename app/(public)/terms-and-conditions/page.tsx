import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Terms & Conditions — POV:NCERT' }

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1a2e00] mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-[#3b6d11] mb-4">Effective Date: 30 March 2026</p>
        <p className="text-[#3b6d11] leading-relaxed mb-8">By using POV NCERT, you agree to the following terms:</p>

        <div className="space-y-6">
          {[
            {
              title: '1. Content Ownership',
              content: 'All chapters, diagrams, mnemonics, and Topper\'s POV sections are owned by Yash Dhage. Users may not copy, distribute, or share content without permission. Violation may result in account deletion.',
            },
            {
              title: '2. Access & Payment',
              content: 'Access to chapters is granted after successful payment via Razorpay. Payment is final, and unlocking content is tied to your account.',
            },
            {
              title: '3. User Accounts',
              content: 'Users must register with valid email credentials. You are responsible for keeping your account secure.',
            },
            {
              title: '4. Refund Policy',
              content: 'Refunds, if any, follow Razorpay\'s transaction policy. Contact support for assistance.',
            },
            {
              title: '5. Use of Website & App',
              content: 'The website and app are for personal educational use only. Unauthorized sharing or misuse may lead to termination of account.',
            },
            {
              title: '6. Disclaimer',
              content: 'POV NCERT is designed for NEET UG exam preparation. We do not guarantee exam results. Users should use the content at their own discretion.',
            },
            {
              title: '7. Modifications',
              content: 'We may update these Terms & Conditions from time to time. Updates will be posted on the website.',
            },
            {
              title: '8. Contact',
              content: 'For any questions about these Terms & Conditions, contact: Email: neetmcqs@gmail.com',
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-[#1a2e00] mb-2">{section.title}</h2>
              <p className="text-[#3b6d11] leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
