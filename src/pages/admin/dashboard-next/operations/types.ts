import type {
  DashboardAlertSeverity,
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { AnnouncementItem } from '../shared/widgets/common/Announcements'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { ApplicationPipelineStageData } from '../shared/widgets/operations/ApplicationPipeline'
import type { TrendPoint } from '../shared/widgets/analytics/AnalyticsWidgets'
import type { TeamCapacityRow } from '../shared/widgets/operations/TeamCapacity'
import type { OpsSegmentKey } from './utils/opsSegmentPaths'

export type { OpsSegmentKey }

export interface OperationsDashboardFilters {
  date: string
  country: string
  visaType: string
  status: string
  priority: string
  segment: string
  search: string
}

export type OpsWorkQueueKind =
  | 'verification'
  | 'recheck'
  | 'payment'
  | 'glts_arrange'
  | 'submission'
  | 'collection'
  | 'physical_originals'
  | 'correction_watch'
  | 'assignment'

export type OpsAssigneeKind = 'user' | 'vendor' | 'passenger' | 'unassigned'

export type OpsAlertType =
  | 'verification_sla'
  | 'recheck_ready'
  | 'correction_waiting'
  | 'pending_payment'
  | 'glts_ticket_needed'
  | 'glts_insurance_needed'
  | 'physical_originals_pending'
  | 'assignment_unassigned'
  | 'ground_handoff'

export interface OperationsWorkRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  segment: OpsSegmentKey
  country: string
  visaType: string
  queue: OpsWorkQueueKind
  queueLabel: string
  priority: string
  waitingTime: string
  status: string
  assigneeKind: OpsAssigneeKind
  assigneeLabel: string
  showGroundBadge: boolean
  serviceType?: 'ticket' | 'insurance'
  applicationHref: string
  passengerId?: string
}

export interface OperationsAlertRow {
  id: string
  title: string
  description: string
  severity: DashboardAlertSeverity
  type: OpsAlertType
  href: string
  count?: number
}

export interface OpsChartSlice {
  key: string
  label: string
  value: number
  color: string
}

export interface OpsSegmentWorkloadPoint {
  segment: string
  verification: number
  payment: number
  arrange: number
  submission: number
}

export interface OpsAgeingPoint {
  bucket: string
  count: number
}

export interface OperationsQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  href: string
}

export interface OperationsReportCard {
  id: string
  name: string
  category: string
  lastGenerated: string
}

/** Consultant-scoped payload for Operations Dashboard Next. */
export interface OperationsDashboardData {
  consultantName: string
  myQuickStats: DashboardKpiItem[]
  alerts: OperationsAlertRow[]
  notifications: NotificationItem[]
  myPipelineStages: ApplicationPipelineStageData[]
  quickActions: OperationsQuickActionDefinition[]
  /** Personal desk rows (legacy) — Work tab filters queueRows for desk work. */
  myWorkRows: OperationsWorkRow[]
  /** Full ops backlog; Work tab shows personal desk only. Team views live on admin dashboards. */
  queueRows: OperationsWorkRow[]
  /** Assignment desk snapshot. */
  assignmentRows: OperationsWorkRow[]
  queueMix: OpsChartSlice[]
  workloadBySegment: OpsSegmentWorkloadPoint[]
  ageingBuckets: OpsAgeingPoint[]
  assigneeMix: OpsChartSlice[]
  myRecentActivity: RecentActivityItem[]
  announcements: AnnouncementItem[]
  processingTrend: TrendPoint[]
  metricComparison: MetricComparisonItem[]
  teamCapacity: TeamCapacityRow[]
  personalSla: DashboardProgressItem[]
  reports: OperationsReportCard[]
}

export interface OperationsDashboardTabProps {
  data: OperationsDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onPipelineStageClick?: (stageId: string) => void
  onOpenApplication?: (href: string) => void
  onOpenTab?: (tabId: string) => void
}
