import type {
  GroundServiceLine,
  OperationalCase,
  OperationalCasePriority,
  OperationalCaseStatus,
  OperationalDateFilterPreset,
  OperationsDeskFilters,
  OperationsDeskGroupBy,
} from '@/shared/types/operationalCaseHandling'
import {
  APPLICATION_FEE_DEFAULT_RATES,
  CITY_TEAMS,
  DEFAULT_APPLICATION_FEE_NAMES,
  DEFAULT_GROUND_SERVICE_NAMES,
  GROUND_SERVICE_DEFAULT_RATES,
  LOGISTICS_STATUSES,
  OPERATIONAL_CASE_PRIORITIES,
  OPERATIONAL_CASE_STATUSES,
} from '@/shared/types/operationalCaseHandling'

export type OperationsDeskStatusTab = OperationalCaseStatus

export const OPERATIONS_DESK_STATUS_TAB_ITEMS: {
  value: OperationsDeskStatusTab
  label: string
}[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Moved to Next Day', label: 'Moved to Next Day' },
  { value: 'Document Submitted', label: 'Document Submitted' },
  { value: 'Collected', label: 'Collected' },
  { value: 'Dispatched', label: 'Dispatched' },
  { value: 'Completed', label: 'Completed' },
]

export function filterOperationsDeskRowsByStatusTab(
  rows: OperationalCase[],
  tab: OperationsDeskStatusTab,
): OperationalCase[] {
  return rows.filter(row => row.status === tab)
}

export function buildOperationsDeskStatusTabs() {
  return OPERATIONS_DESK_STATUS_TAB_ITEMS.map(tab => ({
    value: tab.value,
    label: tab.label,
  }))
}

export type LogisticsStatusTab = (typeof LOGISTICS_STATUSES)[number]

export const LOGISTICS_STATUS_TAB_ITEMS: {
  value: LogisticsStatusTab
  label: string
}[] = LOGISTICS_STATUSES.map(status => ({
  value: status,
  label: status,
}))

export function filterLogisticsRowsByStatusTab(
  rows: OperationalCase[],
  tab: LogisticsStatusTab,
): OperationalCase[] {
  return rows.filter(row => row.status === tab)
}

export function buildLogisticsStatusTabs() {
  return LOGISTICS_STATUS_TAB_ITEMS.map(tab => ({
    value: tab.value,
    label: tab.label,
  }))
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

function matchesJoiningDate(row: OperationalCase, from: string, to: string): boolean {
  if (!from && !to) return true
  const joining = startOfDay(new Date(row.joiningDate))
  if (from && joining < startOfDay(new Date(from))) return false
  if (to && joining > endOfDay(new Date(to))) return false
  return true
}

export function matchesCaseSearch(row: OperationalCase, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.passengerName,
    row.operationalId,
    row.applicationId,
    row.passportNumber,
    row.cdcNumber,
    row.vesselName,
    row.companyName,
    row.country,
    row.visaType,
    row.jurisdiction,
    row.assignedExecutive,
    row.assignedTeam,
    row.status,
    row.priority,
    row.nextAction,
    row.passengerRank,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
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
      if (filters.executive && row.assignedExecutive !== filters.executive) return false
      if (filters.priority && row.priority !== filters.priority) return false
      if (filters.visaCountry && row.country !== filters.visaCountry) return false
      if (filters.jurisdiction && row.jurisdiction !== filters.jurisdiction) return false
      if (filters.applicationId && row.applicationId !== filters.applicationId) return false
      if (!matchesJoiningDate(row, filters.joiningDateFrom, filters.joiningDateTo)) return false
      if (!matchesCaseSearch(row, filters.search)) return false
      return true
    })
}

