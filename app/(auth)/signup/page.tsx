'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Signup failed')
      return
    }

    setStep('otp')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const verifyRes = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, otp }),
    })

    if (!verifyRes.ok) {
      const data = await verifyRes.json()
      setError(data.error || 'Invalid OTP')
      setLoading(false)
      return
    }

    // Email verified — sign in
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Verified! But login failed — please log in manually.')
      router.push('/login')
      return
    }

    window.location.href = '/dashboard'
  }

  const resendOtp = async () => {
    setError('')
    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
  }

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="POV:NCERT" width={160} height={32} className="h-8 w-auto" />
        </div>

        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-8 shadow-sm">
          {step === 'form' ? (
            <>
              <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Create your account</h1>
              <p className="text-sm text-[#3b6d11] mb-6">Start learning for free today</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="Arjun Mehta"
                  />
                </div>
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
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="Min. 8 characters"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#cde182] text-[#1a2e00] font-bold py-3 rounded-xl hover:bg-[#b8d06e] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-xs text-center text-[#3b6d11] mt-4">
                By signing up, you agree to our{' '}
                <Link href="/terms-and-conditions" className="underline">Terms</Link> and{' '}
                <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
              </p>
              <p className="text-sm text-center text-[#3b6d11] mt-3">
                Already have an account?{' '}
                <Link href="/login" className="text-[#1a2e00] font-semibold hover:underline">Log in</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#e2ecb7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📬</span>
                </div>
                <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Verify your email</h1>
                <p className="text-sm text-[#3b6d11]">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-semibold text-[#1a2e00] mt-0.5">{form.email}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1 text-center">Enter OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-3 focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2] tracking-widest text-center text-2xl font-bold"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>

              <p className="text-xs text-center text-[#3b6d11] mt-4">
                Didn&apos;t receive it?{' '}
                <button onClick={resendOtp} className="text-[#1a2e00] font-semibold hover:underline">
                  Resend code
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
