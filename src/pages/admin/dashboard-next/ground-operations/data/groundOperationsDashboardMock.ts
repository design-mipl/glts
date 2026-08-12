import type {
  GroundOperationsDashboardData,
  GroundOperationsDashboardFilters,
} from '../types'

/** @deprecated Prefer `../config/groundOperationsDashboardFilters`. */
export {
  DEFAULT_GROUND_OPS_DASHBOARD_FILTERS,
  GROUND_OPS_CASE_STATUS_OPTIONS,
  GROUND_OPS_DATE_OPTIONS,
  GROUND_OPS_EXECUTIVE_OPTIONS,
  GROUND_OPS_PRIORITY_OPTIONS,
  GROUND_OPS_TEAM_OPTIONS,
} from '../config/groundOperationsDashboardFilters'

/** Legacy aliases kept for older imports. */
export const GROUND_OPS_JURISDICTION_OPTIONS = [
  { label: 'All teams', value: 'all' },
  { label: 'Mumbai Team', value: 'mumbai' },
  { label: 'Delhi Team', value: 'delhi' },
  { label: 'Chennai Team', value: 'chennai' },
  { label: 'Marine Team', value: 'marine' },
]

/** @deprecated Prefer GROUND_OPS_JURISDICTION_OPTIONS */
export const GROUND_OPS_BRANCH_OPTIONS = GROUND_OPS_JURISDICTION_OPTIONS

export const GROUND_OPS_CITY_OPTIONS = GROUND_OPS_JURISDICTION_OPTIONS

export const GROUND_OPS_ASSIGNMENT_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Document Submitted', value: 'document-submitted' },
  { label: 'Moved to Next Day', value: 'moved-to-next-day' },
  { label: 'Collected', value: 'collected' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Completed', value: 'completed' },
]

export const GROUND_OPS_APPOINTMENT_STATUS_OPTIONS = GROUND_OPS_ASSIGNMENT_STATUS_OPTIONS

/**
 * Empty fallback only. Prefer `buildGroundOperationsDashboardFromServices`.
 * @deprecated
 */
export const GROUND_OPERATIONS_DASHBOARD_MOCK: GroundOperationsDashboardData = {
  executiveName: 'Ground Operations',
  quickStats: [],
  notifications: [],
  todaysJobs: [],
  routeTimeline: [],
  appointmentSchedule: [],
  courierTracking: {
    trackingNumber: '—',
    courier: '—',
    status: 'No consignments in transit',
    stages: [],
  },
  quickActions: [],
  recentActivity: [],
  appointmentRows: [],
  passportJourney: {
    stages: [],
    journeyStatus: 'Pending',
  },
  passportCourier: {
    trackingNumber: '—',
    courier: '—',
    status: 'No consignments in transit',
    stages: [],
  },
  documentMovement: [],
  passportRows: [],
  expenseSummary: { submitted: 0, approved: 0, pending: 0, rejected: 0 },
  settlementRows: [],
  fundCaseRows: [],
  claimSheetRows: [],
  activityFeed: [],
  activityNotifications: [],
  activityRoute: [],
  activityDocuments: [],
}

/** @deprecated Dashboard now builds from live Ground Ops services. */
export function applyGroundOperationsDashboardFilters(
  data: GroundOperationsDashboardData,
  _filters: GroundOperationsDashboardFilters,
): GroundOperationsDashboardData {
  return data
}
