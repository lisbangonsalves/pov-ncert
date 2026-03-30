import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as any
  if (user.is_blocked) {
    return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
  }

  // Fetch note details
  const { data: note, error: noteError } = await getSupabaseAdmin()
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (noteError || !note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  // Check payment for NEET notes
  if (!note.is_free && !user.has_paid) {
    return NextResponse.json({ error: 'Payment required' }, { status: 402 })
  }

  // Generate signed URL (300 seconds — 5 minutes, to allow for network latency)
  const { data: signedData, error: signedError } = await getSupabaseAdmin().storage
    .from('notes-pdfs')
    .createSignedUrl(note.storage_path, 300)

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }

  return NextResponse.json({ url: signedData.signedUrl, title: note.title })
}
