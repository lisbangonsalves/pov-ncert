'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

type Subject = {
  id: string
  name: string
  description: string | null
  status: 'active' | 'coming_soon'
  created_at: string
}

const defaultForm = { name: '', description: '', status: 'coming_soon' as 'active' | 'coming_soon' }

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaultForm)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchSubjects() }, [])

  const fetchSubjects = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/subjects')
    if (res.ok) setSubjects(await res.json())
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    const res = await fetch('/api/admin/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const created = await res.json()
      setSubjects((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      setForm(defaultForm)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create subject')
    }
    setCreating(false)
  }

  const toggleStatus = async (id: string, current: 'active' | 'coming_soon') => {
    setTogglingId(id)
    const next = current === 'active' ? 'coming_soon' : 'active'
    await fetch('/api/admin/subjects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: next }),
    })
    setSubjects((prev) => prev.map((s) => s.id === id ? { ...s, status: next } : s))
    setTogglingId(null)
  }

  const deleteSubject = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all its notes.`)) return
    setDeletingId(id)
    await fetch(`/api/admin/subjects?id=${id}`, { method: 'DELETE' })
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f9fbf2] p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Manage Subjects</h1>
          <p className="text-sm text-[#3b6d11]">{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Add Subject Form */}
        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-[#1a2e00] mb-4">Add New Subject</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Chemistry"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Description (optional)</label>
              <input
                type="text"
                placeholder="e.g. NCERT Chemistry for NEET"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3b6d11] mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'coming_soon' })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm text-[#1a2e00] bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-[#1a2e00] text-[#cde182] text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-50"
              >
                {creating ? 'Adding...' : 'Add Subject'}
              </button>
            </div>
          </form>
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Subjects Table */}
        <div className="bg-white border border-[#d6e8a0] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#3b6d11]">Loading...</div>
          ) : subjects.length === 0 ? (
            <div className="p-8 text-center text-[#3b6d11]">No subjects yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f9fbf2] border-b border-[#d6e8a0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.id} className="border-b border-[#f9fbf2] hover:bg-[#f9fbf2]">
                      <td className="px-4 py-3 font-semibold text-[#1a2e00]">{s.name}</td>
                      <td className="px-4 py-3 text-xs text-[#3b6d11]">{s.description || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {s.status === 'active' ? 'Active' : 'Coming Soon'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => toggleStatus(s.id, s.status)}
                          disabled={togglingId === s.id}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            s.status === 'active'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {togglingId === s.id ? '...' : s.status === 'active' ? 'Set Coming Soon' : 'Set Active'}
                        </button>
                        <button
                          onClick={() => deleteSubject(s.id, s.name)}
                          disabled={deletingId === s.id}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deletingId === s.id ? '...' : 'Delete'}
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
