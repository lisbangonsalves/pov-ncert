import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import PDFViewerWrapper from './PDFViewerWrapper'

export const dynamic = 'force-dynamic'

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = session.user as any
  if (user.is_blocked) redirect('/login?blocked=1')

  const { id } = await params

  // Fetch note
  const { data: note, error } = await getSupabaseAdmin()
    .from('notes')
    .select('*, subjects(name)')
    .eq('id', id)
    .single()

  if (error || !note) redirect('/dashboard')

  // Check access
  if (!note.is_free && !user.has_paid) {
    redirect('/payment')
  }

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-[#d6e8a0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-[#3b6d11] hover:text-[#1a2e00] text-sm flex items-center gap-1"
          >
            ← Back
          </Link>
          <div className="h-4 w-px bg-[#d6e8a0]" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a2e00] truncate">
              Ch. {note.chapter_number} — {note.title}
            </p>
          </div>
          <span className="text-xs text-[#3b6d11] bg-[#e2ecb7] px-2 py-1 rounded-full hidden sm:block">
            {note.subjects?.name || 'Biology'}
          </span>
        </div>
      </nav>

      <main className="flex-1 py-6 px-4">
        <PDFViewerWrapper noteId={id} userEmail={user.email || ''} />
      </main>
    </div>
  )
}
