import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import type { TravelDateRiskThresholds, VisaApplicationWindow } from '@/shared/types/countryMaster'

export type TravelDateFeasibilityStatus = 'green' | 'amber' | 'red' | 'unknown'
export type CalendarRiskLevel = 'safe' | 'tight' | 'high' | 'past' | 'unavailable'

export interface TravelFeasibilityConfig {
  requiredWorkingDays: number | null
  thresholds: TravelDateRiskThresholds
  applicationWindow?: VisaApplicationWindow
}

export interface TravelDateFeasibilityResult {
  status: TravelDateFeasibilityStatus
  headline: string
  requiredWorkingDays: number | null
  availableWorkingDays: number | null
  bufferWorkingDays: number | null
  summaryLine: string
  showWarning: boolean
  /** @deprecated Use availableWorkingDays */
  remainingWorkingDays?: number | null
  /** @deprecated Use summaryLine */
  message?: string
}

/** Parse configured processing time text into working days (uses upper bound for ranges). */
export function parseProcessingWorkingDays(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const numbers = [...trimmed.matchAll(/\d+/g)].map((match) => Number(match[0]))
  if (!numbers.length) return null

  return Math.max(...numbers)
}

/** Extract numeric days string for admin inputs (first number or max for ranges). */
export function parseJurisdictionProcessingDays(value: string): string {
  const days = parseProcessingWorkingDays(value)
  return days != null ? String(days) : ''
}

/** Format for read-only display in cards and lists. */
export function formatJurisdictionProcessingDays(value: string): string {
  const days = parseJurisdictionProcessingDays(value)
  if (!days) return value.trim() || '—'
  const n = Number(days)
  return n === 1 ? '1 day' : `${n} days`
}

function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** Parse YYYY-MM-DD as a local calendar date (avoids UTC shift from `new Date(iso)`). */
function parseIsoDateLocal(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const parsed = new Date(year, month, day)

  if (parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
    return null
  }

  return startOfDay(parsed)
}

