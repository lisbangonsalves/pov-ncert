import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import NoteCard from '@/components/NoteCard'
import PaywallBanner from '@/components/PaywallBanner'
import NotificationBell from '@/components/NotificationBell'
import UserMenu from '@/components/UserMenu'
import type { Note } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = session.user as any
  if (user.is_blocked) redirect('/login?blocked=1')

  const { tab } = await searchParams
  const activeTab = tab || 'free'

  // Fetch subjects
  const { data: subjects } = await getSupabaseAdmin()
    .from('subjects')
    .select('id, name, status')
    .order('name')

  // Fetch notes for active tab
  const { data: notes } = await getSupabaseAdmin()
    .from('notes')
    .select('*')
    .eq('class_type', activeTab)
    .order('chapter_number')

  const typedNotes = (notes || []) as Note[]
  const isPaid = activeTab === 'paid'
  const hasPaid = user.has_paid

  return (
    <div className="min-h-screen bg-[#f9fbf2] flex flex-col">
      {/* Top Nav */}
      <nav className="bg-[#1a2e00] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Image src="/logo.png" alt="POV:NCERT" height={20} width={160} className="h-5 w-auto" priority />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserMenu
              name={session.user.name || ''}
              email={session.user.email || ''}
            />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Subject tabs — driven from DB */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(subjects || []).map((subject: any) =>
            subject.status === 'active' ? (
              <button
                key={subject.id}
                className="px-5 py-2 bg-[#1a2e00] text-[#cde182] rounded-full text-sm font-bold"
              >
                {subject.name}
              </button>
            ) : (
              <button
                key={subject.id}
                disabled
                className="px-5 py-2 border border-[#d6e8a0] text-[#3b6d11] rounded-full text-sm opacity-50 cursor-not-allowed"
              >
                {subject.name}
                <span className="text-xs ml-1.5">Coming Soon</span>
              </button>
            )
          )}
        </div>

        {/* Free / Paid tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white border border-[#d6e8a0] rounded-xl p-1 w-fit">
          {[
            { key: 'free', label: 'Free' },
            { key: 'paid', label: 'Paid' },
          ].map(({ key, label }) => (
            <a
              key={key}
              href={`/dashboard?tab=${key}`}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-[#cde182] text-[#1a2e00]'
                  : 'text-[#3b6d11] hover:bg-[#f9fbf2]'
              }`}
            >
              {label}
              {key === 'paid' && !hasPaid && (
                <span className="ml-1 text-xs">🔒</span>
              )}
            </a>
          ))}
        </div>

        {/* Content */}
        {isPaid && !hasPaid ? (
          <PaywallBanner />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1a2e00]">
                {activeTab === 'free' ? 'Free Content' : 'Paid Content'}
                <span className="ml-2 text-sm font-normal text-[#3b6d11]">
                  {typedNotes.length} chapters
                </span>
              </h2>
              {isPaid && hasPaid && (
                <span className="text-xs text-[#3b6d11] bg-[#e2ecb7] px-3 py-1 rounded-full font-medium">
                  ✓ Full access
                </span>
              )}
            </div>

            {typedNotes.length === 0 ? (
              <div className="text-center py-20 text-[#3b6d11]">
                <p className="text-4xl mb-3">📚</p>
                <p className="font-medium">Notes coming soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {typedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
