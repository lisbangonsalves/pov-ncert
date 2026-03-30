'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  name: string
  email: string
}

export default function UserMenu({ name, email }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 rounded-full bg-[#3b6d11] flex items-center justify-center hover:bg-[#4a8a16] transition-colors"
        aria-label="Account menu"
      >
        <svg className="w-4 h-4 text-[#cde182]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-52 bg-white border border-[#d6e8a0] rounded-2xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f7da]">
            <p className="text-xs font-semibold text-[#1a2e00] truncate">{name || email}</p>
            {name && <p className="text-xs text-[#3b6d11] truncate mt-0.5">{email}</p>}
          </div>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </a>
        </div>
      )}
    </div>
  )
}