function isWorkingDay(date: Date): boolean {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

/** Count Mon–Fri from start (inclusive) to end (exclusive). */
export function countWorkingDaysBetween(start: Date, end: Date): number {
  const from = startOfDay(start)
  const to = startOfDay(end)
  if (to <= from) return 0

  let count = 0
  const cursor = new Date(from)
  while (cursor < to) {
    if (isWorkingDay(cursor)) count += 1
    cursor.setDate(cursor.getDate() + 1)
  }
  return count
}

function resolveThresholds(thresholds?: TravelDateRiskThresholds): TravelDateRiskThresholds {
  return thresholds ?? DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS
}

function formatSummaryLine(required: number, available: number): string {
  const requiredLabel = required === 1 ? 'Day' : 'Days'
  const availableLabel = available === 1 ? 'Day' : 'Days'
  return `${required} ${requiredLabel} Required • ${available} ${availableLabel} Available`
}

function statusFromBuffer(
  bufferWorkingDays: number,
  thresholds: TravelDateRiskThresholds,
): TravelDateFeasibilityStatus {
  const { escalationBufferDays, safeBufferDays } = resolveThresholds(thresholds)
  if (bufferWorkingDays < escalationBufferDays) return 'red'
  if (bufferWorkingDays <= safeBufferDays) return 'amber'
  return 'green'
}

function headlineFromStatus(status: TravelDateFeasibilityStatus): string {
  if (status === 'green') return 'On Track'
  if (status === 'amber') return 'Timeline Tight'
  if (status === 'red') return 'Processing Timeline at Risk'
  return ''
}

function calendarRiskFromBuffer(
  bufferWorkingDays: number,
  thresholds: TravelDateRiskThresholds,
): CalendarRiskLevel {
  const status = statusFromBuffer(bufferWorkingDays, thresholds)
  if (status === 'green') return 'safe'
  if (status === 'amber') return 'tight'
  return 'high'
}

export function getCalendarRiskLevel(
  travelDateIso: string,
  config: TravelFeasibilityConfig,
  applicationDate: Date = new Date(),
): CalendarRiskLevel {
  const required = config.requiredWorkingDays
  if (!required || required <= 0) return 'unavailable'

  const travelDate = parseIsoDateLocal(travelDateIso)
  const today = startOfDay(applicationDate)
  if (!travelDate) return 'unavailable'
  if (travelDate <= today) return 'past'

  const available = countWorkingDaysBetween(today, travelDate)
  const buffer = available - required
  return calendarRiskFromBuffer(buffer, config.thresholds)
}

/** Calendar tile band for future travel dates; past/today render as neutral tiles. */
export function getCalendarHeatmapRiskLevel(
  travelDateIso: string,
  config: TravelFeasibilityConfig,
  applicationDate: Date = new Date(),
): CalendarRiskLevel {
  const required = config.requiredWorkingDays
  if (!required || required <= 0) return 'unavailable'

  const travelDate = parseIsoDateLocal(travelDateIso)
  const today = startOfDay(applicationDate)
  if (!travelDate) return 'unavailable'
  if (travelDate <= today) return 'past'

  const available = countWorkingDaysBetween(today, travelDate)
  const buffer = available - required
  return calendarRiskFromBuffer(buffer, config.thresholds)
}

export function assessTravelDateFeasibility({
  applicationDate,
  travelDateIso,
  requiredWorkingDays,
  thresholds = DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
}: {
  applicationDate: Date
  travelDateIso: string
  requiredWorkingDays: number | null
  thresholds?: TravelDateRiskThresholds
}): TravelDateFeasibilityResult {
  const emptyResult = (overrides: Partial<TravelDateFeasibilityResult>): TravelDateFeasibilityResult => ({
    status: 'unknown',
    bufferWorkingDays: null,
    availableWorkingDays: null,
    remainingWorkingDays: null,
    requiredWorkingDays,
    headline: '',
    summaryLine: '',
    message: '',
    showWarning: false,
    ...overrides,
  })

  if (!travelDateIso.trim() || requiredWorkingDays == null || requiredWorkingDays <= 0) {
    return emptyResult({})
  }

  const travelDate = parseIsoDateLocal(travelDateIso)
  const today = startOfDay(applicationDate)

  if (!travelDate) {
    return emptyResult({})
  }

  if (travelDate <= today) {
    const headline = headlineFromStatus('red')
    const summaryLine = formatSummaryLine(requiredWorkingDays, 0)
    return {
      status: 'red',
      bufferWorkingDays: -requiredWorkingDays,
      availableWorkingDays: 0,
      remainingWorkingDays: 0,
      requiredWorkingDays,
      headline,
      summaryLine,
      message: summaryLine,
      showWarning: true,
    }
  }

  const availableWorkingDays = countWorkingDaysBetween(today, travelDate)
  const bufferWorkingDays = availableWorkingDays - requiredWorkingDays
  const status = statusFromBuffer(bufferWorkingDays, thresholds)
  const headline = headlineFromStatus(status)
  const summaryLine = formatSummaryLine(requiredWorkingDays, availableWorkingDays)

  return {
    status,
    bufferWorkingDays,
    availableWorkingDays,
    remainingWorkingDays: availableWorkingDays,
    requiredWorkingDays,
    headline,
    summaryLine,
    message: summaryLine,
    showWarning: bufferWorkingDays < 0 || status !== 'green',
  }
}

export function evaluateTravelDateFeasibility({
  applicationDate = new Date(),
  travelDateIso,
  config,
}: {
  applicationDate?: Date
  travelDateIso: string
  config: TravelFeasibilityConfig
}): TravelDateFeasibilityResult {
  return assessTravelDateFeasibility({
    applicationDate,
    travelDateIso,
    requiredWorkingDays: config.requiredWorkingDays,
    thresholds: config.thresholds,
  })
}
