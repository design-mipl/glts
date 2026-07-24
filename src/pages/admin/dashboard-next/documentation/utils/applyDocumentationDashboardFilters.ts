import type {
  AppointmentToBookRow,
  DocCorrectionRequestRow,
  DocReviewQcRow,
  DocumentationActivityRow,
  DocumentationApplicationRow,
  DocumentationCriticalAlert,
  DocumentationDashboardFilters,
  DocumentationPerformanceMetric,
  FeeToPayRow,
  FormToFillRow,
  ReadyForSubmissionRow,
  SubmissionPendingRow,
} from '../types'

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

function matchesChannel(channel: string, applicationType: string): boolean {
  if (applicationType === 'all') return true
  return channel === applicationType
}

function matchesCountry(country: string, filterCountry: string): boolean {
  if (filterCountry === 'all') return true
  return country === filterCountry
}

function matchesExecutive(executive: string, loggedInExecutive: string): boolean {
  return executive === loggedInExecutive
}

export function getDocumentationFilterScaleFactor(filters: DocumentationDashboardFilters): number {
  let factor = 1
  if (filters.country !== 'all') factor *= 0.45
  if (filters.applicationType !== 'all') factor *= 0.55
  if (filters.date !== 'today') factor *= 0.92
  return factor
}

function scaleCount(value: number, filters: DocumentationDashboardFilters): number {
  const factor = getDocumentationFilterScaleFactor(filters)
  if (factor === 1) return value
  return Math.max(0, Math.round(value * factor))
}

export function filterDocumentationApplications(
  rows: DocumentationApplicationRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): DocumentationApplicationRow[] {
  return rows
    .filter(
      (row) =>
        matchesExecutive(row.executive, executiveName) &&
        matchesCountry(row.country, filters.country) &&
        matchesChannel(row.channel, filters.applicationType),
    )
    .sort((a, b) => {
      if (a.dueDateSort !== b.dueDateSort) return a.dueDateSort - b.dueDateSort
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })
}

export function filterFormsToFill(
  rows: FormToFillRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): FormToFillRow[] {
  return rows.filter(
    (row) =>
      matchesExecutive(row.executive, executiveName) &&
      matchesCountry(row.country, filters.country) &&
      matchesChannel(row.channel, filters.applicationType),
  )
}

export function filterFeesToPay(
  rows: FeeToPayRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): FeeToPayRow[] {
  return rows.filter(
    (row) =>
      matchesExecutive(row.executive, executiveName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function filterAppointmentsToBook(
  rows: AppointmentToBookRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): AppointmentToBookRow[] {
  return rows.filter(
    (row) =>
      matchesExecutive(row.executive, executiveName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function filterDocReviewQc(
  rows: DocReviewQcRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): DocReviewQcRow[] {
  return rows.filter(
    (row) =>
      matchesExecutive(row.executive, executiveName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function filterDocCorrectionRequests(
  rows: DocCorrectionRequestRow[],
  executiveName: string,
): DocCorrectionRequestRow[] {
  return rows.filter((row) => matchesExecutive(row.executive, executiveName))
}

export function filterReadyForSubmission(
  rows: ReadyForSubmissionRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): ReadyForSubmissionRow[] {
  return rows.filter(
    (row) =>
      matchesExecutive(row.executive, executiveName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function filterSubmissionPending(
  rows: SubmissionPendingRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): SubmissionPendingRow[] {
  return rows.filter(
    (row) =>
      matchesExecutive(row.executive, executiveName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function scaleDocumentationAlerts(
  alerts: DocumentationCriticalAlert[],
  filters: DocumentationDashboardFilters,
): DocumentationCriticalAlert[] {
  const factor = getDocumentationFilterScaleFactor(filters)
  if (factor === 1) return alerts
  return alerts.map((alert) => ({
    ...alert,
    count: Math.max(0, Math.round(alert.count * factor)),
  }))
}

export function filterDocumentationActivity(
  rows: DocumentationActivityRow[],
  executiveName: string,
): DocumentationActivityRow[] {
  return rows.filter((row) => matchesExecutive(row.executive, executiveName))
}

export function scaleDocumentationPerformance(
  metrics: DocumentationPerformanceMetric[],
  filters: DocumentationDashboardFilters,
): DocumentationPerformanceMetric[] {
  const factor = getDocumentationFilterScaleFactor(filters)
  if (factor === 1) return metrics
  return metrics.map((metric) => {
    if (metric.id === 'processed_today' || metric.id === 'qc_completed') {
      const num = parseInt(metric.value, 10)
      return { ...metric, value: String(scaleCount(num, filters)) }
    }
    return metric
  })
}

export function getMinutesSinceLastActivity(activity: DocumentationActivityRow[]): number | null {
  if (activity.length === 0) return null
  const latest = activity.reduce((max, row) =>
    row.recordedAt > max.recordedAt ? row : max,
  )
  return Math.floor((Date.now() - latest.recordedAt.getTime()) / 60000)
}

/** Mon–Fri, 09:00–18:00 local time. */
export function isBusinessHours(): boolean {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const hour = now.getHours()
  return hour >= 9 && hour < 18
}

export function computeShowInactivityWarning(activity: DocumentationActivityRow[]): boolean {
  const minutes = getMinutesSinceLastActivity(activity)
  return isBusinessHours() && minutes !== null && minutes > 60
}
