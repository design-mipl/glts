import type { ReactNode } from 'react'

/** Shared async status for dashboard hooks/services. */
export type DashboardQueryStatus = 'idle' | 'loading' | 'success' | 'error'

export interface DashboardQueryState<T> {
  status: DashboardQueryStatus
  data: T | null
  error: string | null
}

export interface DashboardFilterOption {
  label: string
  value: string
}

export interface DashboardFilterConfig {
  id: string
  label: string
  options: DashboardFilterOption[]
  value: string
  onChange: (value: string) => void
}

export interface DashboardKpiItem {
  id: string
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  icon?: ReactNode
  sparklineData?: number[]
}

export type DashboardAlertSeverity = 'critical' | 'warning' | 'info' | 'success'

export interface DashboardAlertItem {
  id: string
  title: string
  description?: string
  severity: DashboardAlertSeverity
  count?: number
  onClick?: () => void
}

export interface DashboardQuickActionItem {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  badge?: string
  onClick?: () => void
  disabled?: boolean
}

export interface DashboardTabDefinition {
  id: string
  label: string
  content: ReactNode
  hidden?: boolean
  disabled?: boolean
  icon?: ReactNode
  /** Optional count badge shown in the tab label. */
  badge?: string | number
}

export type DashboardStatusTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

export interface DashboardProgressItem {
  id: string
  label: string
  value: number
  helperText?: string
}

/** Row shape for cross-surface segment commercial comparison tables. */
export interface DashboardSegmentComparisonRow {
  id: string
  label: string
  revenue: string
  netRevenue: string
  grossMarginPercent: string
  activeApplications: number
  approvalPercent: string
  growthLabel: string
  growthPercent: number
  /** Numeric helpers for revenue / collections charts (₹ Lakhs). */
  grossRevenueL: number
  netRevenueL: number
  collectionsL: number
  outstandingL: number
  marginPercent: number
}

/** Monthly series keyed by segment for revenue / application trend charts. */
export interface DashboardSegmentTrendPoint {
  label: string
  marine: number
  corporate: number
  retail: number
  b2b: number
}

export type FinanceFloorStatus = 'comfortable' | 'approaching' | 'critical'

/** Top-five executive finance KPIs — health at a glance. */
export interface DashboardFinanceKpiStrip {
  availableFunds: string
  availableFundsFloor: string
  availableFundsStatus: FinanceFloorStatus
  availableFundsStatusLabel: string
  netRevenueMtd: string
  netRevenueTarget: string
  netRevenueTargetPercent: number
  netRevenuePriorMonth: string
  netRevenueGrowthPercent: number
  netRevenueGrowthAmount: string
  grossMarginPercent: number
  grossMarginPriorPercent: number
  grossMarginDeltaPp: number
  overdueAmount: string
  overdueInvoiceCount: number
  dsoDays: number
  dsoPriorDays: number
  dsoDeltaDays: number
}

/** Secondary risk callouts below the top KPI strip. */
export interface DashboardFinanceRiskCallouts {
  creditExposure: string
  creditExposureTop5: string
  slaCashAtRisk: string
  slaCashAtRiskCases: number
}

export interface BlockedCashCountryRow {
  country: string
  amountL: number
}

export interface BlockedCashDetail {
  amount: string
  amountL: number
  applicationCount: number
  expectedReleaseDays: number
  expectedReleaseLabel: string
  expectedReleaseFrom: string
  expectedReleaseTo: string
  note: string
  byCountry: BlockedCashCountryRow[]
}

export interface CashWaterfallStep {
  id: string
  label: string
  amountL: number
  type: 'opening' | 'inflow' | 'outflow' | 'closing'
}

export interface PlMetricBlock {
  id: string
  label: string
  actual: string
  target: string
  achievementPercent: number
  priorMonth: string
  priorMonthDelta: number
}

export interface ArAgeingClientRow {
  name: string
  amountL: number
}

