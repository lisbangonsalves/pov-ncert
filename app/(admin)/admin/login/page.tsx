'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('admin', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid admin credentials.')
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#1a2e00] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#cde182] flex items-center justify-center">
            <span className="text-[#1a2e00] font-bold">P</span>
          </div>
          <span className="font-bold text-white text-xl">POV:NCERT</span>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-xl font-bold text-[#1a2e00] mb-1">Admin Login</h1>
          <p className="text-sm text-[#3b6d11] mb-6">Restricted access</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2e00] mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2e00] mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