export function applyLogisticsDeskFilters(
  rows: OperationalCase[],
  filters: OperationsDeskFilters,
): OperationalCase[] {
  return rows
    .filter(row => LOGISTICS_STATUSES.includes(row.status))
    .filter(row => {
      if (!matchesOperationalDate(row, filters.datePreset, filters.customDateFrom, filters.customDateTo)) {
        return false
      }
      if (filters.status && row.status !== filters.status) return false
      if (filters.team && row.assignedTeam !== filters.team) return false
      if (filters.executive && row.assignedExecutive !== filters.executive) return false
      if (filters.priority && row.priority !== filters.priority) return false
      if (filters.visaCountry && row.country !== filters.visaCountry) return false
      if (filters.jurisdiction && row.jurisdiction !== filters.jurisdiction) return false
      if (filters.applicationId && row.applicationId !== filters.applicationId) return false
      if (!matchesJoiningDate(row, filters.joiningDateFrom, filters.joiningDateTo)) return false
      if (!matchesCaseSearch(row, filters.search)) return false
      return true
    })
}

export function getLogisticsFilterOptions(rows: OperationalCase[]) {
  const uniq = (values: string[]) => [...new Set(values.filter(Boolean))].sort()

  return {
    countries: uniq(rows.map(r => r.country)),
    jurisdictions: uniq(rows.map(r => r.jurisdiction)),
    applications: uniq(rows.map(r => r.applicationId)),
    executives: uniq(rows.map(r => r.assignedExecutive)),
    statuses: [...LOGISTICS_STATUSES],
    priorities: [...OPERATIONAL_CASE_PRIORITIES],
    cityTeams: [...CITY_TEAMS],
  }
}

export function getLogisticsDeskEmptyState(tab: LogisticsStatusTab = 'Document Submitted'): {
  emptyTitle: string
  emptyDescription: string
} {
  switch (tab) {
    case 'Document Submitted':
      return {
        emptyTitle: 'No submitted cases',
        emptyDescription:
          'Passenger cases appear here after documents are submitted from the Operations Desk.',
      }
    case 'Collected':
      return {
        emptyTitle: 'No collected cases',
        emptyDescription: 'Cases marked collected from Embassy/VFS appear here.',
      }
    case 'Dispatched':
      return {
        emptyTitle: 'No dispatched cases',
        emptyDescription: 'Cases marked dispatched appear here.',
      }
    case 'Completed':
      return {
        emptyTitle: 'No completed cases',
        emptyDescription: 'Cases auto-completed after dispatch appear here.',
      }
    default:
      return {
        emptyTitle: 'No records in Tracking & Logistics',
        emptyDescription:
          'Passenger cases appear here after documents are submitted from the Operations Desk.',
      }
  }
}

export interface OperationsDeskGroup {
  key: string
  label: string
  subtitle?: string
  rows: OperationalCase[]
}

export function groupOperationsDeskRows(
  rows: OperationalCase[],
  groupBy: OperationsDeskGroupBy,
): OperationsDeskGroup[] {
  if (groupBy === 'none') {
    return [{ key: 'all', label: 'All Records', rows }]
  }

  const map = new Map<string, OperationalCase[]>()

  for (const row of rows) {
    let key: string
    switch (groupBy) {
      case 'application':
        key = row.applicationId
        break
      case 'executive':
        key = row.assignedExecutive || 'Unassigned'
        break
      case 'status':
        key = row.status
        break
      default:
        key = 'all'
    }
    const bucket = map.get(key) ?? []
    bucket.push(row)
    map.set(key, bucket)
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, groupRows]) => {
      if (groupBy === 'application') {
        const first = groupRows[0]
        return {
          key,
          label: key,
          subtitle: `${groupRows.length} Crew Member${groupRows.length === 1 ? '' : 's'} · ${first.companyName} · ${first.vesselName}`,
          rows: groupRows.sort((a, b) => a.passengerSequence - b.passengerSequence),
        }
      }

      return {
        key,
        label: key,
        subtitle: `${groupRows.length} record${groupRows.length === 1 ? '' : 's'}`,
        rows: groupRows.sort(
          (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
        ),
      }
    })
}

export function getFilterOptions(rows: OperationalCase[]) {
  const uniq = (values: string[]) => [...new Set(values.filter(Boolean))].sort()

  return {
    countries: uniq(rows.map(r => r.country)),
    jurisdictions: uniq(rows.map(r => r.jurisdiction)),
    applications: uniq(rows.map(r => r.applicationId)),
    executives: uniq(rows.map(r => r.assignedExecutive)),
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
    case 'Dispatched':
    case 'Collected':
    case 'Document Submitted':
      return 'info'
    case 'Moved to Next Day':
      return 'warning'
    case 'Pending':
      return 'neutral'
    default:
      return 'info'
  }
}

