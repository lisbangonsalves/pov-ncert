import { createClient } from '@supabase/supabase-js'

export type User = {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  is_blocked: boolean
  has_paid: boolean
  created_at: string
}

export type Subject = {
  id: string
  name: string
  description: string
  created_at: string
}

export type Note = {
  id: string
  subject_id: string
  title: string
  chapter_number: number
  class_type: 'free' | 'paid'
  is_free: boolean
  storage_path: string
  created_at: string
}

export type Payment = {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabase: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabaseAdmin: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    )
  }
  return _supabase
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseAdmin(): any {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }
  return _supabaseAdmin
}
