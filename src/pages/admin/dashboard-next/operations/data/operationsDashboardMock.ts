import type { OperationsDashboardData, OperationsDashboardFilters, OperationsWorkRow } from '../types'
import type { OpsSegmentKey } from '../utils/opsSegmentPaths'

export const OPERATIONS_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
]

export const OPERATIONS_COUNTRY_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'UAE', value: 'uae' },
  { label: 'Schengen', value: 'schengen' },
  { label: 'UK', value: 'uk' },
  { label: 'USA', value: 'us' },
]

export const OPERATIONS_VISA_TYPE_OPTIONS = [
  { label: 'All visa types', value: 'all' },
  { label: 'Tourist', value: 'tourist' },
  { label: 'Business', value: 'business' },
  { label: 'Transit', value: 'transit' },
  { label: 'Marine', value: 'marine' },
]

export const OPERATIONS_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Completed', value: 'completed' },
]

export const OPERATIONS_PRIORITY_OPTIONS = [
  { label: 'All priorities', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
  { label: 'Urgent', value: 'urgent' },
]

export const OPERATIONS_SEGMENT_OPTIONS = [
  { label: 'All segments', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
  { label: 'B2B', value: 'b2b' },
]

export const DEFAULT_OPERATIONS_DASHBOARD_FILTERS: OperationsDashboardFilters = {
  date: 'today',
  country: 'all',
  visaType: 'all',
  status: 'all',
  priority: 'all',
  segment: 'all',
  search: '',
}

/** Multi-color chart palette — navy · green · amber · coral · blue · teal (not green-only). */
export const OPS_CHART_COLORS = {
  navy: '#001F3F',
  green: '#73C064',
  amber: '#F59E0B',
  coral: '#EF4444',
  blue: '#3B82F6',
  teal: '#14B8A6',
  violet: '#8B5CF6',
  slate: '#64748B',
} as const

function matchSegment(rowSegment: OpsSegmentKey, filterSegment: string): boolean {
  return filterSegment === 'all' || rowSegment === filterSegment
}

/** Lightweight client-side filter so swapping to API later keeps the same contract. */
export function applyOperationsDashboardFilters(
  data: OperationsDashboardData,
  filters: OperationsDashboardFilters,
): OperationsDashboardData {
  const query = filters.search.trim().toLowerCase()
  const hasQuery = Boolean(query)
  const priorityFilter = filters.priority
  const statusFilter = filters.status
  const segmentFilter = filters.segment

  const matchPriority = (priority: string) =>
    priorityFilter === 'all' || priority.toLowerCase() === priorityFilter

  const matchStatus = (status: string) =>
    statusFilter === 'all' || status.toLowerCase().replace(/\s+/g, '-') === statusFilter

  const matchSearch = (...parts: Array<string | undefined>) =>
    !hasQuery || parts.some((part) => part?.toLowerCase().includes(query))

  const filterRows = (rows: OperationsWorkRow[]) =>
    rows.filter(
      (row) =>
        matchSegment(row.segment, segmentFilter) &&
        matchPriority(row.priority) &&
        matchStatus(row.status) &&
        matchSearch(row.glNumber, row.applicant, row.company, row.country, row.queueLabel),
    )

  const filteredMyWork = filterRows(data.myWorkRows)
  const filteredQueues = filterRows(data.queueRows)
  const filteredAssignment = filterRows(data.assignmentRows)

  const filteredAlerts =
    segmentFilter === 'all' && !hasQuery
      ? data.alerts
      : data.alerts.filter((alert) => matchSearch(alert.title, alert.description))

  return {
    ...data,
    myWorkRows: filteredMyWork,
    queueRows: filteredQueues,
    assignmentRows: filteredAssignment,
    alerts: filteredAlerts,
    workloadBySegment:
      segmentFilter === 'all'
        ? data.workloadBySegment
        : data.workloadBySegment.filter((row) => row.segment.toLowerCase() === segmentFilter),
  }
}
