import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'POV: NCERT by Yash Dhage',
  description: 'This is not the NCERT you want, but the NCERT you need.',
}

const features = [
  {
    icon: '📝',
    title: 'Bullet-point format',
    desc: 'No long boring paragraphs — every concept broken down into clean, scannable points.',
  },
  {
    icon: '📖',
    title: 'Full NCERT Coverage',
    desc: 'Covers the entire old (unrevised) NCERT with all NEET-relevant topics included.',
  },
  {
    icon: '📅',
    title: '38 Years of PYQs Marked',
    desc: 'Every NEET Previous Year Question tagged with [Year] right inside the notes.',
  },
  {
    icon: '✏️',
    title: 'NCERT & Exemplar Tagged',
    desc: 'All NCERT Exercise questions tagged [NCERT] and Exemplar questions tagged [Exemplar].',
  },
  {
    icon: '❓',
    title: 'Potential Questions Marked',
    desc: 'Likely NEET questions marked [Q] and Assertion-Reason questions marked [AR].',
  },
  {
    icon: '🔵',
    title: 'High-Yield Extra Points',
    desc: 'Out-of-NCERT high-yield points from PYQs highlighted in blue for extra edge.',
  },
  {
    icon: '🔒',
    title: 'Bold & Grey Highlights',
    desc: 'Important points in bold for fast revision. Less important points in grey.',
  },
  {
    icon: '🔗',
    title: 'Cross-chapter References',
    desc: 'Reference links connecting related topics across chapters for integrated understanding.',
  },
  {
    icon: '📄',
    title: 'Fewer Pages than NCERT',
    desc: 'More content, less fluff — covers everything in fewer pages than the original.',
  },
  {
    icon: '🧪',
    title: '10 Practice Questions',
    desc: 'Each chapter ends with 10 PYQ and fact-based practice questions.',
  },
  {
    icon: '🏆',
    title: "Topper's POV Section",
    desc: 'Extra high-yield facts added in a dedicated Topper\'s POV section per chapter.',
  },
  {
    icon: '📊',
    title: 'Smart Tables',
    desc: 'Quick-comparison tables added for easy recall of related concepts.',
  },
  {
    icon: '🖼️',
    title: 'New Labeled Diagrams',
    desc: 'Important diagrams with proper labeling added wherever needed.',
  },
  {
    icon: '🧠',
    title: 'Mnemonics Included',
    desc: 'Easy-to-remember mnemonics included in every chapter for faster recall.',
  },
]

const reviews = [
  {
    quote:
      'Bhai yaar, mera POV: NCERT Biology se Aakash ke kal ke test mein 360 mein se 356 aaye. Sach mein, best notes hain!',
    name: 'Ankur Bamal',
    label: 'NEET Aspirant',
    initials: 'AB',
  },
  {
    quote:
      'POV: NCERT Biology, such a nice notes. Each and every line from NCERT and PYQ, you can also understand this without watching any lectures yet.',
    name: 'Singh',
    label: 'NEET Aspirant',
    initials: 'S',
  },
  {
    quote:
      'POV: NCERT Biology is a gem. I literally hated Morphology and Anatomy NCERT so so so much, I can\'t even explain. The job that should be done by NCERT is done by you.',
    name: 'Arman',
    label: 'NEET Aspirant',
    initials: 'A',
  },
]

