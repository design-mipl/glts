import type {
  DashboardAlertItem,
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { RecentReportItem } from '../shared/widgets/common/RecentReports'
import type { OperationsHealthMetrics } from '../shared/widgets/operations/OperationsHealth'
import type { ApplicationPipelineStageData } from '../shared/widgets/operations/ApplicationPipeline'
import type { PassportJourneyStageData } from '../shared/widgets/operations/PassportJourney'
import type { MarineTimelineRow } from '../shared/widgets/operations/MarineTimeline'
import type { TeamCapacityRow } from '../shared/widgets/operations/TeamCapacity'
import type { RevenueSnapshotData } from '../shared/widgets/finance/RevenueSnapshot'
import type { CollectionSummaryData } from '../shared/widgets/finance/CollectionSummary'
import type { AgeingBucketValue } from '../shared/widgets/finance/AgeingAnalysis'
import type {
  DistributionSlice,
  NamedMetricPoint,
  TrendPoint,
} from '../shared/widgets/analytics/AnalyticsWidgets'

export interface SuperAdminDashboardFilters {
  date: string
  branch: string
  country: string
  segment: string
  client: string
  visaType: string
  applicationStatus: string
  search: string
}

export interface SuperAdminClientRow {
  id: string
  client: string
  segment: string
  applications: number
  revenue: string
  collections: string
  outstanding: string
  status: string
}

export interface SuperAdminPassportJourneyData {
  stages: PassportJourneyStageData[]
  journeyStatus: string
  eta?: string
  trackingNumber?: string
  courier?: string
}

export interface SuperAdminQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  href: string
}

export interface SuperAdminDashboardData {
  quickStats: DashboardKpiItem[]
  metricComparison: MetricComparisonItem[]
  revenueSnapshot: RevenueSnapshotData
  operationsHealth: OperationsHealthMetrics
  branchPerformance: NamedMetricPoint[]
  businessSegments: DistributionSlice[]
  notifications: NotificationItem[]
  quickActions: SuperAdminQuickActionDefinition[]
  pipelineStages: ApplicationPipelineStageData[]
  teamCapacity: TeamCapacityRow[]
  marineTimeline: MarineTimelineRow[]
  passportJourney: SuperAdminPassportJourneyData
  recentActivity: RecentActivityItem[]
  riskAlerts: DashboardAlertItem[]
  collectionSummary: CollectionSummaryData
  ageingBuckets: AgeingBucketValue[]
  financeMetricComparison: MetricComparisonItem[]
  processingTrend: TrendPoint[]
  financeNotifications: NotificationItem[]
  countryDistribution: DistributionSlice[]
  clientRows: SuperAdminClientRow[]
  clientActivity: RecentActivityItem[]
  visaDistribution: DistributionSlice[]
  slaOverview: DashboardProgressItem[]
  recentReports: RecentReportItem[]
  reportNotifications: NotificationItem[]
}

export interface SuperAdminDashboardTabProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenClient?: (clientId: string) => void
  onPipelineStageClick?: (stageId: string) => void
}
