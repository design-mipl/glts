const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  return EMAIL_PATTERN.test(trimmed)
}

export function isValidMobile(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  const digits = trimmed.replace(/[\s+\-()]/g, '')
  return /^\d{8,15}$/.test(digits)
}

export function isNumericImo(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  return /^\d{7}$/.test(trimmed)
}
