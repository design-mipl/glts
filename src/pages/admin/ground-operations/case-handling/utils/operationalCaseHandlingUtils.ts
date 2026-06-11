import type {
  OperationalCase,
  OperationalCaseListFilters,
  OperationalCasePriority,
  OperationalCaseStatus,
  OperationalDateFilterPreset,
  OperationsDeskFilters,
} from '@/shared/types/operationalCaseHandling'
import type { Column } from '@/design-system/UIComponents'
import {
  CITY_TEAMS,
  OPERATIONAL_CASE_PRIORITIES,
  OPERATIONAL_CASE_STATUSES,
} from '@/shared/types/operationalCaseHandling'

export type CaseHandlingTab = 'priority_queue' | 'operations_desk'

export interface PriorityQueueKpis {
  pendingToday: number
  inOperations: number
  urgentCases: number
  completedToday: number
  movedToNextDay: number
  delayedCases: number
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function resolveDateRange(preset: OperationalDateFilterPreset, from?: string, to?: string): {
  from: Date
  to: Date
} {
  const today = startOfDay(new Date())

  switch (preset) {
    case 'yesterday': {
      const y = addDays(today, -1)
      return { from: y, to: endOfDay(y) }
    }
    case 'tomorrow': {
      const t = addDays(today, 1)
      return { from: t, to: endOfDay(t) }
    }
    case 'this_week': {
      const start = addDays(today, -today.getDay())
      const end = addDays(start, 6)
      return { from: start, to: endOfDay(end) }
    }
    case 'custom': {
      const customFrom = from ? startOfDay(new Date(from)) : today
      const customTo = to ? endOfDay(new Date(to)) : endOfDay(today)
      return { from: customFrom, to: customTo }
    }
    case 'today':
    default:
      return { from: today, to: endOfDay(today) }
  }
}

function matchesOperationalDate(row: OperationalCase, preset: OperationalDateFilterPreset, from?: string, to?: string): boolean {
  const range = resolveDateRange(preset, from, to)
  const rowDate = startOfDay(new Date(row.operationalDate))
  return rowDate >= range.from && rowDate <= range.to
}

export function matchesCaseSearch(row: OperationalCase, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.applicationId,
    row.companyName,
    row.country,
    row.visaType,
    row.assignedExecutive,
    row.assignedTeam,
    row.status,
    row.priority,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getOperationalCaseCellValue(row: OperationalCase, key: string): string {
  switch (key) {
    case 'applicationId':
      return row.applicationId
    case 'companyName':
      return row.companyName
    case 'countryVisa':
      return `${row.country} · ${row.visaType}`
    case 'country':
      return row.country
    case 'visaType':
      return row.visaType
    case 'applicantCount':
      return String(row.applicantCount)
    case 'priority':
      return row.priority
    case 'status':
      return row.status
    case 'progressPercent':
      return String(row.progressPercent)
    case 'assignment':
      return `${row.assignedTeam || '—'} · ${row.assignedExecutive || '—'}`
    case 'assignedTeam':
      return row.assignedTeam || '—'
    case 'assignedExecutive':
      return row.assignedExecutive || '—'
    default:
      return ''
  }
}

export const PRIORITY_QUEUE_COLUMNS: Column<OperationalCase>[] = [
  { key: 'applicationId', label: 'Application ID', width: 140, sortable: true, filterable: true, searchable: false },
  { key: 'companyName', label: 'Company', sortable: true, filterable: true, searchable: false },
  { key: 'countryVisa', label: 'Country / Visa', sortable: true, filterable: true, searchable: false },
  { key: 'applicantCount', label: 'Applicants', width: 72, sortable: true, filterable: true, searchable: false },
  { key: 'priority', label: 'Priority', width: 110, sortable: true, filterable: true, searchable: false },
  { key: 'status', label: 'Status', width: 120, sortable: true, filterable: true, searchable: false },
  { key: 'assignment', label: 'Team / Executive', sortable: true, filterable: true, searchable: false },
  { key: 'actions', label: '', width: 44, sortable: false, filterable: false, hideable: false, searchable: false },
]

export const PRIORITY_QUEUE_GRID_TEMPLATE =
  '140px 1.4fr 1.2fr 72px 110px 120px 1.2fr 44px'

export function applyPriorityQueueFilters(
  rows: OperationalCase[],
  filters: OperationalCaseListFilters,
): OperationalCase[] {
  return rows.filter(row => {
    if (!matchesOperationalDate(row, filters.datePreset, filters.customDateFrom, filters.customDateTo)) {
      return false
    }
    if (filters.priority && row.priority !== filters.priority) return false
    if (filters.cityTeam && row.assignedTeam !== filters.cityTeam) return false
    if (filters.country && row.country !== filters.country) return false
    if (!matchesCaseSearch(row, filters.search)) return false
    return true
  })
}

export function applyOperationsDeskFilters(
  rows: OperationalCase[],
  filters: OperationsDeskFilters,
): OperationalCase[] {
  return rows
    .filter(row => row.markedForOperations || row.status !== 'Pending')
    .filter(row => {
      if (!matchesOperationalDate(row, filters.datePreset, filters.customDateFrom, filters.customDateTo)) {
        return false
      }
      if (filters.status && row.status !== filters.status) return false
      if (filters.team && row.assignedTeam !== filters.team) return false
      if (!matchesCaseSearch(row, filters.search)) return false
      return true
    })
}

export function computePriorityQueueKpis(rows: OperationalCase[]): PriorityQueueKpis {
  const today = new Date().toISOString().slice(0, 10)
  const todayRows = rows.filter(r => r.operationalDate === today)

  return {
    pendingToday: todayRows.filter(r => r.status === 'Pending').length,
    inOperations: rows.filter(r =>
      ['In Operations', 'Biometrics Pending', 'VFS Completed', 'Passport Collected'].includes(r.status),
    ).length,
    urgentCases: rows.filter(r => r.priority === 'Urgent' || r.priority === 'Critical').length,
    completedToday: todayRows.filter(r => r.status === 'Completed').length,
    movedToNextDay: rows.filter(r => r.carryForward || r.status === 'Moved to Next Day').length,
    delayedCases: rows.filter(r => r.delayed).length,
  }
}

export function getFilterOptions(rows: OperationalCase[]) {
  const uniq = (values: string[]) => [...new Set(values.filter(Boolean))].sort()

  return {
    countries: uniq(rows.map(r => r.country)),
    statuses: [...OPERATIONAL_CASE_STATUSES],
    priorities: [...OPERATIONAL_CASE_PRIORITIES],
    cityTeams: [...CITY_TEAMS],
  }
}

export function priorityBadgeColor(priority: OperationalCasePriority): 'neutral' | 'info' | 'warning' | 'error' {
  switch (priority) {
    case 'Critical':
      return 'error'
    case 'Urgent':
      return 'warning'
    case 'High':
      return 'info'
    default:
      return 'neutral'
  }
}

export function statusBadgeColor(status: OperationalCaseStatus): 'neutral' | 'info' | 'warning' | 'success' | 'error' {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'Passport Collected':
    case 'VFS Completed':
      return 'info'
    case 'Moved to Next Day':
    case 'Biometrics Pending':
      return 'warning'
    case 'Pending':
      return 'neutral'
    default:
      return 'info'
  }
}

export const DATE_FILTER_OPTIONS: { value: OperationalDateFilterPreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This Week' },
  { value: 'custom', label: 'Custom Date Range' },
]

export const EMPTY_PRIORITY_QUEUE_FILTERS: OperationalCaseListFilters = {
  datePreset: 'today',
  priority: '',
  cityTeam: '',
  country: '',
  search: '',
}

export const EMPTY_OPERATIONS_DESK_FILTERS: OperationsDeskFilters = {
  datePreset: 'today',
  status: '',
  team: '',
  search: '',
}

export function getTabEmptyState(tab: CaseHandlingTab): {
  emptyTitle: string
  emptyDescription: string
} {
  if (tab === 'operations_desk') {
    return {
      emptyTitle: 'No cases on the operations desk',
      emptyDescription:
        'Mark applications for operations from the Priority Queue to allocate ground execution work.',
    }
  }
  return {
    emptyTitle: 'No operational cases in queue',
    emptyDescription:
      'Cases from Assignment Management appear here for monitoring, prioritization, and allocation.',
  }
}
