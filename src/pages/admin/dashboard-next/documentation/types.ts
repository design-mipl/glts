import type {
  DashboardAlertItem,
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { ApplicationPipelineStageData } from '../shared/widgets/operations/ApplicationPipeline'
import type { PendingVerificationRow } from '../shared/widgets/operations/PendingVerification'

export type DocApplicationChannel = 'retail' | 'corporate' | 'marine'
export type DocSlaStatus = 'on_track' | 'at_risk' | 'breached'
export type DocPriority = 'high' | 'medium' | 'low'
export type DocAlertPriority = 'critical' | 'high' | 'medium'

export interface DocumentationDashboardFilters {
  date: string
  country: string
  applicationType: string
  search: string
}

export interface DocumentationApplicationRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  country: string
  visaType: string
  currentStage: string
  nextAction: string
  waitingOn: string
  priority: DocPriority
  slaStatus: DocSlaStatus
  slaTimer: string
  dueDate: string
  dueDateSort: number
  channel: DocApplicationChannel
  executive: string
  applicationHref: string
}

export interface FormToFillRow {
  id: string
  applicant: string
  country: string
  visaType: string
  formStatus: string
  dueTime: string
  executive: string
  channel: DocApplicationChannel
}

export interface FeeToPayRow {
  id: string
  applicant: string
  country: string
  embassyVfs: string
  feeAmount: string
  paymentStatus: string
  dueTime: string
  executive: string
}

export interface AppointmentToBookRow {
  id: string
  applicant: string
  country: string
  visaType: string
  appointmentType: string
  preferredDate: string
  status: string
  executive: string
}

export interface DocReviewQcRow {
  id: string
  applicationId: string
  applicant: string
  country: string
  submittedBy: string
  currentStage: string
  slaTimer: string
  slaStatus: DocSlaStatus
  executive: string
}

export interface DocCorrectionRequestRow {
  id: string
  applicationId: string
  applicant: string
  raisedBy: string
  reason: string
  waitingSince: string
  waitingDays: number
  assignedTo: string
  status: string
  isOverdue: boolean
  executive: string
}

export interface ReadyForSubmissionRow {
  id: string
  applicant: string
  country: string
  visaType: string
  submissionReadiness: string
  documentsVerified: string
  executive: string
}

export interface SubmissionPendingRow {
  id: string
  applicant: string
  country: string
  embassy: string
  submissionDate: string
  submissionStatus: string
  assignedExecutive: string
  executive: string
}

export interface DocumentationCriticalAlert {
  id: string
  title: string
  count: number
  oldestWaiting: string
  priority: DocAlertPriority
}

export interface DocumentationActivityRow {
  id: string
  timestamp: string
  action: string
  application: string
  result: string
  executive: string
  recordedAt: Date
}

export interface DocumentationPerformanceMetric {
  id: string
  label: string
  value: string
  subtitle: string
  accent: 'primary' | 'success' | 'info'
}

export interface DocumentationQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  href: string
}

/** Executive-scoped payload for Documentation Dashboard Next. */
export interface DocumentationDashboardData {
  executiveName: string
  quickStats: DashboardKpiItem[]
  notifications: NotificationItem[]
  criticalAlerts: DashboardAlertItem[]
  pipelineStages: ApplicationPipelineStageData[]
  pendingVerification: PendingVerificationRow[]
  quickActions: DocumentationQuickActionDefinition[]
  myApplications: DocumentationApplicationRow[]
  formsToFill: FormToFillRow[]
  feesToPay: FeeToPayRow[]
  appointmentsToBook: AppointmentToBookRow[]
  reviewQcQueue: DocReviewQcRow[]
  correctionRequests: DocCorrectionRequestRow[]
  readyForSubmission: ReadyForSubmissionRow[]
  submissionPending: SubmissionPendingRow[]
  recentActivity: RecentActivityItem[]
  activityRows: DocumentationActivityRow[]
  performanceMetrics: DocumentationPerformanceMetric[]
  metricComparison: MetricComparisonItem[]
  personalSla: DashboardProgressItem[]
  showInactivityWarning: boolean
  minutesSinceLastActivity: number | null
}

export interface DocumentationDashboardTabProps {
  data: DocumentationDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenApplication?: (row: DocumentationApplicationRow) => void
  onOpenTab?: (tabId: string) => void
}
