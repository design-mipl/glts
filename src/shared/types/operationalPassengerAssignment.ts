import type { ApplicationCustomerSegment, ApplicationOperationalStatus, ApplicationRecordType } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { InvoiceStatus, PaymentStatus } from '@/shared/types/invoice'
import type { CityTeam } from '@/shared/types/operationalCaseHandling'

export type AssignmentPriority = 'Urgent' | 'High' | 'Medium' | 'Low'

export type PassengerOperationalStatus =
  | 'Pending Assignment'
  | 'Assigned'
  | 'In Progress'
  | 'Carry Forward'
  | 'Completed'

export type ApplicationRollupStatus =
  | 'Pending'
  | 'In Progress'
  | 'Partially Completed'
  | 'Completed'
  | 'Escalated'

export type AssignmentListingTab =
  | 'all'
  | 'pending_assignment'
  | 'assigned'
  | 'in_progress'
  | 'carry_forward'
  | 'completed'

export type OperationalDateFilterPreset =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'this_week'
  | 'custom'

export interface AssignmentTimelineEvent {
  id: string
  occurredAt: string
  displayDate: string
  label: string
  actor?: string
}

export interface AssignmentHistoryEntry {
  id: string
  occurredAt: string
  assignedTeam: CityTeam | ''
  assignedUser: string
  assignedBy: string
  notes?: string
}

export interface OperationalPassengerOverlay {
  priority: AssignmentPriority
  assignedTeam: CityTeam | ''
  assignedUser: string
  operationalDate: string
  passengerStatus: PassengerOperationalStatus
  carryForward: boolean
  escalated: boolean
  slaDueAt: string
  operationalRemarks: string
  assignmentHistory: AssignmentHistoryEntry[]
  timeline: AssignmentTimelineEvent[]
  attachmentNames: string[]
  lastUpdated: string
}

export interface OperationalPassengerRow {
  id: string
  gltsApplicantId: string
  gltsApplicationId: string
  sequenceNo: number
  passengerName: string
  passportNo: string
  companyName: string
  bookerName: string
  country: string
  countryFlag?: string
  visaType: string
  jurisdiction: string
  travelDate: string
  submissionDate: string
  submissionStatus: ApplicationOperationalStatus
  customerSegment: ApplicationCustomerSegment
  recordType: ApplicationRecordType
  invoiceStatus: InvoiceStatus | ''
  paymentStatus: PaymentStatus | ''
  priority: AssignmentPriority
  assignedTeam: CityTeam | ''
  assignedUser: string
  operationalDate: string
  passengerStatus: PassengerOperationalStatus
  carryForward: boolean
  escalated: boolean
  slaDueAt: string
  operationalRemarks: string
  assignmentHistory: AssignmentHistoryEntry[]
  timeline: AssignmentTimelineEvent[]
  attachmentNames: string[]
  lastUpdated: string
  createdByEmail: string
  createdByRole: string
  processingStage: string
  processingStageDates?: import('@/shared/types/applicationProcessingTimeline').ApplicationProcessingStageDates
}

export type AssignmentSlaFilter = '' | 'at_risk' | 'due_today' | 'on_track'

export interface AssignmentQueueFilters {
  datePreset: OperationalDateFilterPreset
  customDateFrom?: string
  customDateTo?: string
  jurisdiction: string
  team: string
  assignedUser: string
  priority: string
  country: string
  visaType: string
  status: string
  sla: string
  search: string
}

export const ASSIGNMENT_PRIORITIES: AssignmentPriority[] = ['Urgent', 'High', 'Medium', 'Low']

export const PASSENGER_OPERATIONAL_STATUSES: PassengerOperationalStatus[] = [
  'Pending Assignment',
  'Assigned',
  'In Progress',
  'Carry Forward',
  'Completed',
]

export const ASSIGNMENT_CITY_TEAMS: CityTeam[] = ['Mumbai Team', 'Delhi Team', 'Chennai Team']
