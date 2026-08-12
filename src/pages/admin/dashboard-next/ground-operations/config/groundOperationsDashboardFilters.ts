/** Filter option catalogs for Ground Operations dashboard-next. */

export const GROUND_OPS_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This week', value: 'this_week' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'MTD', value: 'mtd' },
  { label: 'All dates', value: 'all' },
]

export const GROUND_OPS_TEAM_OPTIONS = [
  { label: 'All teams', value: 'all' },
  { label: 'Mumbai Team', value: 'mumbai' },
  { label: 'Delhi Team', value: 'delhi' },
  { label: 'Chennai Team', value: 'chennai' },
  { label: 'Marine Team', value: 'marine' },
]

export const GROUND_OPS_EXECUTIVE_OPTIONS = [
  { label: 'All executives', value: 'all' },
]

export const GROUND_OPS_CASE_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Document Submitted', value: 'document-submitted' },
  { label: 'Moved to Next Day', value: 'moved-to-next-day' },
  { label: 'Collected', value: 'collected' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Completed', value: 'completed' },
]

export const GROUND_OPS_PRIORITY_OPTIONS = [
  { label: 'All priorities', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Normal', value: 'normal' },
]

export const DEFAULT_GROUND_OPS_DASHBOARD_FILTERS = {
  date: 'all',
  team: 'all',
  executive: 'all',
  caseStatus: 'all',
  priority: 'all',
  search: '',
} as const
