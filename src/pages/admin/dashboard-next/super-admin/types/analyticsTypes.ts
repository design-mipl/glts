import type { ExecutiveKpiTone } from '../components/ExecutiveKpiCard'
import type { SuperAdminRankItem } from '../types'

export type AnalyticsPeriodMonths = 6 | 12 | 24

export interface AnalyticsTrendPoint {
  label: string
  [key: string]: string | number
}

export interface AnalyticsSeriesConfig {
  key: string
  label: string
}

export interface AnalyticsMetricHeadline {
  id: string
  title: string
  value: string
  tooltip: string
  tone?: ExecutiveKpiTone
  delta?: number
  deltaLabel?: string
  priorValue?: string
  targetLabel?: string
  supportingLines?: string[]
}

export interface AnalyticsTrendChart {
  title: string
  description?: string
  xKey: string
  yFormat?: 'percent' | 'currency' | 'number'
  lines: AnalyticsSeriesConfig[]
  data: AnalyticsTrendPoint[]
}

export interface AnalyticsStackedChart {
  title: string
  description?: string
  xKey: string
  yFormat?: 'percent' | 'currency' | 'number'
  bars: AnalyticsSeriesConfig[]
  data: AnalyticsTrendPoint[]
}

export interface AnalyticsLeadSourceRow {
  id: string
  source: string
  enquiries: number
  quotationsSent: number
  convertedAccounts: number
  conversionPct: number
  avgNetRevenue: string
}

export interface AnalyticsRevenueQuality {
  headlines: AnalyticsMetricHeadline[]
  concentrationTrend: AnalyticsTrendChart
  revenueByCountryTrend: AnalyticsTrendChart
  recurringVsTransactional: AnalyticsStackedChart
  recurringPct: string
  transactionalPct: string
}

export interface AnalyticsClientRetention {
  headlines: AnalyticsMetricHeadline[]
  nrrTrend: AnalyticsTrendChart
  churnBySegmentTrend: AnalyticsTrendChart
  walletShareAccounts: SuperAdminRankItem[]
}

export interface AnalyticsOperationalEfficiency {
  headlines: AnalyticsMetricHeadline[]
  approvalRateTrend: AnalyticsTrendChart
  rejectionRootCause: AnalyticsStackedChart
  reworkBySegmentTrend: AnalyticsTrendChart
}

export interface AnalyticsSalesPipeline {
  headlines: AnalyticsMetricHeadline[]
  leadSourceRows: AnalyticsLeadSourceRow[]
  conversionBySourceTrend: AnalyticsTrendChart
}

export interface SuperAdminAnalyticsData {
  revenueQuality: AnalyticsRevenueQuality
  clientRetention: AnalyticsClientRetention
  operationalEfficiency: AnalyticsOperationalEfficiency
  salesPipeline: AnalyticsSalesPipeline
}
