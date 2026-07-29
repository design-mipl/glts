import type { DashboardIntelligenceFilters } from '../../../shared/dashboard-intelligence'
import type { WorkforceTeamId } from '../config/workforceAnalyticsConfig'
import { WORKFORCE_TEAM_IDS } from '../config/workforceAnalyticsConfig'
import type {
  WorkforceAnalyticsData,
  WorkforceDepartmentCard,
  WorkforceEmployeeRow,
  WorkforceKpi,
  WorkforceNamedMetric,
  WorkforceTeamMetric,
  WorkforceTrendPoint,
} from '../types'

function dateScale(preset: DashboardIntelligenceFilters['datePreset']): number {
  switch (preset) {
    case 'today':
      return 0.35
    case 'week':
      return 0.72
    case 'month':
      return 1
    case 'quarter':
      return 1.18
    case 'year':
      return 1.35
    case 'date':
    case 'range':
    case 'custom':
      return 0.85
    default:
      return 1
  }
}

function segmentScale(segment: string): number {
  if (!segment || segment === 'all') return 1
  const map: Record<string, number> = {
    marine: 0.28,
    corporate: 0.34,
    retail: 0.38,
    b2b: 0.22,
  }
  return map[segment] ?? 0.55
}

function extraFilterScale(filters: DashboardIntelligenceFilters): number {
  let factor = 1
  if (filters.branch !== 'all') factor *= 0.55
  if (filters.country !== 'all') factor *= 0.7
  if (filters.client !== 'all') factor *= 0.45
  if (filters.employee !== 'all') factor *= 0.2
  if (filters.status !== 'all') factor *= 0.65
  if (filters.visaType !== 'all') factor *= 0.75
  if (filters.operationsTeam !== 'all') factor *= 0.5
  if (filters.search.trim()) factor *= 0.4
  return factor
}

function scaleInt(n: number, factor: number): number {
  return Math.max(0, Math.round(n * factor))
}

function scalePct(n: number, factor: number): number {
  const drift = (factor - 1) * 4
  return Math.min(99, Math.max(55, Math.round(n + drift)))
}

function scaleKpiValue(value: string | number, factor: number): string | number {
  if (typeof value === 'number') return scaleInt(value, factor)
  const pct = value.match(/^(\d+(?:\.\d+)?)%$/)
  if (pct) return `${scalePct(Number(pct[1]), factor)}%`
  const hours = value.match(/^(\d+(?:\.\d+)?)\s*h$/)
  if (hours) {
    const next = Math.max(0.5, Number((Number(hours[1]) / Math.max(factor, 0.35)).toFixed(1)))
    return `${next} h`
  }
  const mins = value.match(/^(\d+)\s*m$/)
  if (mins) {
    return `${Math.max(5, Math.round(Number(mins[1]) / Math.max(factor, 0.35)))} m`
  }
  const days = value.match(/^(\d+(?:\.\d+)?)\s*d$/)
  if (days) {
    const next = Math.max(0.5, Number((Number(days[1]) / Math.max(factor, 0.35)).toFixed(1)))
    return `${next} d`
  }
  const numeric = Number(String(value).replace(/,/g, ''))
  if (!Number.isNaN(numeric) && String(value).replace(/,/g, '') === String(numeric)) {
    return scaleInt(numeric, factor)
  }
  return value
}

function scaleKpis(items: WorkforceKpi[], factor: number): WorkforceKpi[] {
  return items.map((kpi) => ({
    ...kpi,
    value: scaleKpiValue(kpi.value, factor),
  }))
}

function scaleNamed(rows: WorkforceNamedMetric[], factor: number): WorkforceNamedMetric[] {
  return rows.map((row) => ({
    ...row,
    value: scaleInt(row.value, factor),
    secondary: row.secondary == null ? undefined : scalePct(row.secondary, factor),
    tertiary: row.tertiary == null ? undefined : scalePct(row.tertiary, factor),
    quaternary: row.quaternary == null ? undefined : scalePct(row.quaternary, factor),
  }))
}

function scaleTrend(rows: WorkforceTrendPoint[], factor: number): WorkforceTrendPoint[] {
  return rows.map((row) => ({
    ...row,
    value: scaleInt(row.value, factor) || scalePct(row.value, factor),
    secondary: row.secondary == null ? undefined : scalePct(row.secondary, factor),
    tertiary: row.tertiary == null ? undefined : scalePct(row.tertiary, factor),
    quaternary: row.quaternary == null ? undefined : scalePct(row.quaternary, factor),
  }))
}

function scaleDepartments(
  rows: WorkforceDepartmentCard[],
  factor: number,
): WorkforceDepartmentCard[] {
  return rows.map((row) => ({
    ...row,
    users: Math.max(1, scaleInt(row.users, Math.min(1, factor + 0.4))),
    openCases: scaleInt(row.openCases, factor),
    completedToday: scaleInt(row.completedToday, factor),
    pending: scaleInt(row.pending, factor),
    capacityPercent: scalePct(row.capacityPercent, factor),
    slaPercent: scalePct(row.slaPercent, factor),
    productivityPercent: scalePct(row.productivityPercent, factor),
  }))
}

function scaleTeams(rows: WorkforceTeamMetric[], factor: number): WorkforceTeamMetric[] {
  return rows.map((row) => ({
    ...row,
    openApplications: scaleInt(row.openApplications, factor),
    completed: scaleInt(row.completed, factor),
    delayed: scaleInt(row.delayed, factor),
    slaPercent: scalePct(row.slaPercent, factor),
    productivityPercent: scalePct(row.productivityPercent, factor),
  }))
}