export interface ArAgeingBucketDetail {
  id: string
  label: string
  amountL: number
  clients: ArAgeingClientRow[]
}

export interface CreditExposureClientRow {
  id: string
  name: string
  amountL: number
}

export interface VerticalMarginRow {
  id: string
  label: string
  marginPercent: number
  /** Change vs prior month (percentage points). */
  trendDelta: number
  /** Gross margin % for each of the last six months (oldest → newest). */
  marginTrend6M: number[]
  /** Optional month labels aligned to marginTrend6M. */
  monthLabels?: string[]
}

export interface RegisteredAgentCountryRow {
  country: string
  agentCount: number
}

export interface FinanceForecastPeriod {
  horizonDays: 30 | 60 | 90
  horizonLabel: string
  forecastL: number
  targetL: number
  achievementPercent: number
  downsideRisks: string[]
}

/** Finance workspace rows — cash waterfall · P&L · AR · credit · verticals · forecast. */
export interface FinanceDashboardWorkspaceData {
  cashWaterfall: CashWaterfallStep[]
  availableFunds: {
    amount: string
    floor: string
    status: FinanceFloorStatus
    statusLabel: string
  }
  blockedCash: BlockedCashDetail
  plMetrics: PlMetricBlock[]
  arAgeingDetail: ArAgeingBucketDetail[]
  creditExposureClients: CreditExposureClientRow[]
  verticalMargins: VerticalMarginRow[]
  registeredAgentCountries: RegisteredAgentCountryRow[]
  forwardOutlook: FinanceForecastPeriod[]
}

/** Combined management finance dashboard payload. */
export interface ManagementFinanceDashboardData {
  kpiStrip: DashboardFinanceKpiStrip
  riskCallouts: DashboardFinanceRiskCallouts
  workspace: FinanceDashboardWorkspaceData
}

/** Client portfolio row for segment mix and margin intelligence. */
export interface DashboardClientRow {
  id: string
  client: string
  segment: string
  applications: number
  revenue: string
  collections: string
  outstanding: string
  status: string
}

/** Ranked insight row for executive client charts. */
export interface DashboardRankItem {
  id: string
  primary: string
  secondary?: string
  value?: string | number
  progress?: number
  tone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'info'
}

/** Client margin intelligence — margin % and MTD revenue. */
export interface DashboardClientMarginItem {
  id: string
  client: string
  segment: string
  marginPercent: number
  revenueMtdL: number
  applicationsMtd?: number
  detail?: string
}

/** Portfolio · risk · margin client intelligence for finance dashboards. */
export interface DashboardClientIntelligenceData {
  clientRows: DashboardClientRow[]
  topRevenueClients: DashboardRankItem[]
  highRiskClients: DashboardRankItem[]
  dormantClients: DashboardRankItem[]
  highMarginClientIntelligence: DashboardClientMarginItem[]
  lowMarginClientIntelligence: DashboardClientMarginItem[]
}

export interface DashboardRevenuePeriod {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  targetLabel?: string
}

export interface DashboardPeriodHero {
  today: DashboardRevenuePeriod
  mtd: DashboardRevenuePeriod
  ytd: DashboardRevenuePeriod
}

/** Commercial finance hero strip — gross revenue · net revenue · collections · outstanding. */
export interface DashboardCommercialHeroData {
  revenueHero: DashboardPeriodHero
  collectionsHero: DashboardPeriodHero
  netRevenue: {
    value: string
    marginPercent: string
    delta?: number
    deltaLabel?: string
    /** Service fees component — Accounts hero. */
    serviceFees?: string
    /** Inward / outward (I/W) component — Accounts hero. */
    inwardOutward?: string
  }
  outstanding: {
    amount: string
    overdueInvoiceCount: number
    delta?: number
    deltaLabel?: string
  }
  /** Invoice count by period — paired with revenueHero on Accounts. */
  invoicedCountHero?: DashboardPeriodHero
}
