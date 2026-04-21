import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

const VerifyEmailPage = () => {
  const location = useLocation()
  const { resendVerificationEmail, clearError } = useAuth()
  const [email, setEmail] = useState(() => location.state?.email?.trim() || '')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    clearError?.()
  }, [clearError])

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email.trim())
    }
  }, [location.state])

  const handleResend = async () => {
    setResendMessage('')
    setResendError('')
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setResendError('Enter a valid email address.')
      return
    }
    if (!isSupabaseConfigured()) {
      setResendError('Authentication is not configured.')
      return
    }
    setResendLoading(true)
    const result = await resendVerificationEmail(email.trim())
    if (result.success) {
      setResendMessage('Another email is on its way. Check your inbox and spam folder.')
    } else {
      setResendError(result.error || 'Could not resend.')
    }
    setResendLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="text-blue-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve sent a verification link
          {email ? (
            <>
              {' '}
              to <strong className="text-gray-800">{email}</strong>
            </>
          ) : (
            ''
          )}
          . Open the email and click the link to activate your account.
        </p>

        {!location.state?.email && (
          <div className="mb-6 text-left">
            <label htmlFor="verify-email-input" className="block text-sm font-medium text-gray-700 mb-1">
              Email used to sign up
            </label>
            <input
              id="verify-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {resendMessage && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-2 text-left">
            <CheckCircle className="shrink-0 mt-0.5" size={18} />
            <span>{resendMessage}</span>
          </div>
        )}
        {resendError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 text-left">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <span>{resendError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={resendLoading}
            onClick={handleResend}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {resendLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {resendLoading ? 'Sending…' : 'Resend email'}
          </motion.button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:opacity-95 transition-opacity"
          >
            Back to sign in
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          After you verify, you can sign in with your email and password.
        </p>
      </motion.div>
    </div>
  )
}

export default VerifyEmailPage
