'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

interface NavbarProps {
  variant?: 'public' | 'student' | 'admin'
}

export default function Navbar({ variant = 'public' }: NavbarProps) {
  const { data: session } = useSession()

  return (
    <nav className="bg-[#1a2e00] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image src="/logo.png" alt="POV:NCERT" height={20} width={160} className="h-5 w-auto" priority />
          </Link>

          {/* Center nav */}
          {variant === 'public' && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#notes" className="text-[#cde182] font-medium hover:text-white flex items-center gap-1">
                Biology
                <span className="bg-[#cde182] text-[#1a2e00] text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                  NEET
                </span>
              </Link>
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {variant === 'public' && !session && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-[#cde182] text-[#cde182] rounded-lg text-sm font-medium hover:bg-[#3b6d11] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-[#cde182] text-[#1a2e00] rounded-lg text-sm font-bold hover:bg-[#b8d06e] transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
            {session && (
              <Link
                href={(session.user as any)?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="px-4 py-2 bg-[#cde182] text-[#1a2e00] rounded-lg text-sm font-bold hover:bg-[#b8d06e] transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
