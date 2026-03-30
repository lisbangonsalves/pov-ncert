import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendPushToAll } from '@/lib/webpush'

export const maxDuration = 60

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    return null
  }
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await getSupabaseAdmin()
    .from('notes')
    .select('*, subjects(name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const subjectId = formData.get('subject_id') as string
  const title = formData.get('title') as string
  const chapterNumber = parseInt(formData.get('chapter_number') as string)
  const classType = formData.get('class_type') as string

  if (!file || !subjectId || !title || !classType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Validate file type by MIME and PDF magic bytes (%PDF)
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }
  const header = await file.slice(0, 4).arrayBuffer()
  const magic = Buffer.from(header).toString('ascii')
  if (magic !== '%PDF') {
    return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 })
  }

  const isFree = classType === 'free'
  const fileName = `${classType}/${subjectId}/ch${chapterNumber}_${Date.now()}.pdf`

  // Upload to Supabase Storage
  const buffer = await file.arrayBuffer()
  const { error: uploadError } = await getSupabaseAdmin().storage
    .from('notes-pdfs')
    .upload(fileName, buffer, { contentType: 'application/pdf' })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Insert note record
  const { data, error } = await getSupabaseAdmin().from('notes').insert({
    subject_id: subjectId,
    title,
    chapter_number: chapterNumber,
    class_type: classType,
    is_free: isFree,
    storage_path: fileName,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Store notification record + send push (fire and forget)
  const tierLabel = classType === 'paid' ? 'Paid' : 'Free'
  const notifTitle = 'New notes added! 📚'
  const notifBody = `${title} — ${tierLabel} content just dropped`
  const notifUrl = `/dashboard?tab=${classType}`

  getSupabaseAdmin()
    .from('notifications')
    .insert({ title: notifTitle, body: notifBody, url: notifUrl })
    .then(() => {})
    .catch(() => {})

  getSupabaseAdmin()
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .then(({ data: subs }) => {
      if (subs && subs.length > 0) {
        sendPushToAll(subs, { title: notifTitle, body: notifBody, url: notifUrl }).catch(() => {})
      }
    })
    .catch(() => {})

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Get storage path
  const { data: note } = await getSupabaseAdmin()
    .from('notes')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (note?.storage_path) {
    await getSupabaseAdmin().storage.from('notes-pdfs').remove([note.storage_path])
  }

  const { error } = await getSupabaseAdmin().from('notes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
