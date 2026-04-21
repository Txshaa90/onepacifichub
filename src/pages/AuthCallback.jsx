import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { stripSupabaseAuthFromUrl } from '../lib/authUrl'

/**
 * OAuth / magic-link return URL. Exchanges PKCE `code`, reads session from hash,
 * then redirects. Add this exact URL to Supabase → Authentication → URL Configuration
 * (Redirect URLs): `${VITE_SITE_URL}/auth/callback`
 */
const AuthCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Signing you in…')
  const doneRef = useRef(false)
  const subRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[AuthCallback] mounted — if you do not see this on production, the route bundle is stale or HTML is not the SPA.')
    }
  }, [])

  useEffect(() => {
    doneRef.current = false
    subRef.current = null
    timerRef.current = null

    if (!isSupabaseConfigured() || !supabase) {
      navigate('/login', { replace: true })
      return
    }

    const finish = (path) => {
      if (doneRef.current) return
      doneRef.current = true
      if (timerRef.current) window.clearTimeout(timerRef.current)
      subRef.current?.unsubscribe()
      subRef.current = null
      stripSupabaseAuthFromUrl()
      navigate(path, { replace: true })
    }

    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const search = typeof window !== 'undefined' ? window.location.search : ''
    if (/error=/i.test(hash) || new URLSearchParams(search).get('error')) {
      finish('/login')
      return
    }

    let alive = true

    ;(async () => {
      try {
        const url = new URL(window.location.href)
        if (url.searchParams.get('code')) {
          setStatus('Completing sign-in…')
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (!alive || doneRef.current) return
          if (error) {
            console.error('[AuthCallback] exchangeCodeForSession:', error.message)
            finish('/login')
            return
          }
        }

        const {
          data: { session },
          error
        } = await supabase.auth.getSession()
        if (!alive || doneRef.current) return
        if (error) {
          console.error('[AuthCallback] getSession:', error.message)
          finish('/login')
          return
        }
        if (session) {
          finish('/')
          return
        }

        const {
          data: { subscription: sub }
        } = supabase.auth.onAuthStateChange((event, nextSession) => {
          if (!alive || doneRef.current) return
          if (nextSession && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            finish('/')
          }
        })
        subRef.current = sub

        timerRef.current = window.setTimeout(() => {
          if (!alive || doneRef.current) return
          console.warn('[AuthCallback] Timed out waiting for session')
          finish('/login')
        }, 15000)
      } catch (e) {
        console.error('[AuthCallback]', e)
        if (alive) finish('/login')
      }
    })()

    return () => {
      alive = false
      if (timerRef.current) window.clearTimeout(timerRef.current)
      subRef.current?.unsubscribe()
      subRef.current = null
    }
  }, [navigate])

  return (
    <div
      data-route="auth-callback"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4"
    >
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" aria-hidden />
      <h1 className="text-xl font-bold text-gray-900 text-center">{status}</h1>
      <p className="text-sm text-gray-600 mt-2 text-center max-w-sm">You will be redirected in a moment.</p>
    </div>
  )
}

export default AuthCallback
