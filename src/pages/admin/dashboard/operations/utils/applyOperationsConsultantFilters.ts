import type {
  AppointmentSubmissionRow,
  AwaitingDocumentRow,
  CorrectionRequestRow,
  MarinePriorityRow,
  MyActivityRow,
  MyApplicationRow,
  MyPerformanceMetric,
  OperationsCriticalAlert,
  OperationsDashboardFilters,
  OperationsKpiMetric,
  ReviewQcRow,
  TodayTaskItem,
} from '../data/operationsConsultantDashboardMock'

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

function matchesChannel(channel: string, applicationType: string): boolean {
  if (applicationType === 'all') return true
  return channel === applicationType
}

function matchesCountry(country: string, filterCountry: string): boolean {
  if (filterCountry === 'all') return true
  return country === filterCountry
}

function matchesConsultant(consultant: string, loggedInConsultant: string): boolean {
  return consultant === loggedInConsultant
}

export function getOperationsFilterScaleFactor(filters: OperationsDashboardFilters): number {
  let factor = 1
  if (filters.country !== 'all') factor *= 0.45
  if (filters.applicationType !== 'all') factor *= 0.55
  if (filters.dateRange[0] || filters.dateRange[1]) factor *= 0.9
  return factor
}

function scaleCount(value: number, filters: OperationsDashboardFilters): number {
  const factor = getOperationsFilterScaleFactor(filters)
  if (factor === 1) return value
  return Math.max(0, Math.round(value * factor))
}

export function filterByConsultant<T extends { consultant: string }>(
  rows: T[],
  consultantName: string,
): T[] {
  return rows.filter((row) => matchesConsultant(row.consultant, consultantName))
}

export function filterMyApplications(
  rows: MyApplicationRow[],
  filters: OperationsDashboardFilters,
  consultantName: string,
): MyApplicationRow[] {
  return rows
    .filter(
      (row) =>
        matchesConsultant(row.consultant, consultantName) &&
        matchesCountry(row.country, filters.country) &&
        matchesChannel(row.channel, filters.applicationType),
    )
    .sort((a, b) => {
      if (a.dueDateSort !== b.dueDateSort) return a.dueDateSort - b.dueDateSort
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })
}

export function scaleOperationsKpis(
  kpis: OperationsKpiMetric[],
  filters: OperationsDashboardFilters,
): OperationsKpiMetric[] {
  const factor = getOperationsFilterScaleFactor(filters)
  if (factor === 1) return kpis
  return kpis.map((kpi) => ({
    ...kpi,
    total: Math.max(0, Math.round(kpi.total * factor)),
    dueToday: Math.max(0, Math.round(kpi.dueToday * factor)),
    overdue: Math.max(0, Math.round(kpi.overdue * factor)),
  }))
}

export function filterTodayTasks(
  rows: TodayTaskItem[],
  consultantName: string,
): TodayTaskItem[] {
  return filterByConsultant(rows, consultantName)
}

export function filterCorrectionRequests(
  rows: CorrectionRequestRow[],
  consultantName: string,
): CorrectionRequestRow[] {
  return filterByConsultant(rows, consultantName)
}

export function filterAwaitingDocuments(
  rows: AwaitingDocumentRow[],
  filters: OperationsDashboardFilters,
  consultantName: string,
): AwaitingDocumentRow[] {
  return rows.filter(
    (row) =>
      matchesConsultant(row.consultant, consultantName) &&
      matchesCountry(row.country, filters.country) &&
      matchesChannel(row.channel, filters.applicationType),
  )
}

export function filterReviewQcQueue(
  rows: ReviewQcRow[],
  filters: OperationsDashboardFilters,
  consultantName: string,
): ReviewQcRow[] {
  return rows.filter(
    (row) =>
      matchesConsultant(row.consultant, consultantName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function filterAppointmentSubmissionQueue(
  rows: AppointmentSubmissionRow[],
  filters: OperationsDashboardFilters,
  consultantName: string,
): AppointmentSubmissionRow[] {
  return rows.filter(
    (row) =>
      matchesConsultant(row.consultant, consultantName) &&
      matchesCountry(row.country, filters.country),
  )
}

export function filterMarinePriorityCases(
  rows: MarinePriorityRow[],
  consultantName: string,
): MarinePriorityRow[] {
  return filterByConsultant(rows, consultantName).sort(
    (a, b) => a.daysRemaining - b.daysRemaining,
  )
}

export function scaleOperationsAlerts(
  alerts: OperationsCriticalAlert[],
  filters: OperationsDashboardFilters,
): OperationsCriticalAlert[] {
  const factor = getOperationsFilterScaleFactor(filters)
  if (factor === 1) return alerts
  return alerts.map((alert) => ({
    ...alert,
    count: Math.max(0, Math.round(alert.count * factor)),
  }))
}

export function filterMyActivity(
  rows: MyActivityRow[],
  consultantName: string,
): MyActivityRow[] {
  return filterByConsultant(rows, consultantName)
}

export function scaleMyPerformance(
  metrics: MyPerformanceMetric[],
  filters: OperationsDashboardFilters,
): MyPerformanceMetric[] {
  const factor = getOperationsFilterScaleFactor(filters)
  if (factor === 1) return metrics
  return metrics.map((metric) => {
    if (metric.id === 'completed_today') {
      const num = parseInt(metric.value, 10)
      return { ...metric, value: String(scaleCount(num, filters)) }
    }
    if (metric.id === 'sla_compliance') {
      const num = parseInt(metric.value, 10)
      return { ...metric, value: `${Math.min(100, Math.max(70, Math.round(num * (0.95 + factor * 0.05))))}%` }
    }
    return metric
  })
}

export function marineDaysRemainingColor(days: number): 'success' | 'warning' | 'error' {
  if (days < 7) return 'error'
  if (days <= 10) return 'warning'
  return 'success'
}

export function slaStatusColor(status: string): 'success' | 'warning' | 'error' {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'error'
}

export function slaStatusLabel(status: string): string {
  if (status === 'on_track') return 'On Track'
  if (status === 'at_risk') return 'Approaching SLA'
  return 'SLA Breached'
}

export function priorityColor(priority: string): 'error' | 'warning' | 'neutral' {
  if (priority === 'high') return 'error'
  if (priority === 'medium') return 'warning'
  return 'neutral'
}

export function priorityLabel(priority: string): string {
  if (priority === 'high') return 'High'
  if (priority === 'medium') return 'Medium'
  return 'Low'
}
