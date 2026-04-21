/**
 * Remove Supabase auth tokens from the URL after the client has stored the session.
 * Prevents re-processing the same hash on refresh (odd "auto sign-in" loops) and
 * avoids email link scanners re-triggering visible token noise in the address bar.
 */
export function stripSupabaseAuthFromUrl() {
  if (typeof window === 'undefined') return

  const { pathname, search, hash } = window.location

  if (hash && /access_token|refresh_token|type=recovery|error=/i.test(hash)) {
    window.history.replaceState({}, document.title, `${pathname}${search}`)
    return
  }

  if (search.includes('code=') && search.includes('state=')) {
    const params = new URLSearchParams(search)
    params.delete('code')
    params.delete('state')
    const next = params.toString()
    window.history.replaceState({}, document.title, next ? `${pathname}?${next}` : pathname)
  }
}
