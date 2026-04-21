/**
 * Custom password reset via Supabase Edge Functions.
 * Deploy: send-reset-otp, verify-reset-otp, reset-password
 * Uses VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (same as the rest of the app).
 *
 * verify-reset-otp must return a short-lived resetToken (JSON field resetToken, or reset_token / token).
 * reset-password must accept { email, newPassword, resetToken }.
 *
 * Edge Functions require both `apikey` and `Authorization: Bearer <anon>` or the gateway returns 401.
 */

/** Normalized project URL (no trailing slash). Vite inlines at build time. */
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '').trim()
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export function isOtpResetConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY)
}

async function postJson(path, body) {
  if (!SUPABASE_URL) {
    throw new Error('Supabase is not configured.')
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase anon key is missing. Set VITE_SUPABASE_ANON_KEY (Edge Functions need apikey + Authorization headers).'
    )
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  return { res, data }
}

export async function sendResetOtp(email) {
  const { res, data } = await postJson('send-reset-otp', { email: email.trim() })
  if (!res.ok) {
    throw new Error(data.error || data.message || `Could not send code (${res.status})`)
  }
  return data
}

/** Backend should return one of these after successful OTP verify. */
export function pickResetToken(data) {
  if (!data || typeof data !== 'object') return ''
  const t = data.resetToken ?? data.reset_token ?? data.token
  return typeof t === 'string' && t.length > 0 ? t : ''
}

export async function verifyResetOtp(email, code) {
  const { res, data } = await postJson('verify-reset-otp', {
    email: email.trim(),
    code: String(code).trim(),
  })
  if (!res.ok || data.ok === false || data.success === false) {
    throw new Error(data.error || data.message || 'Invalid or expired code')
  }
  return data
}

export async function resetPasswordAfterOtp(email, newPassword, resetToken) {
  const token = typeof resetToken === 'string' ? resetToken.trim() : ''
  if (!token) {
    throw new Error('Reset session expired. Start over from forgot password.')
  }
  const { res, data } = await postJson('reset-password', {
    email: email.trim(),
    newPassword,
    resetToken: token,
  })
  if (!res.ok || data.ok === false || data.success === false) {
    throw new Error(data.error || data.message || 'Could not update password')
  }
  return data
}
