'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '▦' },
  { label: 'Subjects', href: '/admin/subjects', icon: '📚' },
  { label: 'Manage Notes', href: '/admin/notes', icon: '📄' },
  { label: 'Manage Students', href: '/admin/students', icon: '👥' },
  { label: 'Promo Codes', href: '/admin/promo', icon: '🏷️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#1a2e00] min-h-screen flex flex-col">
      <div className="p-5 border-b border-[#3b6d11]">
        <Image src="/logo.png" alt="POV:NCERT" height={18} width={140} className="h-4.5 w-auto" priority />
        <p className="text-xs text-[#e2ecb7] mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#cde182] text-[#1a2e00]'
                  : 'text-[#e2ecb7] hover:bg-[#3b6d11]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#3b6d11]">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#e2ecb7] hover:bg-[#3b6d11] transition-colors"
        >
          <span>⏻</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
