import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

const circle =
  'flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'

const FacebookGlyph = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const GoogleGlyph = () => (
  <span className="text-xl font-bold leading-none">G</span>
)

/**
 * “Or sign up using” row — circular Facebook and Google (matches common login-card patterns).
 */
const SocialOAuthButtons = ({ showLabel = true, className = '', rememberMe = false }) => {
  const { loginWithGoogle, loginWithFacebook, loading, error, clearError } = useAuth()
  const disabled = loading || !isSupabaseConfigured()

  return (
    <div className={className}>
      {showLabel && (
        <p className="mb-4 text-center text-sm font-medium text-gray-500">Or sign up using</p>
      )}
      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          title="Continue with Facebook"
          aria-label="Continue with Facebook"
          disabled={disabled}
          onClick={() => {
            clearError?.()
            loginWithFacebook(rememberMe)
          }}
          className={`${circle} bg-[#1877F2] hover:bg-[#166fe5]`}
        >
          <FacebookGlyph />
        </button>
        <button
          type="button"
          title="Continue with Google"
          aria-label="Continue with Google"
          disabled={disabled}
          onClick={() => {
            clearError?.()
            loginWithGoogle(rememberMe)
          }}
          className={`${circle} bg-[#ea4335] hover:bg-[#e33327]`}
        >
          <GoogleGlyph />
        </button>
      </div>
      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SocialOAuthButtons
