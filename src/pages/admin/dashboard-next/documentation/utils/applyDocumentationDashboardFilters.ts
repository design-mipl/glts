import type { DocumentationActivityRow, DocumentationDashboardFilters } from '../types'

export function getDocumentationFilterScaleFactor(filters: DocumentationDashboardFilters): number {
  let factor = 1
  if (filters.country !== 'all') factor *= 0.45
  if (filters.applicationType !== 'all') factor *= 0.55
  if (filters.date !== 'today') factor *= 0.92
  return factor
}

export function getMinutesSinceLastActivity(activity: DocumentationActivityRow[]): number | null {
  if (activity.length === 0) return null
  const latest = activity.reduce((max, row) => (row.recordedAt > max.recordedAt ? row : max))
  return Math.floor((Date.now() - latest.recordedAt.getTime()) / 60000)
}

/** Mon–Fri, 09:00–18:00 local time. */
export function isBusinessHours(): boolean {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  return minutes >= 9 * 60 && minutes < 18 * 60
}

export function computeShowInactivityWarning(activity: DocumentationActivityRow[]): boolean {
  if (!isBusinessHours()) return false
  const minutes = getMinutesSinceLastActivity(activity)
  if (minutes == null) return true
  return minutes >= 60
}
