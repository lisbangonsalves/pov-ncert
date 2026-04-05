'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

type PromoCode = {
  id: string
  code: string
  discount_type: 'percent' | 'flat'
  discount_value: number
  max_uses: number | null
  uses_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

const defaultForm = {
  code: '',
  discount_type: 'percent' as 'percent' | 'flat',
  discount_value: '',
  max_uses: '',
  expires_at: '',
}

export default function AdminPromoPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaultForm)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchCodes() }, [])

  const fetchCodes = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/promo')
    if (res.ok) setCodes(await res.json())
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    const res = await fetch('/api/admin/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setCodes((prev) => [created, ...prev])
      setForm(defaultForm)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create code')
    }
    setCreating(false)
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id)
    await fetch('/api/admin/promo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentActive }),
    })
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !currentActive } : c))
    setTogglingId(null)
  }

  const deleteCode = async (id: string) => {
    if (!confirm('Delete this promo code?')) return
    setDeletingId(id)
    await fetch(`/api/admin/promo?id=${id}`, { method: 'DELETE' })
    setCodes((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f9fbf2] p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Promo Codes</h1>
          <p className="text-sm text-[#3b6d11]">{codes.length} code{codes.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Create Form */}
        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-[#1a2e00] mb-4">Create New Code</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Code</label>
              <input
                type="text"
                placeholder="SAVE20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Discount Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percent' | 'flat' })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              >
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">
                {form.discount_type === 'percent' ? 'Discount %' : 'Discount ₹'}
              </label>
              <input
                type="number"
                min={1}
                max={form.discount_type === 'percent' ? 100 : 599}
                placeholder={form.discount_type === 'percent' ? '20' : '100'}
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                required
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Max Uses (optional)</label>
              <input
                type="number"
                min={1}
                placeholder="Unlimited"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Expires At (optional)</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-[#1a2e00] text-[#cde182] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Code'}
              </button>
            </div>
          </form>
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Codes Table */}
        <div className="bg-white border border-[#d6e8a0] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#3b6d11]">Loading...</div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center text-[#3b6d11]">No promo codes yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f9fbf2] border-b border-[#d6e8a0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Discount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Uses</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Expires</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-b border-[#f9fbf2] hover:bg-[#f9fbf2]">
                      <td className="px-4 py-3 font-mono font-bold text-[#1a2e00]">{c.code}</td>
                      <td className="px-4 py-3 text-[#3b6d11]">
                        {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`} off
                        {c.discount_type === 'percent' && (
                          <span className="ml-1 text-xs text-[#3b6d11]">
                            (→ ₹{Math.round(599 * (1 - c.discount_value / 100))})
                          </span>
                        )}
                        {c.discount_type === 'flat' && (
                          <span className="ml-1 text-xs text-[#3b6d11]">
                            (→ ₹{Math.max(0, 599 - c.discount_value)})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#3b6d11]">
                        {c.uses_count} / {c.max_uses ?? '∞'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#3b6d11]">
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => toggleActive(c.id, c.is_active)}
                          disabled={togglingId === c.id}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            c.is_active
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-[#e2ecb7] text-[#3b6d11] hover:bg-[#cde182]'
                          }`}
                        >
                          {togglingId === c.id ? '...' : c.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteCode(c.id)}
                          disabled={deletingId === c.id}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deletingId === c.id ? '...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
