import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'POV:NCERT — NEET Biology Notes by an MBBS Student',
  description:
    'Chapter-wise NEET Biology notes written by an MBBS student. Free for Class 11 & 12. One-time payment for NEET pack.',
}

const features = [
  {
    icon: '🩺',
    title: 'Written by an MBBS Student',
    desc: 'Notes crafted from first-hand NEET experience — not textbook summaries.',
  },
  {
    icon: '📚',
    title: 'Chapter-wise Structure',
    desc: 'Every chapter organized clearly so you study exactly what you need.',
  },
  {
    icon: '🆓',
    title: 'Free Content',
    desc: 'A curated set of chapters are completely free — no strings attached.',
  },
  {
    icon: '🔒',
    title: 'Secure PDF Viewer',
    desc: 'Notes open in a secure viewer. No downloads, no sharing — your access only.',
  },
  {
    icon: '📱',
    title: 'Read Anywhere',
    desc: 'Access your notes from any device — phone, tablet, or laptop.',
  },
  {
    icon: '💳',
    title: 'One-Time Payment',
    desc: 'Pay once for NEET Biology and get lifetime access. No subscriptions.',
  },
]

const reviews = [
  {
    quote:
      'These notes are concise and exam-focused. I used them alongside my coaching and they made a huge difference in Biology.',
    name: 'Sneha R.',
    label: 'NEET 2024 — AIR 1240',
    initials: 'SR',
  },
  {
    quote:
      'Free Class 11 & 12 notes? Genuinely could not believe this. Yash has put in so much effort for aspirants like us.',
    name: 'Arjun M.',
    label: 'Dropper — Batch 2025',
    initials: 'AM',
  },
  {
    quote:
      'The NEET pack is worth every rupee. The high-yield topics are clearly marked and the explanations are super clear.',
    name: 'Priya K.',
    label: 'NEET 2025 Aspirant',
    initials: 'PK',
  },
]

const faqs = [
  {
    q: 'Are Class 11 and Class 12 notes really free?',
    a: 'Yes, completely free. Just create an account and you can access all Class 11 and Class 12 Biology chapters at no cost.',
  },
  {
    q: 'What is included in the NEET pack?',
    a: 'The NEET pack includes all NEET-specific Biology chapters with exam-focused notes, high-yield topics highlighted, and mnemonics and shortcuts used in actual NEET preparation.',
  },
  {
    q: 'Can I download the PDFs?',
    a: 'No. To protect the content, all notes are viewed in a secure, watermarked in-browser viewer. Downloads are disabled to ensure the content stays exclusive to paying users.',
  },
  {
    q: 'What happens to my access if I switch devices?',
    a: 'Your account works on any device. Just log in with your email and password and all your notes will be available instantly.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#e2ecb7] text-[#3b6d11] text-xs font-bold px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#3b6d11] inline-block" />
          New: NEET 2025 Notes Available
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1a2e00] leading-tight mb-5">
          Introducing{' '}
          <span className="text-[#3b6d11]">POV: NCERT</span>
          <br />
          <span className="text-[#3b6d11]">Biology</span>
        </h1>
        <p className="text-lg text-[#3b6d11] mb-8 max-w-xl mx-auto">
          Chapter-wise Biology notes written by an MBBS student. Free for Class 11 &amp; 12.
          One-time payment for the full NEET pack.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link
            href="/signup"
            className="px-8 py-3 bg-[#1a2e00] text-[#cde182] font-bold rounded-xl hover:bg-[#3b6d11] transition-colors text-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-3 border-2 border-[#3b6d11] text-[#3b6d11] font-bold rounded-xl hover:bg-[#e2ecb7] transition-colors text-lg"
          >
            View Pricing
          </Link>
        </div>

        {/* YouTube Placeholder */}
        <div className="rounded-2xl overflow-hidden border-2 border-[#d6e8a0] shadow-xl max-w-2xl mx-auto">
          <div className="relative bg-[#1a2e00] aspect-video flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#cde182] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-[#1a2e00] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="absolute bottom-4 text-[#e2ecb7] text-sm">
              Watch: How POV:NCERT works
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="notes" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2e00] mb-3">
              Everything you need to ace Biology
            </h2>
            <p className="text-[#3b6d11]">Built for NEET aspirants by someone who&apos;s been there.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-[#d6e8a0] rounded-2xl p-6 hover:shadow-md hover:border-[#cde182] transition-all"
              >
                <div className="w-11 h-11 bg-[#e2ecb7] rounded-xl flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#1a2e00] mb-2">{f.title}</h3>
                <p className="text-sm text-[#3b6d11] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 bg-[#f9fbf2]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2e00] mb-3">What students are saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="bg-white border border-[#d6e8a0] rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#cde182] text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-[#3b6d11] italic leading-relaxed mb-5">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#cde182] flex items-center justify-center text-[#1a2e00] font-bold text-xs">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e00]">{r.name}</p>
                    <p className="text-xs text-[#3b6d11]">{r.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1a2e00] text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="border border-[#d6e8a0] rounded-xl overflow-hidden group"
              >
                <summary className="px-5 py-4 cursor-pointer font-medium text-[#1a2e00] flex items-center justify-between hover:bg-[#f9fbf2] transition-colors list-none">
                  {faq.q}
                  <span className="ml-3 text-[#3b6d11] group-open:rotate-45 transition-transform text-xl font-light">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-[#3b6d11] leading-relaxed border-t border-[#d6e8a0] pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#cde182] py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1a2e00] mb-4">
            Access all chapters today
          </h2>
          <p className="text-[#3b6d11] mb-8">
            Join thousands of NEET aspirants using POV:NCERT.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#1a2e00] text-[#cde182] font-bold px-10 py-4 rounded-xl text-lg hover:bg-[#3b6d11] transition-colors"
          >
            Get NEET Biology Notes
          </Link>
          <p className="text-sm text-[#3b6d11] mt-4">
            One-time payment of ₹499 · Lifetime access
          </p>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="bg-[#f9fbf2] py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-[#e2ecb7] text-[#3b6d11] text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                COMING SOON
              </span>
              <h2 className="text-3xl font-bold text-[#1a2e00] mb-4">
                POV:NCERT — The Printed Edition
              </h2>
              <p className="text-[#3b6d11] leading-relaxed mb-6">
                The same exam-ready notes, now in a beautifully designed printed format. Perfect
                for those who love studying with a pen in hand. Register your interest and be the
                first to know when it launches.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[#1a2e00] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#3b6d11] transition-colors"
              >
                Notify Me
              </Link>
            </div>

            <div className="flex justify-center">
              <Image
                src="/book-mockup.png"
                alt="POV:NCERT Biology — Printed Edition"
                width={380}
                height={480}
                className="w-72 sm:w-80 h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
