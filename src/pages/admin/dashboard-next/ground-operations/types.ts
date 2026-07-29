import type { DashboardKpiItem } from '../shared/types'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { PassportJourneyStageData } from '../shared/widgets/operations/PassportJourney'
import type {
  AppointmentScheduleRow,
  CourierTrackingData,
  DocumentMovementPoint,
  ExpenseSummaryData,
  RouteTimelineEvent,
  SettlementStatusRow,
  TodaysJobRow,
} from '../shared/widgets/ground/GroundWidgets'

export interface GroundOperationsDashboardFilters {
  date: string
  branch: string
  city: string
  executive: string
  assignmentStatus: string
  appointmentStatus: string
  priority: string
  search: string
}

export interface GroundAppointmentTableRow {
  id: string
  applicationNumber: string
  applicant: string
  appointmentTime: string
  location: string
  assignedExecutive: string
  status: string
  priority: string
}

export interface GroundPassportMovementRow {
  id: string
  applicationNumber: string
  applicant: string
  currentLocation: string
  courier: string
  trackingNumber: string
  eta: string
  status: string
}

export interface GroundFundCaseRow {
  id: string
  caseRef: string
  allocatedAmount: string
  expensesIncurred: string
  availableBalance: string
  settlementAmount: string
  status: string
}

export interface GroundPassportJourneyData {
  stages: PassportJourneyStageData[]
  journeyStatus: string
  eta?: string
  trackingNumber?: string
  courier?: string
}

export interface GroundQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  href: string
}

export interface GroundOperationsDashboardData {
  executiveName: string
  quickStats: DashboardKpiItem[]
  notifications: NotificationItem[]
  todaysJobs: TodaysJobRow[]
  routeTimeline: RouteTimelineEvent[]
  appointmentSchedule: AppointmentScheduleRow[]
  courierTracking: CourierTrackingData
  quickActions: GroundQuickActionDefinition[]
  recentActivity: RecentActivityItem[]
  appointmentRows: GroundAppointmentTableRow[]
  passportJourney: GroundPassportJourneyData
  passportCourier: CourierTrackingData
  documentMovement: DocumentMovementPoint[]
  passportRows: GroundPassportMovementRow[]
  expenseSummary: ExpenseSummaryData
  settlementRows: SettlementStatusRow[]
  fundCaseRows: GroundFundCaseRow[]
  activityFeed: RecentActivityItem[]
  activityNotifications: NotificationItem[]
  activityRoute: RouteTimelineEvent[]
  activityDocuments: DocumentMovementPoint[]
}

export interface GroundOperationsDashboardTabProps {
  data: GroundOperationsDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenJob?: (jobId: string) => void
  onOpenAppointment?: (rowId: string) => void
  onOpenPassport?: (rowId: string) => void
  onOpenFundCase?: (rowId: string) => void
}
