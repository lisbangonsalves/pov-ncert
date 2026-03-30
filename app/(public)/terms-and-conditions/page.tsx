import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Terms & Conditions — POV:NCERT' }

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1a2e00] mb-2">Terms & Conditions</h1>
        <p className="text-sm text-[#3b6d11] mb-8">Last updated: March 2025</p>

        <div className="space-y-6">
          {[
            {
              title: '1. Acceptance of Terms',
              content:
                'By accessing or using POV:NCERT, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.',
            },
            {
              title: '2. Use of Content',
              content:
                'All notes, PDFs, and content on POV:NCERT are protected by copyright. You may not reproduce, distribute, modify, or create derivative works without prior written consent. Notes are for personal, non-commercial use only.',
            },
            {
              title: '3. Account Responsibilities',
              content:
                'You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others. Sharing login credentials may result in immediate account suspension without refund.',
            },
            {
              title: '4. Payment and Access',
              content:
                'NEET Biology notes require a one-time payment. Class 11 and Class 12 notes are provided free of charge. Paid access is granted to the registered user only and is non-transferable.',
            },
            {
              title: '5. Prohibited Activities',
              content:
                'You may not attempt to bypass security measures, download or screen-record PDF content, share watermarked PDFs, use automated tools to access content, or engage in any activity that could harm other users or the platform.',
            },
            {
              title: '6. Termination',
              content:
                'We reserve the right to terminate or suspend your account at any time for violation of these terms, without prior notice. Account suspension does not entitle you to a refund.',
            },
            {
              title: '7. Disclaimer',
              content:
                'POV:NCERT notes are educational resources to supplement your studies. We do not guarantee any specific results in your NEET examination. All academic outcomes depend on your individual effort and preparation.',
            },
            {
              title: '8. Governing Law',
              content:
                'These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.',
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
