export interface VisaAnalyticsKpi {
  id: string
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
}

export interface VisaAnalyticsNamedMetric {
  id: string
  label: string
  value: number
  secondary?: number
  tertiary?: number
  quaternary?: number
  meta?: string
}

export interface VisaAnalyticsTrendPoint {
  label: string
  value: number
  secondary?: number
}

export interface VisaAnalyticsSlice {
  id: string
  label: string
  value: number
}

export interface VisaAnalyticsStackedRow {
  label: string
  submitted: number
  approved: number
  refused: number
  pending: number
}

export interface VisaAnalyticsCityRow {
  id: string
  city: string
  submitted: number
  pending: number
  completed: number
  delayed: number
  slaPercent: number
}

/** Jurisdiction Master rollup for Pan India / Jurisdictions analytics. */
export interface VisaAnalyticsJurisdictionRow {
  id: string
  jurisdiction: string
  submitted: number
  pending: number
  completed: number
  delayed: number
  slaPercent: number
}

export interface VisaAnalyticsStageTime {
  id: string
  label: string
  hours: number
}

export interface VisaAnalyticsData {
  executiveKpis: VisaAnalyticsKpi[]
  volumeByCountry: VisaAnalyticsNamedMetric[]
  volumeByClient: VisaAnalyticsNamedMetric[]
  volumeByCategory: VisaAnalyticsStackedRow[]
  volumeBySegment: VisaAnalyticsSlice[]
  monthlyVolumeTrend: VisaAnalyticsTrendPoint[]
  submissionKpis: VisaAnalyticsKpi[]
  submissionTrend: VisaAnalyticsTrendPoint[]
  submissionByCountry: VisaAnalyticsNamedMetric[]
  submissionByJurisdiction: VisaAnalyticsNamedMetric[]
  submissionStatus: VisaAnalyticsSlice[]
  collectionKpis: VisaAnalyticsKpi[]
  collectionStatus: VisaAnalyticsSlice[]
  collectionTrend: VisaAnalyticsTrendPoint[]
  collectionByJurisdiction: VisaAnalyticsNamedMetric[]
  dispatchKpis: VisaAnalyticsKpi[]
  dispatchMode: VisaAnalyticsSlice[]
  dispatchTrend: VisaAnalyticsTrendPoint[]
  courierPerformance: VisaAnalyticsNamedMetric[]
  /** @deprecated Prefer panIndiaJurisdictions — kept for transitional mocks. */
  panIndiaCities: VisaAnalyticsCityRow[]
  panIndiaJurisdictions: VisaAnalyticsJurisdictionRow[]
  refusalKpis: VisaAnalyticsKpi[]
  refusalByCountry: VisaAnalyticsNamedMetric[]
  refusalByEmbassy: VisaAnalyticsNamedMetric[]
  refusalByClient: VisaAnalyticsNamedMetric[]
  refusalByStaff: VisaAnalyticsNamedMetric[]
  refusalByCategory: VisaAnalyticsStackedRow[]
  refusalReasons: VisaAnalyticsSlice[]
  refusalBySegment: VisaAnalyticsSlice[]
  approvalKpis: VisaAnalyticsKpi[]
  approvalByCountry: VisaAnalyticsNamedMetric[]
  approvalByClient: VisaAnalyticsNamedMetric[]
  approvalByCategory: VisaAnalyticsStackedRow[]
  approvalTrend: VisaAnalyticsTrendPoint[]
  slaKpis: VisaAnalyticsKpi[]
  processingStageTimes: VisaAnalyticsStageTime[]
  slaByCountry: VisaAnalyticsNamedMetric[]
  slaByClient: VisaAnalyticsNamedMetric[]
  slaByJurisdiction: VisaAnalyticsNamedMetric[]
  processingTimeTrend: VisaAnalyticsTrendPoint[]
  topCountries: VisaAnalyticsNamedMetric[]
  topClients: VisaAnalyticsNamedMetric[]
  topCategories: VisaAnalyticsNamedMetric[]
  topJurisdictions: VisaAnalyticsNamedMetric[]
  topSubmissionCities: VisaAnalyticsNamedMetric[]
  bottomCountries: VisaAnalyticsNamedMetric[]
  bottomClients: VisaAnalyticsNamedMetric[]
  bottomJurisdictions: VisaAnalyticsNamedMetric[]
  revenueKpis: VisaAnalyticsKpi[]
  revenueByCountry: VisaAnalyticsNamedMetric[]
  revenueByClient: VisaAnalyticsNamedMetric[]
  revenueBySegment: VisaAnalyticsSlice[]
  revenueTrend: VisaAnalyticsTrendPoint[]
  momGrowthTrend: VisaAnalyticsTrendPoint[]
}
