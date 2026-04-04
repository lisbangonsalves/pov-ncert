'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-[#1a2e00] mb-2">Contact Us</h1>
        <p className="text-[#3b6d11] mb-8">
          Have a question or need help? We&apos;re here to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {submitted ? (
              <div className="bg-[#e2ecb7] border border-[#cde182] rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-3">✅</span>
                <h3 className="text-xl font-bold text-[#1a2e00] mb-2">Message Sent!</h3>
                <p className="text-[#3b6d11]">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#d6e8a0] rounded-2xl p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2e00] mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b6d11] bg-[#f9fbf2] resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1a2e00] text-white font-bold py-3 rounded-xl hover:bg-[#3b6d11] transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-[#d6e8a0] rounded-xl p-4">
              <p className="text-xs text-[#3b6d11] font-medium mb-1">Email</p>
              <a href="mailto:neetmcqs@gmail.com" className="text-sm text-[#1a2e00] font-semibold hover:underline">
                neetmcqs@gmail.com
              </a>
            </div>
            <div className="bg-white border border-[#d6e8a0] rounded-xl p-4">
              <p className="text-xs text-[#3b6d11] font-medium mb-1">WhatsApp</p>
              <a href="https://wa.me/995568081337" className="text-sm text-[#1a2e00] font-semibold hover:underline">
                +995 568 081 337
              </a>
            </div>
            <div className="bg-white border border-[#d6e8a0] rounded-xl p-4">
              <p className="text-xs text-[#3b6d11] font-medium mb-1">Instagram</p>
              <a href="https://www.instagram.com/neetmcqs/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#1a2e00] font-semibold hover:underline">
                @neetmcqs
              </a>
            </div>
            <div className="bg-white border border-[#d6e8a0] rounded-xl p-4">
              <p className="text-xs text-[#3b6d11] font-medium mb-1">Response Time</p>
              <p className="text-sm text-[#1a2e00] font-semibold">Within 24 hours</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
