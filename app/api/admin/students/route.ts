import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

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
    .from('users')
    .select('id, email, name, role, is_blocked, has_paid, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, is_blocked, has_paid } = await request.json()
  if (!id || (is_blocked === undefined && has_paid === undefined)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const updates: Record<string, boolean> = {}
  if (is_blocked !== undefined) updates.is_blocked = is_blocked
  if (has_paid !== undefined) updates.has_paid = has_paid

  const { error } = await getSupabaseAdmin()
    .from('users')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
