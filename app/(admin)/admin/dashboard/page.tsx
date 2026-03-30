import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import AdminSidebar from '@/components/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/admin/login')
  }

  // Fetch metrics
  const [studentsRes, paidRes, notesRes, revenueRes] = await Promise.all([
    getSupabaseAdmin().from('users').select('id', { count: 'exact' }).eq('role', 'student'),
    getSupabaseAdmin().from('users').select('id', { count: 'exact' }).eq('role', 'student').eq('has_paid', true),
    getSupabaseAdmin().from('notes').select('id', { count: 'exact' }),
    getSupabaseAdmin().from('payments').select('amount').eq('status', 'success'),
  ])

  const totalStudents = studentsRes.count || 0
  const paidStudents = paidRes.count || 0
  const totalNotes = notesRes.count || 0
  const revenue = (revenueRes.data || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  const revenueRs = Math.round(revenue / 100)

  const metrics = [
    { label: 'Total Students', value: totalStudents.toString(), icon: '👥', color: 'bg-blue-50 border-blue-200' },
    { label: 'Paid Students', value: paidStudents.toString(), icon: '💳', color: 'bg-[#e2ecb7] border-[#cde182]' },
    { label: 'Notes Uploaded', value: totalNotes.toString(), icon: '📄', color: 'bg-purple-50 border-purple-200' },
    { label: 'Revenue', value: `₹${revenueRs.toLocaleString()}`, icon: '💰', color: 'bg-amber-50 border-amber-200' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f9fbf2] p-8">
        <h1 className="text-2xl font-bold text-[#1a2e00] mb-2">Dashboard</h1>
        <p className="text-sm text-[#3b6d11] mb-8">Overview of POV:NCERT platform</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => (
            <div key={m.label} className={`border rounded-2xl p-6 ${m.color}`}>
              <div className="text-3xl mb-3">{m.icon}</div>
              <p className="text-3xl font-bold text-[#1a2e00] mb-1">{m.value}</p>
              <p className="text-sm text-[#3b6d11]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-[#d6e8a0] rounded-2xl p-6">
          <h2 className="font-bold text-[#1a2e00] mb-1">Quick Actions</h2>
          <p className="text-sm text-[#3b6d11] mb-4">Manage your platform</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/notes"
              className="px-5 py-2.5 bg-[#cde182] text-[#1a2e00] text-sm font-bold rounded-xl hover:bg-[#b8d06e] transition-colors"
            >
              Upload Notes
            </a>
            <a
              href="/admin/students"
              className="px-5 py-2.5 border border-[#d6e8a0] text-[#3b6d11] text-sm font-medium rounded-xl hover:bg-[#f9fbf2] transition-colors"
            >
              View Students
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
