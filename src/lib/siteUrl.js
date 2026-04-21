/**
 * Canonical site origin for Supabase auth (OAuth callback, email confirmation).
 * Set VITE_SITE_URL in .env / Vercel (e.g. https://www.onepacifichub.com) so
 * redirectTo matches Authentication → URL Configuration exactly (www vs non-www).
 */
export function getSiteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

/** OAuth (Google, Facebook, etc.) — must match Supabase Redirect URLs allow list. */
export function getOAuthCallbackUrl() {
  return `${getSiteOrigin()}/auth/callback`
}

/** Where users land after clicking the email confirmation link (add to Supabase redirect allow list). */
export function getEmailConfirmationRedirectUrl() {
  return `${getSiteOrigin()}/`
}
