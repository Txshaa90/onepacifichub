import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react'
import OtpSixInput from '../components/OtpSixInput'
import { a11yAction } from '../lib/controlHints'
import {
  sendResetOtp,
  verifyResetOtp,
  pickResetToken,
  isOtpResetConfigured,
} from '../services/passwordResetOtp'

/** Client-side window aligned with typical server OTP TTL (backend still enforces truth). */
const OTP_DURATION_SEC = 600
const RESEND_COOLDOWN_SEC = 60

function formatMmSs(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const VerifyResetPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email?.trim() || ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION_SEC)
  const [resendLeft, setResendLeft] = useState(RESEND_COOLDOWN_SEC)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!email || !isOtpResetConfigured()) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    const t = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      setResendLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!info) return
    const clear = window.setTimeout(() => setInfo(''), 4000)
    return () => window.clearTimeout(clear)
  }, [info])

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    if (timeLeft <= 0) {
      setError('This code has expired. Resend a new code to continue.')
      return
    }
    const digits = code.replace(/\D/g, '')
    if (digits.length !== 6) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setVerifying(true)
    try {
      const data = await verifyResetOtp(email, digits)
      const resetToken = pickResetToken(data)
      if (!resetToken) {
        throw new Error(
          'Verification succeeded but no reset token was returned. Check your verify-reset-otp Edge Function response.'
        )
      }
      navigate('/new-password', { replace: true, state: { email, resetToken } })
    } catch (err) {
      setError(err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendLeft > 0 || resending) return
    setError('')
    setInfo('')
    setResending(true)
    try {
      await sendResetOtp(email)
      setResendLeft(RESEND_COOLDOWN_SEC)
      setTimeLeft(OTP_DURATION_SEC)
      setCode('')
      setInfo('New code sent. Check your email.')
    } catch (err) {
      setError(err.message || 'Could not resend code')
    } finally {
      setResending(false)
    }
  }

  const digitsOk = code.replace(/\D/g, '').length === 6
  const canVerify = timeLeft > 0 && digitsOk

  if (!email) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Link
          to="/forgot-password"
          state={{ email }}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter the code sent to your email</h1>
            <p className="text-gray-600 text-sm">
              6-digit code sent to <strong className="text-gray-800">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
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

            {info && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              >
                <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                <span>{info}</span>
              </motion.div>
            )}

            <div>
              <p className="text-center text-sm font-medium text-gray-700 mb-3">One-time code</p>
              <OtpSixInput value={code} onChange={setCode} disabled={verifying || timeLeft <= 0} autoFocus />
              <p
                className={`text-center text-sm mt-3 font-medium ${
                  timeLeft <= 0
                    ? 'text-red-600'
                    : timeLeft < 60
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {timeLeft > 0 ? (
                  <>Code expires in {formatMmSs(timeLeft)}</>
                ) : (
                  <>Code expired — resend a new code to continue.</>
                )}
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={verifying || !canVerify}
              whileHover={{ scale: verifying ? 1 : 1.02 }}
              whileTap={{ scale: verifying ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying…
                </>
              ) : (
                'Verify & continue'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Didn&apos;t receive it?{' '}
            <button
              type="button"
              disabled={resendLeft > 0 || resending}
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              {...a11yAction(
                resending
                  ? 'Sending new code'
                  : resendLeft > 0
                    ? `Resend code available in ${resendLeft} seconds`
                    : 'Resend verification code'
              )}
            >
              {resending
                ? 'Sending…'
                : resendLeft > 0
                  ? `Resend in ${resendLeft}s`
                  : 'Resend code'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyResetPage
