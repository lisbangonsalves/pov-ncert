'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'otp' | 'password'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to send OTP')
      return
    }

    setStep('otp')
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStep('password')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to reset password')
      // If OTP was invalid, send back to OTP step
      if (res.status === 400 && data.error?.toLowerCase().includes('otp')) {
        setOtp('')
        setStep('otp')
      }
      return
    }

    router.push('/login?reset=1')
  }

  const resendOtp = async () => {
    setError('')
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  }

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="POV:NCERT" width={160} height={32} className="h-8 w-auto" />
        </div>

        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-8 shadow-sm">

          {/* Step 1 — Enter email */}
          {step === 'email' && (
            <>
              <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Reset your password</h1>
              <p className="text-sm text-[#3b6d11] mb-6">
                Enter your registered email and we&apos;ll send you a reset code.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>

              <p className="text-sm text-center text-[#3b6d11] mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-[#1a2e00] font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}

          {/* Step 2 — Enter OTP */}
          {step === 'otp' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#e2ecb7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📬</span>
                </div>
                <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Check your email</h1>
                <p className="text-sm text-[#3b6d11]">We sent a 6-digit code to</p>
                <p className="text-sm font-semibold text-[#1a2e00] mt-0.5">{email}</p>
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
                  disabled={otp.length !== 6}
                  className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60"
                >
                  Continue
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

          {/* Step 3 — Set new password */}
          {step === 'password' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#e2ecb7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Set new password</h1>
                <p className="text-sm text-[#3b6d11]">Choose a strong password for your account.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="Min. 8 characters"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="Re-enter password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1a2e00] text-[#cde182] font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
