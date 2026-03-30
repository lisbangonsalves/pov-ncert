'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const blocked = searchParams.get('blocked')

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(blocked ? 'Your account has been suspended. Contact support.' : '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error === 'BLOCKED') {
      setError('Your account has been suspended. Please contact support.')
      return
    }

    if (result?.error === 'UNVERIFIED') {
      setError('Please verify your email first. Check your inbox for the OTP.')
      return
    }

    if (result?.error) {
      setError('Invalid email or password.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="bg-white border border-[#d6e8a0] rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Welcome back</h1>
      <p className="text-sm text-[#3b6d11] mb-6">Log in to access your notes</p>

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
            placeholder="you@example.com"
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
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-center text-[#3b6d11] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#1a2e00] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f9fbf2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="POV:NCERT" width={160} height={32} className="h-8 w-auto" />
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl p-8 text-center text-[#3b6d11]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
