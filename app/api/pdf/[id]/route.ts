import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  _request: Request,
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

  // Generate a short-lived signed URL (60s) — only used server-side to fetch bytes
  const { data: signedData, error: signedError } = await getSupabaseAdmin().storage
    .from('notes-pdfs')
    .createSignedUrl(note.storage_path, 60)

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }

  // Proxy the PDF bytes — the signed URL never reaches the client
  const pdfResponse = await fetch(signedData.signedUrl)
  if (!pdfResponse.ok) {
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 })
  }

  const pdfBuffer = await pdfResponse.arrayBuffer()

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${note.title}.pdf"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
