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
import type {
  ExecutiveInsight,
  ExecutiveRecommendation,
  ManagementAlertRecord,
  PredictivePanelModel,
} from '../shared/dashboard-intelligence'

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

/** Ranked insight row for executive lists (page composition). */
export interface SuperAdminRankItem {
  id: string
  primary: string
  secondary?: string
  value?: string | number
  progress?: number
  tone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'info'
}

export interface SuperAdminSegmentCard {
  id: 'marine' | 'corporate' | 'retail' | 'b2b'
  label: string
  status: 'live' | 'placeholder'
  revenue: string
  cost: string
  grossMarginPercent: string
  applications: string
  approvalPercent: string
  avgTat: string
  outstanding: string
  activeClients: string
  pipelineValue: string
  growthLabel: string
  insight: string
  /** Retail-only extras (optional). */
  repeatBusinessPercent?: string
  winRate?: string
}

export interface SuperAdminSalesPlaceholder {
  pipelineValue: string
  winRate: string
  avgDeal: string
  conversion: string
  notes: string[]
}

export interface SuperAdminRevenuePeriod {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  /** Optional target comparison (e.g. "92% of target"). */
  targetLabel?: string
}

export interface SuperAdminRevenueHero {
  today: SuperAdminRevenuePeriod
  mtd: SuperAdminRevenuePeriod
  ytd: SuperAdminRevenuePeriod
}

export interface SuperAdminBlockedCash {
  amount: string
  applicationCount: number
  expectedReleaseLabel: string
  note: string
}

export interface SuperAdminOperationsToday {
  receivedToday: number
  submittedToday: number
  collectedToday: number
  rejectedToday: number
  pendingEmbassy: number
  pendingClientDocuments: number
  slaBreaches: number
}

export interface SuperAdminCashPosition {
  bankBalance: string
  blockedInVisaFees: string
  expectedCollections: string
  availableFunds: string
}

export interface SuperAdminVerticalPreview {
  kpis: MetricComparisonItem[]
  byEntity: SuperAdminRankItem[]
  byCountry: SuperAdminRankItem[]
  pending: SuperAdminRankItem[]
  topClients: SuperAdminRankItem[]
  notes: string[]
}

export interface SuperAdminDashboardData {
  /** Combined Today / MTD / YTD revenue card. */
  revenueHero: SuperAdminRevenueHero
  /** Remaining hero KPIs (health, GP, outstanding, collections, apps, approval, at-risk). */
  heroKpis: DashboardKpiItem[]
  blockedCash: SuperAdminBlockedCash
  approvalRateTrend30d: TrendPoint[]
  operationsToday: SuperAdminOperationsToday
  processingTimeByCountry: NamedMetricPoint[]
  cashPosition: SuperAdminCashPosition
  marginByVertical: SuperAdminRankItem[]
  quickStats: DashboardKpiItem[]
  metricComparison: MetricComparisonItem[]
  revenueSnapshot: RevenueSnapshotData
  revenueTrend: TrendPoint[]
  operationsHealth: OperationsHealthMetrics
  branchPerformance: NamedMetricPoint[]
  businessSegments: DistributionSlice[]
  segmentCards: SuperAdminSegmentCard[]
  notifications: NotificationItem[]
  quickActions: SuperAdminQuickActionDefinition[]
  pipelineStages: ApplicationPipelineStageData[]
  teamCapacity: TeamCapacityRow[]
  marineTimeline: MarineTimelineRow[]
  passportJourney: SuperAdminPassportJourneyData
  marineByCompany: SuperAdminRankItem[]
  marineByCountry: SuperAdminRankItem[]
  pendingCrewVisas: SuperAdminRankItem[]
  topMarineClients: SuperAdminRankItem[]
  corporatePreview: SuperAdminVerticalPreview
  retailPreview: SuperAdminVerticalPreview
  b2bPreview: SuperAdminVerticalPreview
  recentActivity: RecentActivityItem[]
  riskAlerts: DashboardAlertItem[]
  managementAlerts: DashboardAlertItem[]
  collectionSummary: CollectionSummaryData
  ageingBuckets: AgeingBucketValue[]
  financeMetricComparison: MetricComparisonItem[]
  processingTrend: TrendPoint[]
  financeNotifications: NotificationItem[]
  countryDistribution: DistributionSlice[]
  clientRows: SuperAdminClientRow[]
  topRevenueClients: SuperAdminRankItem[]
  fastestGrowingClients: SuperAdminRankItem[]
  clientHealth: SuperAdminRankItem[]
  dormantClients: SuperAdminRankItem[]
  highMarginClients: SuperAdminRankItem[]
  lowMarginClients: SuperAdminRankItem[]
  highRiskClients: SuperAdminRankItem[]
  clientActivity: RecentActivityItem[]
  visaDistribution: DistributionSlice[]
  slaOverview: DashboardProgressItem[]
  staffLeaderboard: SuperAdminRankItem[]
  staffProductivity: DashboardProgressItem[]
  salesPlaceholder: SuperAdminSalesPlaceholder
  marineMetrics: MetricComparisonItem[]
  recentReports: RecentReportItem[]
  reportNotifications: NotificationItem[]
}

export interface SuperAdminExecutiveStoryProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenClient?: (clientId: string) => void
  onPipelineStageClick?: (stageId: string) => void
  /** Optional intelligence overlays — does not change section order. */
  insights?: ExecutiveInsight[]
  recommendations?: ExecutiveRecommendation[]
  managementAlerts?: ManagementAlertRecord[]
  forecasts?: PredictivePanelModel[]
}

/** Tab props shared by Super Admin workspace tabs (and legacy ExecutiveStory). */
export type SuperAdminDashboardTabProps = SuperAdminExecutiveStoryProps
