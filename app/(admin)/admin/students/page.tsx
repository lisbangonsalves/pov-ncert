'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

type Student = {
  id: string
  email: string
  name: string
  role: string
  is_blocked: boolean
  has_paid: boolean
  created_at: string
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [togglingSubId, setTogglingSubId] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/students')
    if (res.ok) setStudents(await res.json())
    setLoading(false)
  }

  const toggleBlock = async (id: string, currentBlocked: boolean) => {
    setTogglingId(id)
    await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_blocked: !currentBlocked }),
    })
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_blocked: !currentBlocked } : s))
    )
    setTogglingId(null)
  }

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Joined', 'Subscription', 'Status']
    const rows = students.map((s) => [
      s.name || '',
      s.email,
      new Date(s.created_at).toLocaleDateString(),
      s.has_paid ? 'Paid' : 'Free',
      s.is_blocked ? 'Blocked' : 'Active',
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSubscription = async (id: string, currentPaid: boolean) => {
    setTogglingSubId(id)
    await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, has_paid: !currentPaid }),
    })
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, has_paid: !currentPaid } : s))
    )
    setTogglingSubId(null)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f9fbf2] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2e00] mb-1">Manage Students</h1>
            <p className="text-sm text-[#3b6d11]">{students.length} registered students</p>
          </div>
          <button
            onClick={downloadCSV}
            disabled={students.length === 0}
            className="flex items-center gap-2 bg-[#1a2e00] text-[#cde182] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#3b6d11] transition-colors disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>

        <div className="bg-white border border-[#d6e8a0] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#3b6d11]">Loading...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-[#3b6d11]">No students yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f9fbf2] border-b border-[#d6e8a0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Joined</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Subscription</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Subscription</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#3b6d11]">Block</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-[#f9fbf2] hover:bg-[#f9fbf2]">
                      <td className="px-4 py-3 font-medium text-[#1a2e00]">{s.name || '—'}</td>
                      <td className="px-4 py-3 text-[#3b6d11]">{s.email}</td>
                      <td className="px-4 py-3 text-xs text-[#3b6d11]">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.has_paid ? 'bg-[#e2ecb7] text-[#3b6d11]' : 'bg-gray-100 text-gray-500'}`}>
                          {s.has_paid ? 'Paid' : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {s.is_blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleSubscription(s.id, s.has_paid)}
                          disabled={togglingSubId === s.id}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            s.has_paid
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-[#e2ecb7] text-[#3b6d11] hover:bg-[#cde182]'
                          }`}
                        >
                          {togglingSubId === s.id ? '...' : s.has_paid ? 'Revoke Paid' : 'Grant Paid'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleBlock(s.id, s.is_blocked)}
                          disabled={togglingId === s.id}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            s.is_blocked
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {togglingId === s.id ? '...' : s.is_blocked ? 'Unblock' : 'Block'}
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
