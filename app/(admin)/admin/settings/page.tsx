'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminSettingsPage() {
  const [otpRequired, setOtpRequired] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => setOtpRequired(data.otp_required !== 'false'))
  }, [])

  const toggle = async () => {
    const newVal = !otpRequired
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'otp_required', value: String(newVal) }),
    })
    setOtpRequired(newVal)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f9fbf2] p-8">
        <h1 className="text-2xl font-bold text-[#1a2e00] mb-2">Settings</h1>
        <p className="text-sm text-[#3b6d11] mb-8">Platform configuration</p>

        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-6 max-w-xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-semibold text-[#1a2e00] mb-1">Email Verification (OTP)</p>
              <p className="text-sm text-[#3b6d11] leading-relaxed">
                When <span className="font-medium">ON</span>, new signups require email OTP verification
                via Resend before their account is created.
                <br />
                When <span className="font-medium">OFF</span>, accounts are created instantly with no
                email sent — useful when Resend quota is low. Users who signed up without OTP are
                not affected when you turn this back ON.
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={toggle}
              disabled={saving || otpRequired === null}
              aria-label="Toggle OTP verification"
              className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 disabled:opacity-50 focus:outline-none ${
                otpRequired ? 'bg-[#3b6d11]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  otpRequired ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                otpRequired
                  ? 'bg-[#e2ecb7] text-[#3b6d11]'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  otpRequired ? 'bg-[#3b6d11]' : 'bg-amber-500'
                }`}
              />
              {otpRequired === null
                ? 'Loading...'
                : otpRequired
                ? 'OTP verification is ON'
                : 'OTP verification is OFF — accounts created instantly'}
            </span>
            {saved && (
              <span className="text-xs text-[#3b6d11] font-medium">Saved</span>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
