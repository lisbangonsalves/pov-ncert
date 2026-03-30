import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Privacy Policy — POV:NCERT' }

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1a2e00] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#3b6d11] mb-8">Last updated: March 2025</p>

        <div className="space-y-6 text-[#1a2e00]">
          {[
            {
              title: '1. Information We Collect',
              content:
                'We collect information you provide directly to us, such as your name, email address, and payment information when you register and purchase our notes. We also collect usage data such as pages viewed and time spent on the platform.',
            },
            {
              title: '2. How We Use Your Information',
              content:
                'We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions. We may use your email to send updates about new notes or features.',
            },
            {
              title: '3. Data Security',
              content:
                'We implement appropriate technical and organizational measures to protect your personal information. Your PDF notes are served via signed, time-limited URLs and are never exposed as direct download links. All notes are watermarked with your email address.',
            },
            {
              title: '4. Third-Party Services',
              content:
                'We use Razorpay for payment processing, which is governed by their own privacy policy. We use Supabase for data storage, which complies with GDPR and other applicable data protection laws.',
            },
            {
              title: '5. Data Retention',
              content:
                'We retain your account information for as long as your account is active. You may request deletion of your account and associated data by contacting us.',
            },
            {
              title: '6. Your Rights',
              content:
                'You have the right to access, correct, or delete your personal data. Contact us at the email provided on our contact page to exercise these rights.',
            },
            {
              title: '7. Contact Us',
              content:
                'If you have any questions about this Privacy Policy, please contact us through our Contact page.',
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
