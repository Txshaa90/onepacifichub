import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { resetPasswordAfterOtp, isOtpResetConfigured } from '../services/passwordResetOtp'
import { generateStrongPassword, getPasswordStrengthMeta } from '../lib/passwordStrength'

const NewPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email?.trim() || ''
  const resetToken =
    typeof location.state?.resetToken === 'string' ? location.state.resetToken.trim() : ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strengthMeta = getPasswordStrengthMeta(password)

  useEffect(() => {
    if (!email || !resetToken || !isOtpResetConfigured()) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, resetToken, navigate])

  const applySuggestedPassword = () => {
    const suggested = generateStrongPassword()
    setPassword(suggested)
    setConfirm(suggested)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await resetPasswordAfterOtp(email, password, resetToken)
      navigate('/login', {
        replace: true,
        state: { resetSuccess: true },
      })
    } catch (err) {
      setError(err.message || 'Could not update password.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!email || !resetToken) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Link
          to="/verify-reset"
          state={{ email }}
          replace
          title="Going back clears your reset session; you will enter the code again."
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set your new password</h1>
            <p className="text-gray-600 text-sm">Account <strong className="text-gray-800">{email}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label htmlFor="otp-new-password" className="block text-sm font-semibold text-gray-700">
                  New password
                </label>
                <button
                  type="button"
                  onClick={applySuggestedPassword}
                  disabled={submitting}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Suggest strong password
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="otp-new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-1 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password.length > 0 && (
                <p
                  className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${strengthMeta.className}`}
                >
                  Strength: {strengthMeta.label}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="otp-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="otp-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-1 rounded"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating…
                </>
              ) : (
                'Update password'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default NewPasswordPage
