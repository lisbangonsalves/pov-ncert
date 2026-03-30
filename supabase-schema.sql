-- POV:NCERT Database Schema
-- Run this in your Supabase SQL Editor

-- users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  has_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  class_type TEXT NOT NULL CHECK (class_type IN ('free', 'paid')),
  is_free BOOLEAN NOT NULL DEFAULT true,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value INTEGER NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Function to safely increment promo code usage count
CREATE OR REPLACE FUNCTION increment_promo_uses(promo_id UUID)
RETURNS VOID AS $$
  UPDATE promo_codes SET uses_count = uses_count + 1 WHERE id = promo_id;
$$ LANGUAGE SQL;

-- Seed initial subject
INSERT INTO subjects (name, description)
VALUES ('Biology', 'NCERT Biology for Class 11, Class 12, and NEET')
ON CONFLICT DO NOTHING;

-- Storage: Create the notes-pdfs bucket (do this in Supabase dashboard or use storage API)
-- Bucket name: notes-pdfs
-- Public: false (private)

-- Row Level Security (RLS) - disable for service role, enable for anon
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for server-side operations)
CREATE POLICY "Service role full access on users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on subjects" ON subjects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on notes" ON notes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on promo_codes" ON promo_codes
  FOR ALL USING (auth.role() = 'service_role');

-- push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on push_subscriptions" ON push_subscriptions
  FOR ALL USING (auth.role() = 'service_role');
