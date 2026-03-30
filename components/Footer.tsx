import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#1a2e00] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/yash.png"
                alt="Yash Dhage"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#3b6d11]"
              />
              <div>
                <p className="font-bold">Yash Dhage</p>
                <p className="text-xs text-[#e2ecb7]">Creator, POV:NCERT</p>
              </div>
            </div>
            <p className="text-sm text-[#e2ecb7] leading-relaxed max-w-sm">
              NEET aspirant turned MBBS student. I created POV:NCERT to share the
              exact notes that helped me crack NEET — chapter-wise, concept-clear,
              and exam-ready.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#cde182]">Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Terms & Conditions', href: '/terms-and-conditions' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Contact', href: '/contact' },
                { label: 'Pricing', href: '/pricing' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e2ecb7] hover:text-[#cde182] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#3b6d11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <p className="text-xs text-[#e2ecb7]">
            © {new Date().getFullYear()} POV:NCERT. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['𝕏', 'ig', 'yt', 'in'].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full border border-[#3b6d11] flex items-center justify-center text-xs text-[#e2ecb7] hover:bg-[#3b6d11] transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