const faqs = [
  {
    q: 'Who is POV NCERT for?',
    a: 'POV NCERT is ideal for NEET UG aspirants, whether you\'re reading for the first time or revising for faster retention. It is also useful for NEET educators as a reference for teaching.',
  },
  {
    q: 'Can I use POV NCERT if I\'m reading the chapter for the first time?',
    a: 'Yes. It is suitable for first-time readers and designed to make concepts clear and easy to understand.',
  },
  {
    q: 'Do I still need to read NCERT if I use POV NCERT?',
    a: 'No. POV NCERT covers 100% of NCERT along with extra points relevant for NEET.',
  },
  {
    q: 'Is POV NCERT enough for NEET?',
    a: 'Yes. It is enough for theory. For best results, focus on practicing MCQs after studying it.',
  },
  {
    q: 'I already have NCERT. Why should I use this?',
    a: 'POV NCERT helps you see exactly what matters for NEET, reduces unnecessary reading time, and connects concepts with PYQs so you revise smarter, not harder.',
  },
  {
    q: 'I keep forgetting what I study. Will this help?',
    a: 'Yes. Its bullet points, mnemonics, bold highlights, and smart tables make revision easier and improve retention.',
  },
  {
    q: 'Is this useful if I am starting late for NEET?',
    a: 'Yes. It is especially useful if you are short on time. Each chapter can be completed in 2–3 hours, after which you don\'t need to read any other theory book.',
  },
  {
    q: 'I am already following coaching material. Do I still need this?',
    a: 'Coaching material is often bulky. POV NCERT helps you come back to NCERT in a simplified way and focus on what actually matters for NEET.',
  },
  {
    q: 'Can I download or share the content?',
    a: 'The content is accessible through your account only. To protect quality and fairness, sharing is restricted. Trying to share the content may result in your account being deleted.',
  },
  {
    q: 'What if I buy and don\'t find it useful?',
    a: 'It\'s hard not to like it! You can try the free chapters first and see for yourself before unlocking full access.',
  },
  {
    q: 'Why should I trust a new book over established ones?',
    a: 'Most books are generic. POV NCERT is built with a clear goal: NEET-focused NCERT understanding, based on real student struggles. It is not trying to cover everything, only what matters.',
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
          New: NEET 2026 Notes Available
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1a2e00] leading-tight mb-5">
          Introducing{' '}
          <span className="text-[#3b6d11]">POV: NCERT</span>
          <br />
          <span className="text-[#3b6d11]">Biology</span>
        </h1>
        <p className="text-lg text-[#3b6d11] mb-8 max-w-xl mx-auto">
          Not the NCERT you want, but the NCERT you need!
          <br />
          Reimagined by Yash Dhage
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link
            href="/signup"
            className="px-8 py-3 bg-[#1a2e00] text-[#cde182] font-bold rounded-xl hover:bg-[#3b6d11] transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>

        {/* YouTube Embed */}
        <div className="rounded-2xl overflow-hidden border-2 border-[#d6e8a0] shadow-xl max-w-2xl mx-auto">
          <div className="relative aspect-video">
            <iframe
              src="https://www.youtube.com/embed/wcAaRoQLGE8"
              title="How POV:NCERT works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* ── Sections / Chapters ── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2e00] mb-3">What&apos;s Inside</h2>
            <p className="text-[#3b6d11]">All chapters from Class XI &amp; XII. Free chapters accessible instantly after signup.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Class XI */}
            <div>
              <h3 className="text-lg font-bold text-[#1a2e00] mb-4 pb-2 border-b border-[#d6e8a0]">Class XI</h3>
              <ul className="space-y-2">
                {[
                  { name: 'The Living World', free: true },
                  { name: 'Biological Classification', free: true },
                  { name: 'Plant Kingdom', free: true },
                  { name: 'Animal Kingdom', free: true },
                  { name: 'Morphology of Flowering Plants', free: true },
                  { name: 'Anatomy of Flowering Plants', free: true },
                  { name: 'Structural Organisation in Animals', free: true },
                  { name: 'Cell: The Unit of Life', free: true },
                  { name: 'Biomolecules', free: true },
                  { name: 'Cell Cycle and Cell Division', free: true },
                  { name: 'Photosynthesis in Higher Plants', free: false },
                  { name: 'Respiration in Plants', free: false },
                  { name: 'Plant Growth and Development', free: false },
                  { name: 'Breathing and Exchange of Gases', free: false },
                  { name: 'Body Fluids and Circulation', free: false },
                  { name: 'Excretory Products and Their Elimination', free: false },
                  { name: 'Locomotion and Movement', free: false },
                  { name: 'Neural Control and Coordination', free: false },
                  { name: 'Chemical Coordination and Integration', free: false },
                ].map((ch) => (
                  <li key={ch.name} className="flex items-center justify-between text-sm py-1">
                    <span className="text-[#1a2e00]">{ch.name}</span>
                    {ch.free && (
                      <span className="text-xs font-bold text-[#3b6d11] bg-[#e2ecb7] px-2 py-0.5 rounded-full">Free</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Class XII */}
            <div>
              <h3 className="text-lg font-bold text-[#1a2e00] mb-4 pb-2 border-b border-[#d6e8a0]">Class XII</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Sexual Reproduction in Flowering Plants', free: false },
                  { name: 'Human Reproduction', free: false },
                  { name: 'Reproductive Health', free: false },
                  { name: 'Principles of Inheritance and Variation', free: false },
                  { name: 'Molecular Basis of Inheritance', free: false },
                  { name: 'Evolution', free: false },
                  { name: 'Human Health and Disease', free: true },
                  { name: 'Microbes in Human Welfare', free: true },
                  { name: 'Biotechnology: Principles and Processes', free: false },
                  { name: 'Biotechnology and Its Applications', free: false },
                  { name: 'Organisms and Populations', free: false },
                  { name: 'Ecosystem', free: false },
                  { name: 'Biodiversity and Its Conservation', free: false },
                ].map((ch) => (
                  <li key={ch.name} className="flex items-center justify-between text-sm py-1">
                    <span className="text-[#1a2e00]">{ch.name}</span>
                    {ch.free && (
                      <span className="text-xs font-bold text-[#3b6d11] bg-[#e2ecb7] px-2 py-0.5 rounded-full">Free</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 bg-[#f9fbf2]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2e00] mb-3">What NEET Aspirants Are Saying</h2>
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
            One-time payment of ₹599 · Lifetime access
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
