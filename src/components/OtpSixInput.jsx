import { useRef, useState, useCallback, useEffect } from 'react'

const OTP_LEN = 6

/**
 * Six single-digit inputs with paste support; value is a 6-char string (may include spaces trimmed by parent).
 */
export default function OtpSixInput({ value, onChange, disabled, autoFocus }) {
  const [cells, setCells] = useState(() => {
    const v = (value || '').replace(/\D/g, '').slice(0, OTP_LEN)
    return Array.from({ length: OTP_LEN }, (_, i) => v[i] || '')
  })
  const inputsRef = useRef([])

  useEffect(() => {
    const v = (value || '').replace(/\D/g, '').slice(0, OTP_LEN)
    setCells(Array.from({ length: OTP_LEN }, (_, i) => v[i] || ''))
  }, [value])

  const emit = useCallback(
    (nextCells) => {
      onChange?.(nextCells.join(''))
    },
    [onChange]
  )

  const setAt = (index, char) => {
    setCells((prev) => {
      const next = [...prev]
      next[index] = char
      emit(next)
      return next
    })
  }

  const handleChange = (index, e) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1)
    if (d) {
      setAt(index, d)
      if (index < OTP_LEN - 1) inputsRef.current[index + 1]?.focus()
    } else {
      setAt(index, '')
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !cells[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LEN - 1) inputsRef.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN)
    if (!pasted) return
    const next = Array.from({ length: OTP_LEN }, (_, i) => pasted[i] || '')
    setCells(next)
    emit(next)
    const focusIdx = Math.min(pasted.length, OTP_LEN - 1)
    inputsRef.current[focusIdx]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {cells.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={autoFocus && i === 0}
          maxLength={1}
          value={c}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${OTP_LEN}`}
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  )
}
