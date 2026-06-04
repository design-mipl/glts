import type {
  ApplicationChannel,
  DashboardFilters,
  DashboardKpiMetric,
  DashboardQueueRow,
  PipelineStage,
  RecentInvoiceRow,
} from '../data/operationsDashboardMock'

function matchesChannel(channel: ApplicationChannel, applicationType: string): boolean {
  if (applicationType === 'all') return true
  return channel === applicationType
}

function matchesCountry(country: string, filterCountry: string): boolean {
  if (filterCountry === 'all') return true
  return country === filterCountry
}

export function filterQueueRows(rows: DashboardQueueRow[], filters: DashboardFilters): DashboardQueueRow[] {
  return rows.filter(
    (row) =>
      matchesCountry(row.country, filters.country) &&
      matchesChannel(row.channel, filters.applicationType),
  )
}

export function filterInvoices(rows: RecentInvoiceRow[], filters: DashboardFilters): RecentInvoiceRow[] {
  return rows.filter((row) => matchesChannel(row.channel, filters.applicationType))
}

export function scaleKpis(kpis: DashboardKpiMetric[], filters: DashboardFilters): DashboardKpiMetric[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return kpis
  return kpis.map((kpi) => ({
    ...kpi,
    value: Math.max(1, Math.round(kpi.value * factor)),
  }))
}

export function getFilterScaleFactor(filters: DashboardFilters): number {
  let factor = 1
  if (filters.country !== 'all') factor *= 0.35
  if (filters.applicationType !== 'all') factor *= 0.42
  if (filters.dateRange[0] || filters.dateRange[1]) factor *= 0.88
  return factor
}

export interface CountryChartRow {
  country: string
  applications: number
}

export function filterCountryChartData(
  data: CountryChartRow[],
  filters: DashboardFilters,
): CountryChartRow[] {
  if (filters.country === 'all') return data
  const countryCode = filters.country === 'United Kingdom' ? 'UK'
    : filters.country === 'United States' ? 'US'
    : filters.country === 'United Arab Emirates' ? 'UAE'
    : filters.country === 'Singapore' ? 'SG'
    : filters.country === 'Germany' ? 'DE'
    : null
  if (!countryCode) return data
  return data.filter((row) => row.country === countryCode)
}

export interface ChannelSlice {
  key: string
  label: string
  value: number
}

export function filterChannelDistribution(
  data: ChannelSlice[],
  filters: DashboardFilters,
): ChannelSlice[] {
  if (filters.applicationType === 'all') return data
  return data.filter((slice) => slice.key === filters.applicationType)
}

export function scalePipelineStages(stages: PipelineStage[], filters: DashboardFilters): PipelineStage[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return stages
  return stages.map((stage) => ({
    ...stage,
    total: Math.max(0, Math.round(stage.total * factor)),
    delayed: Math.max(0, Math.round(stage.delayed * factor)),
  }))
}
