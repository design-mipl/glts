import type { EmptyStateProps } from '@/design-system/UIComponents'
import { invoiceStatusBadgeColor } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import { paymentStatusLabel } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import type {
  AssignmentListingTab,
  AssignmentQueueFilters,
  OperationalDateFilterPreset,
  OperationalPassengerRow,
} from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_PRIORITIES, PASSENGER_OPERATIONAL_STATUSES } from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_CITY_TEAMS } from '@/shared/types/operationalPassengerAssignment'
import { assignmentPriorityLabel } from '../config/assignmentPriorityConfig'
import { passengerStatusLabel } from '../config/assignmentStatusConfig'

export interface AssignmentQueueKpis {
  totalPending: number
  highPriority: number
  assignedToday: number
  pendingAssignment: number
  carryForward: number
  completedToday: number
  slaRisk: number
}

export const EMPTY_ASSIGNMENT_QUEUE_FILTERS: AssignmentQueueFilters = {
  datePreset: 'today',
  jurisdiction: '',
  team: '',
  assignedUser: '',
  priority: '',
  status: '',
  search: '',
}

export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This week' },
  { value: 'custom', label: 'Custom range' },
] as const

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

export function resolveDateRange(
  preset: OperationalDateFilterPreset,
  from?: string,
  to?: string,
): { from: Date; to: Date } {
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

function matchesOperationalDate(
  row: OperationalPassengerRow,
  preset: OperationalDateFilterPreset,
  from?: string,
  to?: string,
): boolean {
  const range = resolveDateRange(preset, from, to)
  const rowDate = startOfDay(new Date(row.operationalDate))
  return rowDate >= range.from && rowDate <= range.to
}

export function isSlaAtRisk(row: OperationalPassengerRow): boolean {
  if (row.passengerStatus === 'Completed') return false
  const due = new Date(row.slaDueAt).getTime()
  const now = Date.now()
  const fourHours = 4 * 60 * 60 * 1000
  return due <= now || due - now <= fourHours
}

export function formatSlaTimer(row: OperationalPassengerRow): string {
  if (row.passengerStatus === 'Completed') return '—'
  const due = new Date(row.slaDueAt).getTime()
  const diff = due - Date.now()
  if (diff <= 0) {
    const overdue = Math.abs(diff)
    const hours = Math.floor(overdue / (60 * 60 * 1000))
    const mins = Math.floor((overdue % (60 * 60 * 1000)) / (60 * 1000))
    return `-${hours}h ${mins}m`
  }
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  return `${hours}h ${mins}m`
}

export function filterRowsByListingTab(
  rows: OperationalPassengerRow[],
  tab: AssignmentListingTab,
): OperationalPassengerRow[] {
  switch (tab) {
    case 'pending_assignment':
      return rows.filter(r => r.passengerStatus === 'Pending Assignment')
    case 'assigned':
      return rows.filter(r => r.passengerStatus === 'Assigned')
    case 'in_progress':
      return rows.filter(r => r.passengerStatus === 'In Progress')
    case 'carry_forward':
      return rows.filter(r => r.passengerStatus === 'Carry Forward' || r.carryForward)
    case 'completed':
      return rows.filter(r => r.passengerStatus === 'Completed')
    case 'all':
    default:
      return rows
  }
}

export function applyAssignmentQueueFilters(
  rows: OperationalPassengerRow[],
  filters: AssignmentQueueFilters,
): OperationalPassengerRow[] {
  return rows.filter(row => {
    if (!matchesOperationalDate(row, filters.datePreset, filters.customDateFrom, filters.customDateTo)) {
      return false
    }
    if (filters.jurisdiction && row.jurisdiction !== filters.jurisdiction) return false
    if (filters.team && row.assignedTeam !== filters.team) return false
    if (filters.assignedUser && row.assignedUser !== filters.assignedUser) return false
    if (filters.priority && row.priority !== filters.priority) return false
    if (filters.status && row.passengerStatus !== filters.status) return false
    if (filters.search && !matchesAssignmentSearch(row, filters.search)) return false
    return true
  })
}

export function matchesAssignmentSearch(row: OperationalPassengerRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.passengerName,
    row.gltsApplicationId,
    row.gltsApplicantId,
    row.companyName,
    row.country,
    row.visaType,
    row.jurisdiction,
    row.assignedTeam,
    row.assignedUser,
    row.passengerStatus,
    row.priority,
    row.operationalRemarks,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getAssignmentCellValue(row: OperationalPassengerRow, key: string): string {
  switch (key) {
    case 'priority':
      return assignmentPriorityLabel[row.priority]
    case 'passengerName':
      return row.passengerName
    case 'applicationId':
      return row.gltsApplicationId
    case 'companyName':
      return row.companyName
    case 'countryVisa':
      return `${row.country} ${row.visaType}`.trim()
    case 'country':
      return row.country
    case 'jurisdiction':
      return row.jurisdiction
    case 'visaType':
      return row.visaType
    case 'travelDate':
      return row.travelDate
    case 'assignedTeam':
      return row.assignedTeam || '—'
    case 'assignedUser':
      return row.assignedUser || '—'
    case 'operationalDate':
      return row.operationalDate
    case 'passengerStatus':
      return passengerStatusLabel[row.passengerStatus]
    case 'submissionStatus':
      return row.submissionStatus
    case 'slaTimer':
      return formatSlaTimer(row)
    case 'lastUpdated':
      return row.lastUpdated
    case 'operationalRemarks':
      return row.operationalRemarks || '—'
    default:
      return ''
  }
}

export function computeAssignmentKpis(rows: OperationalPassengerRow[]): AssignmentQueueKpis {
  const today = new Date().toISOString().slice(0, 10)
  return {
    totalPending: rows.filter(
      r => r.passengerStatus !== 'Completed' && r.passengerStatus !== 'Carry Forward',
    ).length,
    highPriority: rows.filter(r => r.priority === 'Urgent' || r.priority === 'High').length,
    assignedToday: rows.filter(
      r => r.operationalDate === today && r.passengerStatus === 'Assigned',
    ).length,
    pendingAssignment: rows.filter(r => r.passengerStatus === 'Pending Assignment').length,
    carryForward: rows.filter(r => r.carryForward || r.passengerStatus === 'Carry Forward').length,
    completedToday: rows.filter(
      r => r.passengerStatus === 'Completed' && r.lastUpdated.slice(0, 10) === today,
    ).length,
    slaRisk: rows.filter(isSlaAtRisk).length,
  }
}

export function getAssignmentFilterOptions(rows: OperationalPassengerRow[]) {
  const jurisdictions = new Set<string>()
  const teams = new Set<string>()
  const users = new Set<string>()

  for (const row of rows) {
    if (row.jurisdiction && row.jurisdiction !== '—') jurisdictions.add(row.jurisdiction)
    if (row.assignedTeam) teams.add(row.assignedTeam)
    if (row.assignedUser) users.add(row.assignedUser)
  }

  return {
    jurisdictions: Array.from(jurisdictions).sort(),
    teams: ASSIGNMENT_CITY_TEAMS.filter(t => teams.size === 0 || teams.has(t)),
    users: Array.from(users).sort(),
    priorities: ASSIGNMENT_PRIORITIES,
    statuses: PASSENGER_OPERATIONAL_STATUSES,
  }
}

export function getAssignmentTabEmptyState(tab: AssignmentListingTab): EmptyStateProps {
  const map: Record<AssignmentListingTab, EmptyStateProps> = {
    all: {
      title: 'No passenger records',
      description: 'Submitted applications will appear here as passenger-level operational rows.',
    },
    pending_assignment: {
      title: 'No pending assignments',
      description: 'All passengers in this view are already assigned or in progress.',
    },
    assigned: {
      title: 'No assigned passengers',
      description: 'Assign users from the queue to route operational work.',
    },
    in_progress: {
      title: 'No in-progress passengers',
      description: 'Passengers actively being worked will appear here.',
    },
    carry_forward: {
      title: 'No carry-forward cases',
      description: 'Incomplete work moved to the next operational date will show here.',
    },
    completed: {
      title: 'No completed passengers',
      description: 'Completed operational work will appear in this tab.',
    },
  }
  return map[tab]
}

export function downloadAssignmentCsv(rows: OperationalPassengerRow[]) {
  const headers = [
    'Passenger Name',
    'Priority',
    'Application ID',
    'GLTS Applicant ID',
    'Company Name',
    'Visa Country',
    'Visa Type',
    'Jurisdiction',
    'Travel Date',
    'Assigned Team',
    'Assigned User',
    'Operational Date',
    'Current Status',
    'Submission Status',
    'SLA / Time Remaining',
    'Last Updated',
    'Operational Remarks',
  ]
  const lines = rows.map(row =>
    [
      row.passengerName,
      row.priority,
      row.gltsApplicationId,
      row.gltsApplicantId,
      row.companyName,
      row.country,
      row.visaType,
      row.jurisdiction,
      row.travelDate,
      row.assignedTeam,
      row.assignedUser,
      row.operationalDate,
      row.passengerStatus,
      row.submissionStatus,
      formatSlaTimer(row),
      row.lastUpdated,
      row.operationalRemarks,
    ]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `assignment-queue-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export { invoiceStatusBadgeColor, paymentStatusLabel }
