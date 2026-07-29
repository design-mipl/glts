import type {
  ApplicationChannel,
  DashboardFilters,
  DashboardKpiMetric,
  DistributionSlice,
  EscalationRow,
  ExecutiveCriticalAlert,
  NoMovementCaseRow,
  PassportTrackerSummary,
  PassportTransitRow,
  PipelineStage,
  RevenueSnapshot,
  SlaComplianceSegment,
  TeamProductivityMetric,
  TeamWorkloadRow,
  VerificationQueueRow,
  WeeklyCompletionPoint,
} from '../data/operationsDashboardMock'

function matchesChannel(channel: ApplicationChannel, applicationType: string): boolean {
  if (applicationType === 'all') return true
  if (applicationType === 'b2b') return channel === 'b2b'
  return channel === applicationType
}

function matchesCountry(country: string, filterCountry: string): boolean {
  if (filterCountry === 'all') return true
  return country === filterCountry
}

function matchesTeam(team: string, filterTeam: string): boolean {
  if (filterTeam === 'all') return true
  return team === filterTeam
}

export function getFilterScaleFactor(filters: DashboardFilters): number {
  let factor = 1
  if (filters.country !== 'all') factor *= 0.35
  if (filters.applicationType !== 'all') factor *= 0.42
  if (filters.team !== 'all') factor *= 0.48
  if (filters.dateRange[0] || filters.dateRange[1]) factor *= 0.88
  return factor
}

function scaleNumber(value: number, filters: DashboardFilters): number {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return value
  return Math.max(0, Math.round(value * factor))
}

export function scaleKpis(kpis: DashboardKpiMetric[], filters: DashboardFilters): DashboardKpiMetric[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return kpis
  return kpis.map((kpi) => {
    const scaled = Math.max(1, Math.round(kpi.value * factor))
    const isPercent = kpi.formattedValue?.includes('%')
    const isCurrency = kpi.id === 'revenue_today'
    return {
      ...kpi,
      value: scaled,
      formattedValue: isPercent
        ? `${scaled}%`
        : isCurrency
          ? `₹${(scaled / 100000).toFixed(1)}L`
          : kpi.formattedValue,
    }
  })
}

export function scalePipelineStages(stages: PipelineStage[], filters: DashboardFilters): PipelineStage[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return stages
  return stages.map((stage) => ({
    ...stage,
    total: scaleNumber(stage.total, filters),
    delayed: scaleNumber(stage.delayed, filters),
  }))
}

export function filterTeamWorkloadRows(rows: TeamWorkloadRow[], filters: DashboardFilters): TeamWorkloadRow[] {
  return rows.filter((row) => matchesTeam(row.team, filters.team))
}

export function scaleExecutiveAlerts(
  alerts: ExecutiveCriticalAlert[],
  filters: DashboardFilters,
): ExecutiveCriticalAlert[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return alerts
  return alerts.map((alert) => ({
    ...alert,
    count: Math.max(1, Math.round(alert.count * factor)),
  }))
}

export function filterVerificationQueue(
  rows: VerificationQueueRow[],
  filters: DashboardFilters,
): VerificationQueueRow[] {
  return rows.filter(
    (row) =>
      matchesCountry(row.country, filters.country) &&
      matchesChannel(row.channel, filters.applicationType) &&
      matchesTeam(row.team, filters.team),
  )
}

export function scalePassportSummary(
  summary: PassportTrackerSummary,
  filters: DashboardFilters,
): PassportTrackerSummary {
  return {
    notOutForDelivery: scaleNumber(summary.notOutForDelivery, filters),
    inTransit: scaleNumber(summary.inTransit, filters),
    delivered: scaleNumber(summary.delivered, filters),
  }
}

export function filterPassportTransitRows(
  rows: PassportTransitRow[],
  _filters: DashboardFilters,
): PassportTransitRow[] {
  return rows
}

export function scaleSlaCompliance(
  segments: SlaComplianceSegment[],
  filters: DashboardFilters,
): SlaComplianceSegment[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return segments
  return segments.map((segment) => ({
    ...segment,
    compliancePct: Math.min(100, Math.max(70, Math.round(segment.compliancePct * (0.9 + factor * 0.1)))),
  }))
}

export function scaleTeamProductivity(
  metrics: TeamProductivityMetric[],
  filters: DashboardFilters,
): TeamProductivityMetric[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return metrics
  return metrics.map((metric) => {
    if (metric.label === 'Open Cases') {
      const num = parseInt(metric.value.replace(/,/g, ''), 10)
      return { ...metric, value: String(scaleNumber(num, filters)) }
    }
    if (metric.label === 'Completed Today') {
      const num = parseInt(metric.value, 10)
      return { ...metric, value: String(scaleNumber(num, filters)) }
    }
    return metric
  })
}

export function scaleWeeklyCompletion(
  points: WeeklyCompletionPoint[],
  filters: DashboardFilters,
): WeeklyCompletionPoint[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return points
  return points.map((point) => ({
    ...point,
    completed: scaleNumber(point.completed, filters),
  }))
}

export function scaleRevenueSnapshot(
  snapshot: RevenueSnapshot,
  filters: DashboardFilters,
): RevenueSnapshot {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return snapshot
  return {
    ...snapshot,
    revenueVsTarget: Math.round(snapshot.revenueVsTarget * (0.95 + factor * 0.05)),
  }
}

export function scaleDistributionSlices(
  slices: DistributionSlice[],
  filters: DashboardFilters,
): DistributionSlice[] {
  const factor = getFilterScaleFactor(filters)
  if (factor === 1) return slices
  return slices.map((slice) => ({
    ...slice,
    value: scaleNumber(slice.value, filters),
  }))
}

export function filterDistributionByApplicationType(
  slices: DistributionSlice[],
  filters: DashboardFilters,
): DistributionSlice[] {
  if (filters.applicationType === 'all') return slices
  const keyMap: Record<string, string> = {
    retail: 'retail',
    corporate: 'corporate',
    marine: 'marine',
    b2b: 'b2b',
  }
  const key = keyMap[filters.applicationType]
  if (!key) return slices
  return slices.filter((slice) => slice.key === key)
}

export function filterEscalationRows(rows: EscalationRow[], filters: DashboardFilters): EscalationRow[] {
  return rows.filter((row) => matchesTeam(row.team, filters.team))
}

export function filterNoMovementCases(
  rows: NoMovementCaseRow[],
  filters: DashboardFilters,
): NoMovementCaseRow[] {
  return rows.filter(
    (row) =>
      matchesChannel(row.channel, filters.applicationType) &&
      matchesTeam(row.team, filters.team),
  )
}

export interface CountryChartRow {
  country: string
  applications: number
}

export function scaleCountryChartData(
  data: CountryChartRow[],
  filters: DashboardFilters,
): CountryChartRow[] {
  if (filters.country === 'all') {
    return data.map((row) => ({
      ...row,
      applications: scaleNumber(row.applications, filters),
    }))
  }
  const countryCode =
    filters.country === 'United Kingdom'
      ? 'UK'
      : filters.country === 'United States'
        ? 'US'
        : filters.country === 'United Arab Emirates'
          ? 'UAE'
          : filters.country === 'Singapore'
            ? 'SG'
            : filters.country === 'Germany'
              ? 'DE'
              : null
  if (!countryCode) return data
  return data
    .filter((row) => row.country === countryCode)
    .map((row) => ({ ...row, applications: scaleNumber(row.applications, filters) }))
}
