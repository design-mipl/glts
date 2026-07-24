import type { DashboardIntelligenceFilters, IntelligenceFilterFieldConfig } from '../types'

export const DEFAULT_INTELLIGENCE_FILTERS: DashboardIntelligenceFilters = {
  datePreset: 'month',
  branch: 'all',
  segment: 'all',
  country: 'all',
  visaType: 'all',
  client: 'all',
  salesPerson: 'all',
  operationsTeam: 'all',
  financeTeam: 'all',
  employee: 'all',
  status: 'all',
  revenueType: 'all',
  search: '',
}

const ALL = { label: 'All', value: 'all' }

export const DEFAULT_INTELLIGENCE_FILTER_FIELDS: IntelligenceFilterFieldConfig[] = [
  {
    id: 'datePreset',
    label: 'Date range',
    options: [
      { label: 'Today', value: 'today' },
      { label: 'This week', value: 'week' },
      { label: 'This month', value: 'month' },
      { label: 'This quarter', value: 'quarter' },
      { label: 'This year', value: 'year' },
    ],
  },
  {
    id: 'segment',
    label: 'Business segment',
    options: [
      ALL,
      { label: 'Marine', value: 'marine' },
      { label: 'Corporate', value: 'corporate' },
      { label: 'Retail', value: 'retail' },
      { label: 'B2B', value: 'b2b' },
    ],
  },
  {
    id: 'country',
    label: 'Country',
    options: [
      ALL,
      { label: 'UAE', value: 'uae' },
      { label: 'Schengen', value: 'schengen' },
      { label: 'UK', value: 'uk' },
      { label: 'USA', value: 'us' },
    ],
  },
  {
    id: 'client',
    label: 'Client',
    options: [
      ALL,
      { label: 'BrightCorp India', value: 'brightcorp' },
      { label: 'Horizon Logistics', value: 'horizon' },
      { label: 'Nordic Marine Ltd', value: 'nordic' },
    ],
  },
  {
    id: 'salesPerson',
    label: 'Sales person',
    options: [ALL, { label: 'A. Mehta', value: 'amehta' }, { label: 'R. Shah', value: 'rshah' }],
  },
  {
    id: 'operationsTeam',
    label: 'Operations team',
    options: [ALL, { label: 'Ops Pod A', value: 'ops-a' }, { label: 'Ops Pod B', value: 'ops-b' }],
  },
  {
    id: 'financeTeam',
    label: 'Finance team',
    options: [ALL, { label: 'Collections', value: 'collections' }, { label: 'AR', value: 'ar' }],
  },
  {
    id: 'employee',
    label: 'Employee',
    options: [ALL, { label: 'Network', value: 'network' }],
  },
  {
    id: 'status',
    label: 'Status',
    options: [
      ALL,
      { label: 'Open', value: 'open' },
      { label: 'In progress', value: 'in-progress' },
      { label: 'Completed', value: 'completed' },
      { label: 'At risk', value: 'at-risk' },
    ],
  },
  {
    id: 'revenueType',
    label: 'Revenue type',
    options: [
      ALL,
      { label: 'Service fee', value: 'service' },
      { label: 'Embassy', value: 'embassy' },
      { label: 'VFS', value: 'vfs' },
    ],
  },
]

export function countActiveIntelligenceFilters(
  filters: DashboardIntelligenceFilters,
  defaults: DashboardIntelligenceFilters = DEFAULT_INTELLIGENCE_FILTERS,
): number {
  let count = 0
  ;(Object.keys(defaults) as Array<keyof DashboardIntelligenceFilters>).forEach((key) => {
    if (key === 'search') {
      if (filters.search.trim()) count += 1
      return
    }
    if (filters[key] !== defaults[key]) count += 1
  })
  return count
}
