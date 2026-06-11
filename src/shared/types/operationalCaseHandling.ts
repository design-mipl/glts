export type OperationalCasePriority = 'Normal' | 'High' | 'Urgent' | 'Critical'

export type OperationalCaseStatus =
  | 'Pending'
  | 'In Operations'
  | 'Biometrics Pending'
  | 'VFS Completed'
  | 'Passport Collected'
  | 'Moved to Next Day'
  | 'Completed'

export type CityTeam = 'Mumbai Team' | 'Delhi Team' | 'Chennai Team'

export type OperationalDateFilterPreset =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'this_week'
  | 'custom'

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
  applicationId: string
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
  'In Operations',
  'Biometrics Pending',
  'VFS Completed',
  'Passport Collected',
  'Moved to Next Day',
  'Completed',
]

export const CITY_TEAMS: CityTeam[] = ['Mumbai Team', 'Delhi Team', 'Chennai Team']

export const DEFAULT_GROUND_SERVICE_NAMES = [
  'Biometrics Coordination',
  'VFS Support',
  'Courier',
  'Local Travel',
  'Printing',
] as const
