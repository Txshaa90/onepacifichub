/** Human-readable strength for login-adjacent hints (min 6 chars). */
export function getPasswordStrength(password) {
  if (!password || password.length < 6) return 'Weak'
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  if (password.length >= 10 && hasUpper && hasDigit && hasSpecial) return 'Strong'
  if (password.length >= 8 && hasUpper && hasDigit) return 'Strong'
  if (password.length >= 6) return 'Medium'
  return 'Weak'
}

export function getPasswordStrengthMeta(password) {
  const label = getPasswordStrength(password)
  const ring = {
    Weak: 'text-red-600 bg-red-50 border-red-200',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    Strong: 'text-green-700 bg-green-50 border-green-200'
  }
  return { label, className: ring[label] }
}

/** Suggested strong password (uses crypto when available). */
export function generateStrongPassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
  let s = ''
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(14)
    crypto.getRandomValues(arr)
    for (let i = 0; i < 14; i++) s += chars[arr[i] % chars.length]
  } else {
    s = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-4)
  }
  return `${s}A1!`
}
