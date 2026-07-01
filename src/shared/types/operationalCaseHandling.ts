import type { LogisticsDispatchDetails, LogisticsFinalQc } from '@/shared/types/logisticsDispatch'

export type OperationalCasePriority = 'Normal' | 'High' | 'Urgent' | 'Critical'

export type OperationalCaseStatus =
  | 'Pending'
  | 'Document Submitted'
  | 'Moved to Next Day'
  | 'Collected'
  | 'Dispatched'
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

export type ApplicationFeePaidBy = 'glts' | 'passenger'

export const APPLICATION_FEE_PAID_BY_OPTIONS: { value: ApplicationFeePaidBy; label: string }[] = [
  { value: 'glts', label: 'GLTS' },
  { value: 'passenger', label: 'Passenger' },
]

export function getApplicationFeePaidByLabel(value?: ApplicationFeePaidBy): string {
  return APPLICATION_FEE_PAID_BY_OPTIONS.find(option => option.value === value)?.label ?? '—'
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
  applicationFees: GroundServiceLine[]
  /** Who pays VFS & application fees for this case. */
  applicationFeesPaidBy?: ApplicationFeePaidBy
  expenses: OperationalExpense[]
  submissionDate?: string
  collectionDate?: string
  submissionReferenceNumber?: string
  biometricsScheduled?: string
  vfsStatus?: string
  passportCollectionStatus?: string
  remarks: string
  attachmentNames: string[]
  timeline: OperationalTimelineEvent[]
  assignmentSourceId?: string
  finalQc?: LogisticsFinalQc
  dispatchDetails?: LogisticsDispatchDetails
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
  'Document Submitted',
  'Moved to Next Day',
  'Collected',
  'Dispatched',
  'Completed',
]

/** Statuses where Submit / Move to next day actions are enabled on the Operations Desk. */
export const OPERATIONS_DESK_STATUSES: OperationalCaseStatus[] = ['Pending', 'Moved to Next Day']

/** Cases handed off to Tracking & Logistics after document submission. */
export const LOGISTICS_STATUSES: OperationalCaseStatus[] = [
  'Document Submitted',
  'Collected',
  'Dispatched',
  'Completed',
]

export function isOperationsDeskStatus(status: OperationalCaseStatus): boolean {
  return OPERATIONS_DESK_STATUSES.includes(status)
}

export function isLogisticsStatus(status: OperationalCaseStatus): boolean {
  return LOGISTICS_STATUSES.includes(status)
}

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
  'Cargo & Handling Charges',
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
  'Cargo & Handling Charges': 1500,
  'Photo Making': 250,
  Other: 0,
}

export const DEFAULT_APPLICATION_FEE_NAMES = [
  'VFS fees',
  'Visa fees',
  'Courier Service',
  'Courier Assurance',
  'SMS',
  'Premium Lounge',
  'Document uploading',
  'Priority',
  'Super Priority',
  'Courier',
  'Biometrics',
  'One way',
  'Two Way',
] as const

export type DefaultApplicationFeeName = (typeof DEFAULT_APPLICATION_FEE_NAMES)[number]

/** Default prefilled amounts (INR) for VFS and application fee add-ons. */
export const APPLICATION_FEE_DEFAULT_RATES: Record<DefaultApplicationFeeName, number> = {
  'VFS fees': 1200,
  'Visa fees': 8500,
  'Courier Service': 650,
  'Courier Assurance': 350,
  SMS: 150,
  'Premium Lounge': 2200,
  'Document uploading': 450,
  Priority: 1800,
  'Super Priority': 3200,
  Courier: 650,
  Biometrics: 2500,
  'One way': 900,
  'Two Way': 1400,
}

export function formatOperationalId(applicationId: string, passengerSequence: number): string {
  return `${applicationId}-${String(passengerSequence).padStart(2, '0')}`
}

export function formatOperationalExpenseSummary(estimated: number, actual: number): string {
  const est = `₹${estimated.toLocaleString('en-IN')} Est.`
  const act = actual > 0 ? ` · ₹${actual.toLocaleString('en-IN')} Actual` : ''
  return `${est}${act}`
}
