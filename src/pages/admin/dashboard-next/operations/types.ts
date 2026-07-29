import type {
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { AnnouncementItem } from '../shared/widgets/common/Announcements'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { ApplicationPipelineStageData } from '../shared/widgets/operations/ApplicationPipeline'
import type { PendingVerificationRow } from '../shared/widgets/operations/PendingVerification'
import type { PassportJourneyStageData } from '../shared/widgets/operations/PassportJourney'
import type { MarineTimelineRow } from '../shared/widgets/operations/MarineTimeline'
import type { TeamCapacityRow } from '../shared/widgets/operations/TeamCapacity'
import type { TrendPoint } from '../shared/widgets/analytics/AnalyticsWidgets'
import type { TodaysJobRow } from '../shared/widgets/ground/GroundWidgets'
import type { DocumentMovementPoint } from '../shared/widgets/ground/GroundWidgets'

export interface OperationsDashboardFilters {
  date: string
  country: string
  visaType: string
  status: string
  priority: string
  segment: string
  search: string
}

export type OperationsQueueKind =
  | 'pending-qc'
  | 'correction'
  | 'appointment'
  | 'submission'
  | 'blocked'

export interface OperationsQueueRow {
  id: string
  glNumber: string
  applicant: string
  queue: OperationsQueueKind
  queueLabel: string
  priority: string
  waitingTime: string
  status: string
}

export interface OperationsPassportJourneyData {
  stages: PassportJourneyStageData[]
  journeyStatus: string
  eta?: string
  trackingNumber?: string
  courier?: string
}

export interface OperationsQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  href: string
}

/** Carry-forward — consultant application listing. */
export interface OperationsApplicationRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  country: string
  visaType: string
  currentStage: string
  nextActionRequired: string
  waitingOn: string
  priority: string
  slaStatus: string
  slaTimer: string
  dueDate: string
  channel: string
  applicationHref: string
}

export interface OperationsCorrectionRow {
  id: string
  applicationId: string
  applicant: string
  raisedBy: string
  reason: string
  waitingSince: string
  assignedTo: string
  isOverdue: boolean
}

export interface OperationsAwaitingDocumentRow {
  id: string
  applicant: string
  outstandingDocuments: string
  lastReminderSent: string
  reminderCount: number
  daysWaiting: number
  country: string
  channel: string
}

export interface OperationsReviewQcRow {
  id: string
  applicationId: string
  applicant: string
  country: string
  submittedBy: string
  currentStage: string
  slaTimer: string
  slaStatus: string
}

export interface OperationsAppointmentSubmissionRow {
  id: string
  applicant: string
  appointmentDate: string
  country: string
  vfsLocation: string
  submissionStatus: string
  assignedExecutive: string
}

export interface OperationsMarinePriorityRow {
  id: string
  vesselName: string
  crewName: string
  joiningPort: string
  joiningDate: string
  daysRemaining: number
  visaStatus: string
  priority: string
}

export interface OperationsTodayTaskItem {
  id: string
  title: string
  taskCount: number
  dueTime: string
  priority: string
}

/** Consultant-scoped payload for Operations Dashboard Next. */
export interface OperationsDashboardData {
  consultantName: string
  myQuickStats: DashboardKpiItem[]
  notifications: NotificationItem[]
  myPendingVerification: PendingVerificationRow[]
  myPipelineStages: ApplicationPipelineStageData[]
  myPassportJourney: OperationsPassportJourneyData
  myMarineTimeline: MarineTimelineRow[]
  myRecentActivity: RecentActivityItem[]
  quickActions: OperationsQuickActionDefinition[]
  myApplications: OperationsApplicationRow[]
  todayTasks: OperationsTodayTaskItem[]
  correctionRequests: OperationsCorrectionRow[]
  awaitingDocuments: OperationsAwaitingDocumentRow[]
  reviewQcQueue: OperationsReviewQcRow[]
  appointmentSubmissionQueue: OperationsAppointmentSubmissionRow[]
  marinePriorityCases: OperationsMarinePriorityRow[]
  queueItems: OperationsQueueRow[]
  queuePendingVerification: PendingVerificationRow[]
  queuePipelineStages: ApplicationPipelineStageData[]
  queuePassportJourney: OperationsPassportJourneyData
  queueMarineTimeline: MarineTimelineRow[]
  queueRecentActivity: RecentActivityItem[]
  todaysJobs: TodaysJobRow[]
  todaysActivity: RecentActivityItem[]
  announcements: AnnouncementItem[]
  activityFeed: RecentActivityItem[]
  activityNotifications: NotificationItem[]
  activityPassportJourney: OperationsPassportJourneyData
  documentMovement: DocumentMovementPoint[]
  processingTrend: TrendPoint[]
  metricComparison: MetricComparisonItem[]
  teamCapacity: TeamCapacityRow[]
  personalSla: DashboardProgressItem[]
}

export interface OperationsDashboardTabProps {
  data: OperationsDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onPipelineStageClick?: (stageId: string) => void
  onVerificationOpen?: (rowId: string) => void
  onViewVerificationQueue?: () => void
  onQueueRowClick?: (rowId: string) => void
  onJobClick?: (jobId: string) => void
  onOpenApplication?: (href: string) => void
}
