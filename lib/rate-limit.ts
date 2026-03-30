// In-memory OTP rate limiter: max 5 requests per email per hour.
// For multi-instance deployments, replace with a Redis-backed solution.

const attempts = new Map<string, number[]>()

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_ATTEMPTS = 5

export function checkOtpRateLimit(email: string): boolean {
  const now = Date.now()
  const prev = attempts.get(email) ?? []
  const recent = prev.filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_ATTEMPTS) return false
  recent.push(now)
  attempts.set(email, recent)
  return true
}
