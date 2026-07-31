import type {
  DashboardAlertItem,
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { AnnouncementItem } from '../shared/widgets/common/Announcements'
import type { RecentReportItem } from '../shared/widgets/common/RecentReports'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { OperationsHealthMetrics } from '../shared/widgets/operations/OperationsHealth'
import type { ApplicationPipelineStageData } from '../shared/widgets/operations/ApplicationPipeline'
import type { PendingVerificationRow } from '../shared/widgets/operations/PendingVerification'
import type { PassportJourneyStageData } from '../shared/widgets/operations/PassportJourney'
import type { MarineTimelineRow } from '../shared/widgets/operations/MarineTimeline'
import type { TeamCapacityRow } from '../shared/widgets/operations/TeamCapacity'
import type { TeamProductivityByChannel } from '../shared/widgets/operations/TeamProductivityInfographic'
import type { RevenueSnapshotData } from '../shared/widgets/finance/RevenueSnapshot'
import type {
  DistributionSlice,
  NamedMetricPoint,
  TrendPoint,
} from '../shared/widgets/analytics/AnalyticsWidgets'
import type { ExecutiveAttentionAlert } from '@/pages/admin/dashboard/components'
import type { DashboardIntelligenceFilters } from '../shared/dashboard-intelligence'

/** Admin dashboard filters — same contract as page global intelligence filters. */
export type AdminDashboardNextFilters = DashboardIntelligenceFilters

export interface AdminQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  /** Existing admin route — no placeholder navigation. */
  href: string
}

export interface AdminPassportJourneyData {
  stages: PassportJourneyStageData[]
  journeyStatus: string
  eta?: string
  trackingNumber?: string
  courier?: string
}

/** Full payload for Admin Dashboard Next — swap mock service for API later. */
export interface AdminDashboardNextData {
  quickStats: DashboardKpiItem[]
  metricComparison: MetricComparisonItem[]
  operationsHealth: OperationsHealthMetrics
  notifications: NotificationItem[]
  attentionAlerts: ExecutiveAttentionAlert[]
  pipelineStages: ApplicationPipelineStageData[]
  pendingVerification: PendingVerificationRow[]
  passportJourney: AdminPassportJourneyData
  recentActivity: RecentActivityItem[]
  quickActions: AdminQuickActionDefinition[]
  teamCapacity: TeamCapacityRow[]
  teamProductivity: TeamProductivityByChannel
  marineTimeline: MarineTimelineRow[]
  processingTrend: TrendPoint[]
  announcements: AnnouncementItem[]
  revenueSnapshot: RevenueSnapshotData
  branchPerformance: NamedMetricPoint[]
  countryDistribution: DistributionSlice[]
  visaDistribution: DistributionSlice[]
  businessSegments: DistributionSlice[]
  riskAlerts: DashboardAlertItem[]
  slaOverview: DashboardProgressItem[]
  recentReports: RecentReportItem[]
}

export interface AdminDashboardTabProps {
  data: AdminDashboardNextData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onPipelineStageClick?: (stageId: string) => void
  onVerificationOpen?: (rowId: string) => void
  onViewVerificationQueue?: () => void
}
