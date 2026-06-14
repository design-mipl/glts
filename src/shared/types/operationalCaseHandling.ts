export type OperationalCasePriority = 'Normal' | 'High' | 'Urgent' | 'Critical'

export type OperationalCaseStatus =
  | 'Pending'
  | 'Documents Verified'
  | 'In Operations'
  | 'Biometrics Pending'
  | 'VFS Scheduled'
  | 'VFS Pending'
  | 'VFS Completed'
  | 'Passport Collected'
  | 'Courier Pending'
  | 'Moved to Next Day'
  | 'Completed'

export type CityTeam = 'Mumbai Team' | 'Delhi Team' | 'Chennai Team'

export type OperationalDateFilterPreset =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'this_week'
  | 'custom'

export type OperationsDeskGroupBy = 'none' | 'application' | 'executive' | 'status'

export interface OperationalTimelineEvent {
  id: string
  occurredAt: string
  displayDate: string
  label: string
  actor?: string
}

export interface GroundServiceLine {
  id: string
  serviceName: string
  selected: boolean
  prefilledAmount: number
  actualAmount: number
  receiptFileName?: string
  remarks?: string
}

export interface OperationalExpense {
  id: string
  serviceName: string
  prefilledAmount: number
  actualAmount: number
  receiptFileName?: string
  remarks?: string
  isExtra?: boolean
}

export interface OperationalCase {
  id: string
  /** Display operational reference: `<Application ID>-<Passenger Sequence>` */
  operationalId: string
  applicationId: string
  passengerSequence: number
  passengerName: string
  passengerRank: string
  passportNumber: string
  cdcNumber: string
  vesselName: string
  jurisdiction: string
  joiningDate: string
  nextAction: string
  /** Links to GLTS applicant id for expense and future module integration. */
  gltsApplicantId: string
  companyName: string
  country: string
  visaType: string
  applicantCount: number
  priority: OperationalCasePriority
  status: OperationalCaseStatus
  progressPercent: number
  assignedTeam: CityTeam | ''
  assignedExecutive: string
  lastUpdated: string
  /** Operational day the case is queued for (YYYY-MM-DD). */
  operationalDate: string
  carryForward: boolean
  movedToNextDayAt?: string
  markedForOperations: boolean
  delayed: boolean
  servicesSummary: string
  expenseSummary: string
  estimatedExpense: number
  actualExpense: number
  groundServices: GroundServiceLine[]
  expenses: OperationalExpense[]
  biometricsScheduled?: string
  vfsStatus?: string
  passportCollectionStatus?: string
  remarks: string
  attachmentNames: string[]
  timeline: OperationalTimelineEvent[]
  assignmentSourceId?: string
}

export interface TeamCapacity {
  team: CityTeam
  assigned: number
  capacity: number
}

export interface OperationalCaseListFilters {
  datePreset: OperationalDateFilterPreset
  customDateFrom?: string
  customDateTo?: string
  priority: string
  cityTeam: string
  country: string
  search: string
}

export interface OperationsDeskFilters {
  datePreset: OperationalDateFilterPreset
  customDateFrom?: string
  customDateTo?: string
  status: string
  team: string
  executive: string
  priority: string
  visaCountry: string
  jurisdiction: string
  applicationId: string
  joiningDateFrom: string
  joiningDateTo: string
  search: string
}

export const OPERATIONAL_CASE_PRIORITIES: OperationalCasePriority[] = [
  'Normal',
  'High',
  'Urgent',
  'Critical',
]

export const OPERATIONAL_CASE_STATUSES: OperationalCaseStatus[] = [
  'Pending',
  'Documents Verified',
  'In Operations',
  'Biometrics Pending',
  'VFS Scheduled',
  'VFS Pending',
  'VFS Completed',
  'Passport Collected',
  'Courier Pending',
  'Moved to Next Day',
  'Completed',
]

export const OPERATIONS_DESK_GROUP_BY_OPTIONS: { value: OperationsDeskGroupBy; label: string }[] = [
  { value: 'none', label: 'View All Records' },
  { value: 'application', label: 'Group By Application' },
  { value: 'executive', label: 'Group By Executive' },
  { value: 'status', label: 'Group By Status' },
]

export const CITY_TEAMS: CityTeam[] = ['Mumbai Team', 'Delhi Team', 'Chennai Team']

export const DEFAULT_GROUND_SERVICE_NAMES = [
  'Biometrics Coordination',
  'VFS Support',
  'Courier',
  'Local Travel',
  'Printing',
  'Airport Assistance',
  'Photo Making',
  'Other',
] as const

export type DefaultGroundServiceName = (typeof DEFAULT_GROUND_SERVICE_NAMES)[number]

/** Default prefilled amounts (INR) for catalog ground services. */
export const GROUND_SERVICE_DEFAULT_RATES: Record<DefaultGroundServiceName, number> = {
  'Biometrics Coordination': 2500,
  'VFS Support': 1800,
  Courier: 650,
  'Local Travel': 1200,
  Printing: 350,
  'Airport Assistance': 800,
  'Photo Making': 250,
  Other: 0,
}

export function formatOperationalId(applicationId: string, passengerSequence: number): string {
  return `${applicationId}-${String(passengerSequence).padStart(2, '0')}`
}

export function formatOperationalExpenseSummary(estimated: number, actual: number): string {
  const est = `₹${estimated.toLocaleString('en-IN')} Est.`
  const act = actual > 0 ? ` · ₹${actual.toLocaleString('en-IN')} Actual` : ''
  return `${est}${act}`
}
