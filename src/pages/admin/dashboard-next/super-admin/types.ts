import type {
  DashboardAlertItem,
  DashboardKpiItem,
  DashboardProgressItem,
  FinanceDashboardWorkspaceData,
  DashboardFinanceRiskCallouts,
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
import type { TeamProductivityByChannel } from '../shared/widgets/operations/TeamProductivityInfographic'
import type { OpsOrgQueueSnapshot } from '../shared/widgets/operations/opsOrgQueueTypes'
import type { ApplicationMarketRankingPoint } from '../shared/widgets/operations/ApplicationMarketInfographics'
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
import type { SuperAdminAnalyticsData } from './types/analyticsTypes'

export type {
  SuperAdminAnalyticsData,
  AnalyticsPeriodMonths,
  AnalyticsMetricHeadline,
  AnalyticsTrendChart,
  AnalyticsStackedChart,
  AnalyticsLeadSourceRow,
} from './types/analyticsTypes'

export interface SuperAdminDashboardFilters {
  date: string
  /** Jurisdiction Master id / slug (legacy filter key name). */
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
  /** Destination scope key (uae, schengen, uk, us) when row is country-specific. */
  destinationCountry?: string
}

/** Client margin intelligence — margin % and MTD revenue. */
export interface SuperAdminClientMarginItem {
  id: string
  client: string
  segment: string
  marginPercent: number
  revenueMtdL: number
  applicationsMtd?: number
  detail?: string
}

export interface SuperAdminSegmentCard {
  id: 'marine' | 'corporate' | 'retail' | 'b2b'
  label: string
  status: 'live' | 'placeholder'
  /** Gross revenue (invoice value) — display. */
  revenue: string
  /** Net revenue / GLTS earnings — display. */
  netRevenue: string
  cost: string
  grossMarginPercent: string
  applications: string
  approvalPercent: string
  avgTat: string
  outstanding: string
  collections: string
  activeClients: string
  pipelineValue: string
  growthLabel: string
  insight: string
  /** Numeric helpers for comparison charts (₹ Lakhs unless noted). */
  grossRevenueL: number
  netRevenueL: number
  collectionsL: number
  outstandingL: number
  activeApplications: number
  completedApplications: number
  pendingApplications: number
  approvalRate: number
  marginPercent: number
  growthPercent: number
  avgTatDays: number
  /** Retail-only extras (optional). */
  repeatBusinessPercent?: string
  winRate?: string
}

/** Monthly series keyed by segment for Business comparison trends. */
export interface SuperAdminSegmentTrendPoint {
  label: string
  marine: number
  corporate: number
  retail: number
  b2b: number
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

/** Today / MTD / YTD period bundle (revenue, collections, etc.). */
export interface SuperAdminPeriodHero {
  today: SuperAdminRevenuePeriod
  mtd: SuperAdminRevenuePeriod
  ytd: SuperAdminRevenuePeriod
}

/** @deprecated Prefer SuperAdminPeriodHero — same shape. */
export type SuperAdminRevenueHero = SuperAdminPeriodHero

export interface SuperAdminBlockedCash {
  amount: string
  applicationCount: number
  expectedReleaseLabel: string
  note: string
}

/** Segment counts for Active Applications KPI. */
export interface SuperAdminSegmentBreakdownItem {
  id: string
  label: string
  count: number
}

/** Row-2 / extended executive summary metrics beyond period heroes. */
export interface SuperAdminExecutiveSummary {
  netRevenue: {
    value: string
    marginPercent: string
    delta?: number
    deltaLabel?: string
  }
  outstanding: {
    amount: string
    overdueInvoiceCount: number
    delta?: number
    deltaLabel?: string
  }
  businessHealth: {
    score: number
    statusLabel: string
    delta?: number
    deltaLabel?: string
  }
  activeApplications: {
    total: number
    segments: SuperAdminSegmentBreakdownItem[]
  }
  approvalRate: {
    value: string
    delta?: number
    deltaLabel?: string
  }
  atRisk: {
    total: number
    critical: number
    warning: number
  }
  visaCount: {
    count: number
    target?: number
    delta?: number
    deltaLabel?: string
  }
  receivedToday: {
    count: number
    delta?: number
    deltaLabel?: string
  }
  submittedToday: {
    count: number
    delta?: number
    deltaLabel?: string
  }
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

/** Mock executive finance KPIs until Expense & Billing (IW) APIs are live. */
export interface SuperAdminFinanceKpis {
  ebitda: string
  ebitdaDelta?: number
  ebitdaDeltaLabel?: string
  dsoDays: number
  dsoDelta?: number
  dsoDeltaLabel?: string
  /** Gross profit after markup / courier / GST rules (from Finance when live). */
  grossProfit: string
  grossMarginPercent: string
  grossProfitDelta?: number
  /** Net revenue = GLTS profit (not invoiced gross). */
  netRevenue: string
  netRevenueDelta?: number
  collectionsToday: string
  collectionsMtd: string
  workingCapitalExposure: string
  creditExposure: string
}

/** Finance tab — five-card executive KPI strip. */
export type SuperAdminFinanceKpiStrip = import('../shared/types').DashboardFinanceKpiStrip

export interface SuperAdminSegmentCommercialKpis {
  revenue: SuperAdminPeriodHero
  grossMarginPercent: string
  grossMarginDelta?: number
  totalApplications: string | number
  totalApplicationsDelta?: number
  approvalPercent: string
  approvalDelta?: number
  outstanding: string
  outstandingDelta?: number
  collections: string
  collectionsDelta?: number
  activeClients: string | number
  activeClientsDelta?: number
  pipelineValue: string
  pipelineDelta?: number
  /**
   * Share of applications from returning customers (retail) or
   * from existing active accounts (marine / corporate / B2B).
   */
  repeatRatePercent: string
  repeatRateDelta?: number
  /** Numerator for supporting line (e.g. 142 of 410 apps). */
  repeatApplications?: number
  /** Denominator for supporting line (defaults to totalApplications). */
  repeatEligibleApplications?: number
}

/**
 * Client-acquisition funnel stage counts (cohort that reached each stage).
 * Drop-off / conversion are derived in `computeAcquisitionFunnel`.
 */
export interface SuperAdminAcquisitionFunnelStage {
  id: string
  label: string
  count: number
  /** Optional deep-link into customer-accounts listing. */
  href?: string
}

export interface SuperAdminAcquisitionFunnel {
  /** What “entry” means in the conversion formula (e.g. Leads created). */
  entryLabel: string
  /** What “success” means (e.g. Accounts activated / Quotes converted). */
  exitLabel: string
  /** Period caption shown with the headline rate (e.g. MTD). */
  periodLabel?: string
  stages: SuperAdminAcquisitionFunnelStage[]
}

/** Country / destination mix — volume, revenue, GP, and rejection for metric toggle. */
export interface SuperAdminDestinationMixItem {
  id: string
  label: string
  /** Filter key aligned with dashboard country filter (uae, schengen, uk, us). */
  countryKey?: string | null
  /** Application / case volume. */
  volume: number
  /** Gross revenue in ₹ lakhs. */
  revenueL: number
  /** Gross profit in ₹ lakhs (pie “margin” mode uses this, not margin %). */
  grossProfitL: number
  /** Gross margin % — tooltip / legend only (not used as pie size). */
  marginPct: number
  /** Embassy / VFS rejection rate (refusals ÷ decided). Used in Rejection bar mode. */
  rejectionPct: number
  /** Embassy / VFS approval rate (approved ÷ decided). */
  approvalPct: number
  rejectedCount: number
  decidedCount: number
  /** Net revenue in ₹ lakhs after rejection refunds and failed-case costs. */
  netRevenueL: number
  /** Approved / successfully completed applications (denominator — not total volume). */
  successfulApplications: number
  /** Net revenue ÷ successful applications, in ₹ (rupees). */
  netRevenuePerSuccessfulApp: number
}

export type SuperAdminDestinationMetric = 'volume' | 'revenue' | 'margin' | 'rejection'

export interface SuperAdminVerticalPreview {
  /** Segment commercial KPI strip (revenue period + margin / apps / AR). */
  commercialKpis: SuperAdminSegmentCommercialKpis
  /** Lead → quote → (agreement → account) acquisition funnel. */
  acquisitionFunnel: SuperAdminAcquisitionFunnel
  byEntity: SuperAdminRankItem[]
  /** Destination / country mix with volume · revenue · GP. */
  byDestination: SuperAdminDestinationMixItem[]
  pending: SuperAdminRankItem[]
  topClients: SuperAdminRankItem[]
  notes: string[]
}

export interface SuperAdminDashboardData {
  /** Combined Today / MTD / YTD revenue card. */
  revenueHero: SuperAdminRevenueHero
  /** Combined Today / MTD / YTD collections card. */
  collectionsHero: SuperAdminPeriodHero
  /** Remaining hero KPIs (health, GP, outstanding, apps, approval, at-risk) — reports compat. */
  heroKpis: DashboardKpiItem[]
  blockedCash: SuperAdminBlockedCash
  /** 12-card Executive Summary payload (financial + operational health). */
  executiveSummary: SuperAdminExecutiveSummary
  approvalRateTrend30d: TrendPoint[]
  operationsToday: SuperAdminOperationsToday
  /** Org queue mix · assignee · ageing · workload — Ops / Admin Operations infographics. */
  opsQueueSnapshot: OpsOrgQueueSnapshot
  /** Submissions grouped by VFS / consulate jurisdiction. */
  submissionByJurisdiction: ApplicationMarketRankingPoint[]
  processingTimeByCountry: NamedMetricPoint[]
  cashPosition: SuperAdminCashPosition
  /** Mock EBITDA / DSO / GP / credit exposure until Finance APIs. */
  financeKpis: SuperAdminFinanceKpis
  /** Finance tab KPI strip — available funds · net revenue · margin · overdue · DSO. */
  financeKpiStrip: SuperAdminFinanceKpiStrip
  /** Secondary finance risk callouts — credit exposure · SLA cash at risk. */
  financeRiskCallouts: DashboardFinanceRiskCallouts
  financeWorkspace: FinanceDashboardWorkspaceData
  marginByVertical: SuperAdminRankItem[]
  quickStats: DashboardKpiItem[]
  metricComparison: MetricComparisonItem[]
  revenueSnapshot: RevenueSnapshotData
  revenueTrend: TrendPoint[]
  operationsHealth: OperationsHealthMetrics
  branchPerformance: NamedMetricPoint[]
  businessSegments: DistributionSlice[]
  segmentCards: SuperAdminSegmentCard[]
  /** Business tab — monthly gross revenue by segment (₹L). */
  segmentRevenueTrend: SuperAdminSegmentTrendPoint[]
  /** Business tab — monthly applications by segment. */
  segmentApplicationTrend: SuperAdminSegmentTrendPoint[]
  notifications: NotificationItem[]
  quickActions: SuperAdminQuickActionDefinition[]
  pipelineStages: ApplicationPipelineStageData[]
  teamCapacity: TeamCapacityRow[]
  teamProductivity: TeamProductivityByChannel
  marineTimeline: MarineTimelineRow[]
  passportJourney: SuperAdminPassportJourneyData
  marineByCompany: SuperAdminRankItem[]
  /** Marine destination / country mix (volume · revenue · GP). */
  marineByDestination: SuperAdminDestinationMixItem[]
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
  highMarginClientIntelligence: SuperAdminClientMarginItem[]
  lowMarginClientIntelligence: SuperAdminClientMarginItem[]
  highRiskClients: SuperAdminRankItem[]
  clientActivity: RecentActivityItem[]
  visaDistribution: DistributionSlice[]
  slaOverview: DashboardProgressItem[]
  staffLeaderboard: SuperAdminRankItem[]
  staffProductivity: DashboardProgressItem[]
  salesPlaceholder: SuperAdminSalesPlaceholder
  marineCommercialKpis: SuperAdminSegmentCommercialKpis
  /** Marine Lead → Account acquisition funnel (customer-accounts). */
  marineAcquisitionFunnel: SuperAdminAcquisitionFunnel
  recentReports: RecentReportItem[]
  reportNotifications: NotificationItem[]
  /** Analytics tab — trend intelligence (revenue quality, retention, ops, sales). */
  analytics: SuperAdminAnalyticsData
}

export interface SuperAdminWorkRow {
  id: string
  primary: string
  secondary: string
  category: string
  status: string
  value: string
  priority: string
}

export interface SuperAdminExecutiveStoryProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenClient?: (clientId: string) => void
  onOpenTab?: (tabId: string) => void
  onPipelineStageClick?: (stageId: string) => void
  /** Optional intelligence overlays — does not change section order. */
  insights?: ExecutiveInsight[]
  recommendations?: ExecutiveRecommendation[]
  managementAlerts?: ManagementAlertRecord[]
  forecasts?: PredictivePanelModel[]
}

/** Tab props shared by Super Admin workspace tabs. */
export type SuperAdminDashboardTabProps = SuperAdminExecutiveStoryProps