function scaleEmployees(
  rows: WorkforceEmployeeRow[],
  factor: number,
): WorkforceEmployeeRow[] {
  return rows.map((row) => {
    const capacityPercent = scalePct(row.capacityPercent, factor)
    return {
      ...row,
      assigned: scaleInt(row.assigned, factor),
      completed: scaleInt(row.completed, factor),
      pending: scaleInt(row.pending, factor),
      delayed: scaleInt(row.delayed, factor),
      slaPercent: scalePct(row.slaPercent, factor),
      productivityPercent: scalePct(row.productivityPercent, factor),
      capacityPercent,
      workloadTone:
        capacityPercent >= 95 ? 'overloaded' : capacityPercent >= 82 ? 'busy' : 'normal',
    }
  })
}

function isTeamSegment(segment: string): segment is WorkforceTeamId {
  return (WORKFORCE_TEAM_IDS as readonly string[]).includes(segment)
}

/**
 * Apply dashboard-intelligence global filters to workforce analytics mock data.
 * Keeps all widgets in the Teams & Productivity tab aligned with the sticky filter bar.
 */
export function applyWorkforceFilters(
  data: WorkforceAnalyticsData,
  filters: DashboardIntelligenceFilters,
): WorkforceAnalyticsData {
  const factor =
    dateScale(filters.datePreset) * segmentScale(filters.segment) * extraFilterScale(filters)

  let employees = scaleEmployees(data.employees, factor)
  let teams = scaleTeams(data.teams, factor)
  let teamContribution = data.teamContribution.map((slice) => ({
    ...slice,
    value: scaleInt(slice.value, factor),
  }))

  if (isTeamSegment(filters.segment)) {
    employees = employees.filter((row) => row.teamId === filters.segment)
    teams = teams.filter((row) => row.id === filters.segment)
    teamContribution = teamContribution.filter((slice) => slice.id === filters.segment)
  }

  if (filters.employee !== 'all') {
    const needle = filters.employee.toLowerCase()
    employees = employees.filter(
      (row) =>
        row.id.toLowerCase().includes(needle) || row.name.toLowerCase().includes(needle),
    )
  }

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    employees = employees.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q) ||
        row.teamId.includes(q),
    )
  }

  const departments = scaleDepartments(data.departments, factor)
  let teamKpis = scaleKpis(data.teamKpis, factor)
  if (isTeamSegment(filters.segment)) {
    const teamKpiPrefix: Record<WorkforceTeamId, string> = {
      marine: 'marine',
      corporate: 'corp',
      retail: 'retail',
      b2b: 'b2b',
    }
    const prefix = teamKpiPrefix[filters.segment]
    teamKpis = teamKpis.filter((kpi) => kpi.id.startsWith(prefix))
  }

  return {
    ...data,
    executiveKpis: scaleKpis(data.executiveKpis, factor),
    departments,
    departmentRanking: scaleNamed(data.departmentRanking, factor),
    teamKpis,
    teams,
    teamContribution,
    teamMonthlyTrend: scaleTrend(data.teamMonthlyTrend, factor),
    employeeKpis: scaleKpis(data.employeeKpis, factor),
    employees,
    workloadKpis: scaleKpis(data.workloadKpis, factor),
    workloadByEmployee: scaleNamed(data.workloadByEmployee, factor),
    workloadStack: data.workloadStack.map((row) => ({
      ...row,
      open: scaleInt(row.open, factor),
      pending: scaleInt(row.pending, factor),
      completed: scaleInt(row.completed, factor),
      delayed: scaleInt(row.delayed, factor),
    })),
    capacityKpis: scaleKpis(data.capacityKpis, factor),
    departmentCapacity: scaleNamed(data.departmentCapacity, factor),
    userCapacity: scaleNamed(data.userCapacity, factor),
    slaKpis: scaleKpis(data.slaKpis, factor),
    slaByDepartment: scaleNamed(data.slaByDepartment, factor),
    slaByTeam: scaleNamed(data.slaByTeam, factor),
    slaByEmployee: scaleNamed(data.slaByEmployee, factor),
    slaTrend: scaleTrend(data.slaTrend, factor),
    dailyProductivity: scaleTrend(data.dailyProductivity, factor),
    weeklyProductivity: scaleTrend(data.weeklyProductivity, factor),
    monthlyProductivity: scaleTrend(data.monthlyProductivity, factor),
    departmentTrend: scaleTrend(data.departmentTrend, factor),
    qualityKpis: scaleKpis(data.qualityKpis, factor),
    errorDistribution: data.errorDistribution.map((s) => ({
      ...s,
      value: scaleInt(s.value, factor),
    })),
    qcByDepartment: scaleNamed(data.qcByDepartment, factor),
    reworkTrend: scaleTrend(data.reworkTrend, factor),
    activityKpis: scaleKpis(data.activityKpis, factor),
    activityTimeline: data.activityTimeline,
    comparisonTable: departments,
    comparisonBars: scaleNamed(data.comparisonBars, factor),
    radarComparison: data.radarComparison,
    topPerformers: scaleNamed(data.topPerformers, factor),
    topTeams: scaleNamed(data.topTeams, factor),
    topDepartments: scaleNamed(data.topDepartments, factor),
    mostImproved: scaleNamed(data.mostImproved, factor),
    bottleneckKpis: scaleKpis(data.bottleneckKpis, factor),
    bottleneckByDepartment: scaleNamed(data.bottleneckByDepartment, factor),
    bottleneckByTeam: scaleNamed(data.bottleneckByTeam, factor),
    bottleneckByEmployee: scaleNamed(data.bottleneckByEmployee, factor),
    delayReasons: data.delayReasons.map((s) => ({
      ...s,
      value: scaleInt(s.value, factor),
    })),
  }
}
