-- POV:NCERT Security Migrations
-- Run these in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run multiple times (uses IF NOT EXISTS / CREATE OR REPLACE)

-- ─────────────────────────────────────────────
-- 1. Missing columns on users table
-- ─────────────────────────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────
-- 2. Missing otp_codes table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_codes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT        NOT NULL,
  code             TEXT        NOT NULL,
  expires_at       TIMESTAMPTZ NOT NULL,
  used             BOOLEAN     NOT NULL DEFAULT false,
  pending_name     TEXT,        -- set during signup; NULL for login OTPs
  pending_password TEXT,        -- hashed password; NULL for login OTPs
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- If the table already exists, add the columns
ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS pending_name     TEXT;
ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS pending_password TEXT;

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'otp_codes' AND policyname = 'Service role full access on otp_codes'
  ) THEN
    CREATE POLICY "Service role full access on otp_codes" ON otp_codes
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 3. Missing notifications table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  body       TEXT,
  url        TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Service role full access on notifications'
  ) THEN
    CREATE POLICY "Service role full access on notifications" ON notifications
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 4. Atomic OTP verification
--    Marks OTP as used only if it exists, is unused, and not expired.
--    Returns the OTP record ID on success, NULL on failure.
--    Prevents race condition where two concurrent requests both verify the same OTP.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION verify_otp_atomic(p_email TEXT, p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  UPDATE otp_codes
  SET used = true
  WHERE email      = p_email
    AND code       = p_code
    AND used       = false
    AND expires_at > now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- 5. Atomic payment completion
--    In a single transaction:
--      a) Verifies the order belongs to p_user_id (prevents payment theft)
--      b) Marks the payment as success (only if currently 'pending')
--      c) Grants the user paid access
--      d) Increments promo code usage if one was applied
--    Returns TRUE on success, FALSE if order not found / wrong user / already processed.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION complete_payment(
  p_order_id   TEXT,
  p_payment_id TEXT,
  p_user_id    UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_payment_id    UUID;
  v_promo_code_id UUID;
BEGIN
  -- Update payment only if it belongs to the requesting user and is still pending
  UPDATE payments
  SET    status              = 'success',
         razorpay_payment_id = p_payment_id
  WHERE  razorpay_order_id  = p_order_id
    AND  user_id            = p_user_id
    AND  status             = 'pending'
  RETURNING id, promo_code_id INTO v_payment_id, v_promo_code_id;

  -- Abort if no matching payment (wrong user, already processed, or not found)
  IF v_payment_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Grant paid access
  UPDATE users SET has_paid = true WHERE id = p_user_id;

  -- Increment promo usage if applicable
  IF v_promo_code_id IS NOT NULL THEN
    UPDATE promo_codes SET uses_count = uses_count + 1 WHERE id = v_promo_code_id;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- ⚠️  PASSWORD MIGRATION NOTE
-- ─────────────────────────────────────────────
-- Passwords are now stored as scrypt hashes (salt:hash format).
-- Any existing plaintext passwords in the database will no longer work.
-- To reset a user's password, either:
--   a) Have the user register again (or use OTP login), or
--   b) Run this to hash a known password for a specific user:
--
--      UPDATE users
--      SET password = '<new_hashed_value>'
--      WHERE email = 'user@example.com';
--
-- To generate a hash, run the app locally and call hashPassword() from lib/password.ts.
