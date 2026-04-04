import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Privacy Policy — POV:NCERT' }

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1a2e00] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#3b6d11] mb-8">Effective Date: 30 March 2026</p>

        <p className="text-[#3b6d11] leading-relaxed mb-8">
          POV NCERT (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy and is committed to protecting your
          personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
        </p>

        <div className="space-y-6 text-[#1a2e00]">
          {[
            {
              title: '1. Information We Collect',
              content: 'Account Information: Name, email, login credentials. Payment Information: All payments are securely processed via Razorpay. We do not store card details. Usage Data: Chapters accessed, features used, and other interactions to improve our services.',
            },
            {
              title: '2. How We Use Your Information',
              content: 'To provide access to POV NCERT chapters and features. To send updates, notifications, and promotional material about free chapters, new content, or offers. To improve our website and app for a better learning experience.',
            },
            {
              title: '3. Sharing of Information',
              content: 'Your data will not be shared with third parties, except as required to process payments via Razorpay or as required by law.',
            },
            {
              title: '4. Security',
              content: 'We use encrypted connections (HTTPS) and other reasonable measures to protect your information. Do not share your login credentials. Attempting to share content may lead to account deletion.',
            },
            {
              title: '5. Cookies & Analytics',
              content: 'We may use cookies or similar tools to analyze site usage, improve performance, and personalize your experience.',
            },
            {
              title: '6. Contact',
              content: 'For any privacy-related questions, contact: Email: neetmcqs@gmail.com',
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