export function formatJoiningDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const DATE_FILTER_OPTIONS: { value: OperationalDateFilterPreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This Week' },
  { value: 'custom', label: 'Custom Date Range' },
]

export const EMPTY_OPERATIONS_DESK_FILTERS: OperationsDeskFilters = {
  datePreset: 'today',
  status: '',
  team: '',
  executive: '',
  priority: '',
  visaCountry: '',
  jurisdiction: '',
  applicationId: '',
  joiningDateFrom: '',
  joiningDateTo: '',
  search: '',
}

export function getOperationsDeskEmptyState(tab: OperationsDeskStatusTab = 'Pending'): {
  emptyTitle: string
  emptyDescription: string
} {
  switch (tab) {
    case 'Pending':
      return {
        emptyTitle: 'No pending cases',
        emptyDescription:
          'Assigned passenger records awaiting ground operations appear here.',
      }
    case 'Moved to Next Day':
      return {
        emptyTitle: 'No cases moved to next day',
        emptyDescription: 'Cases manually moved to the next operational day appear here.',
      }
    case 'Document Submitted':
      return {
        emptyTitle: 'No submitted cases',
        emptyDescription:
          'Cases appear here after documents are submitted from the Operations tab.',
      }
    case 'Collected':
      return {
        emptyTitle: 'No collected cases',
        emptyDescription: 'Cases marked collected in Tracking & Logistics appear here.',
      }
    case 'Dispatched':
      return {
        emptyTitle: 'No dispatched cases',
        emptyDescription: 'Cases marked dispatched in Tracking & Logistics appear here.',
      }
    case 'Completed':
      return {
        emptyTitle: 'No completed cases',
        emptyDescription: 'Cases auto-completed after dispatch appear here.',
      }
    default:
      return {
        emptyTitle: 'No passenger operational records on the desk',
        emptyDescription:
          'Passenger records appear here after assignment and handoff from Assignment & Priority Management.',
      }
  }
}

const DEFAULT_GROUND_SERVICE_NAME_SET = new Set<string>(DEFAULT_GROUND_SERVICE_NAMES)
const DEFAULT_APPLICATION_FEE_NAME_SET = new Set<string>(DEFAULT_APPLICATION_FEE_NAMES)

function ensureServiceCatalog(
  catalogNames: readonly string[],
  defaultRates: Record<string, number>,
  services: GroundServiceLine[],
  idPrefix: string,
): GroundServiceLine[] {
  const byName = new Map(services.map(service => [service.serviceName, service]))
  const catalog: GroundServiceLine[] = []

  catalogNames.forEach((name, index) => {
    const existing = byName.get(name)
    if (existing) {
      catalog.push(existing)
      byName.delete(name)
      return
    }
    catalog.push({
      id: `${idPrefix}-${index}`,
      serviceName: name,
      selected: false,
      prefilledAmount: defaultRates[name] ?? 0,
      actualAmount: 0,
      remarks: '',
    })
  })

  for (const extra of byName.values()) {
    catalog.push(extra)
  }

  return catalog
}

/** Ensures every catalog ground service appears on a case, preserving saved state. */
export function ensureGroundServiceCatalog(services: GroundServiceLine[]): GroundServiceLine[] {
  return ensureServiceCatalog(
    DEFAULT_GROUND_SERVICE_NAMES,
    GROUND_SERVICE_DEFAULT_RATES,
    services,
    'svc',
  )
}

/** Ensures every VFS / application fee option appears on a case, preserving saved state. */
export function ensureApplicationFeeCatalog(services: GroundServiceLine[]): GroundServiceLine[] {
  return ensureServiceCatalog(
    DEFAULT_APPLICATION_FEE_NAMES,
    APPLICATION_FEE_DEFAULT_RATES,
    services,
    'fee',
  )
}

export function isCatalogGroundServiceName(name: string): boolean {
  return DEFAULT_GROUND_SERVICE_NAME_SET.has(name)
}

export function isCatalogApplicationFeeName(name: string): boolean {
  return DEFAULT_APPLICATION_FEE_NAME_SET.has(name)
}
