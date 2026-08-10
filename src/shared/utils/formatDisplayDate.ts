import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/** Canonical UI display format for calendar dates (day / month / 2-digit year). */
export const DISPLAY_DATE_FORMAT = 'DD/MM/YY'

/** Date + time when a timestamp is shown in the UI. */
export const DISPLAY_DATE_TIME_FORMAT = 'DD/MM/YY, HH:mm'

const PARSE_FORMATS = ['YYYY-MM-DD', 'DD/MM/YYYY', 'DD/MM/YY', 'DD MMM YYYY'] as const

function toDayjs(value: string | Date | undefined | null) {
  if (value == null) return null
  if (value instanceof Date) {
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed : null
  }
  const trimmed = value.trim()
  if (!trimmed || trimmed === '—') return null
  const strict = dayjs(trimmed, [...PARSE_FORMATS], true)
  if (strict.isValid()) return strict
  const loose = dayjs(trimmed)
  return loose.isValid() ? loose : null
}

/**
 * Formats a stored/ISO calendar date for UI display as `dd/mm/yy`.
 * Returns `—` for empty values; returns the original string if unparseable.
 */
export function formatDisplayDate(value: string | Date | undefined | null): string {
  if (value == null) return '—'
  if (typeof value === 'string' && (!value.trim() || value.trim() === '—')) return '—'
  const parsed = toDayjs(value)
  if (parsed) return parsed.format(DISPLAY_DATE_FORMAT)
  return typeof value === 'string' ? value.trim() : '—'
}

/**
 * Formats an ISO/datetime value for UI as `dd/mm/yy, HH:mm`.
 * Returns `—` for empty values; returns the original string if unparseable.
 */
export function formatDisplayDateTime(value: string | Date | undefined | null): string {
  if (value == null) return '—'
  if (typeof value === 'string' && (!value.trim() || value.trim() === '—')) return '—'
  const parsed = toDayjs(value)
  if (parsed) return parsed.format(DISPLAY_DATE_TIME_FORMAT)
  return typeof value === 'string' ? value.trim() : '—'
}
