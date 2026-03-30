'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

type Note = {
  id: string
  title: string
  chapter_number: number
  class_type: string
  is_free: boolean
  created_at: string
  subjects?: { name: string }
}

type Subject = { id: string; name: string }

export default function AdminNotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    subject_id: '',
    title: '',
    chapter_number: '',
    class_type: 'free',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [notesRes, subjectsRes] = await Promise.all([
      fetch('/api/admin/notes'),
      fetch('/api/admin/subjects'),
    ])
    if (notesRes.ok) setNotes(await notesRes.json())
    if (subjectsRes.ok) setSubjects(await subjectsRes.json())
    setLoading(false)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const file = fileRef.current?.files?.[0]
    if (!file) { setError('Please select a PDF file'); return }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('subject_id', form.subject_id)
    fd.append('title', form.title)
    fd.append('chapter_number', form.chapter_number)
    fd.append('class_type', form.class_type)

    setUploading(true)
    const res = await fetch('/api/admin/notes', { method: 'POST', body: fd })
    setUploading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Upload failed')
      return
    }

    setForm({ subject_id: '', title: '', chapter_number: '', class_type: 'free' })
    if (fileRef.current) fileRef.current.value = ''
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    await fetch(`/api/admin/notes?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f9fbf2] p-8">
        <h1 className="text-2xl font-bold text-[#1a2e00] mb-8">Manage Notes</h1>

        {/* Upload Form */}
        <div className="bg-white border border-[#d6e8a0] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-[#1a2e00] mb-4">Upload New Note</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1a2e00] mb-1">Subject</label>
              <select
                value={form.subject_id}
                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                required
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1a2e00] mb-1">Access Type</label>
              <select
                value={form.class_type}
                onChange={(e) => setForm({ ...form, class_type: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1a2e00] mb-1">Chapter Number</label>
              <input
                type="number"
                required
                min={1}
                value={form.chapter_number}
                onChange={(e) => setForm({ ...form, chapter_number: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1a2e00] mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
                placeholder="e.g. The Living World"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#1a2e00] mb-1">PDF File</label>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                required
                className="w-full border border-[#d6e8a0] rounded-lg px-3 py-2 text-sm bg-[#f9fbf2] focus:outline-none focus:border-[#3b6d11]"
              />
              <p className="mt-1.5 text-xs text-[#3b6d11]">
                Please keep the PDF size under <span className="font-semibold">4 MB</span> for best performance.
              </p>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={uploading}
                className="bg-[#1a2e00] text-[#cde182] font-bold px-6 py-2.5 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-60 text-sm"
              >
                {uploading ? 'Uploading...' : 'Upload Note'}
              </button>
            </div>
          </form>
        </div>

        {/* Notes Table */}
        <div className="bg-white border border-[#d6e8a0] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#d6e8a0]">
            <h2 className="font-bold text-[#1a2e00]">All Notes ({notes.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[#3b6d11]">Loading...</div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center text-[#3b6d11]">No notes uploaded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f9fbf2] border-b border-[#d6e8a0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Ch.</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Access</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Uploaded</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note.id} className="border-b border-[#f9fbf2] hover:bg-[#f9fbf2]">
                      <td className="px-4 py-3 font-bold text-[#1a2e00]">{note.chapter_number}</td>
                      <td className="px-4 py-3 text-[#1a2e00] max-w-xs truncate">{note.title}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${note.is_free ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {note.is_free ? 'Free' : 'Paid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#3b6d11] text-xs">
                        {new Date(note.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
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
