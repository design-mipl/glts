import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import type { DashboardKpiItem } from '../../shared/types'
import type { ApplicationPipelineStageData } from '../../shared/widgets/operations/ApplicationPipeline'
import type { MarineTimelineRow } from '../../shared/widgets/operations/MarineTimeline'
import type { ExecutiveAttentionAlert } from '@/pages/admin/dashboard/components'
import { ragFromDaysRemaining } from '../../shared/config/ragStatus'
import {
  APPLICATION_FUNNEL_SEGMENT_SCALE,
  type ApplicationFunnelSegmentId,
} from '../config/applicationFunnelSegments'
import type { AdminDashboardNextData } from '../types'

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
  const id = segment as Exclude<ApplicationFunnelSegmentId, 'all'>
  return APPLICATION_FUNNEL_SEGMENT_SCALE[id] ?? 0.55
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

function scaleKpiValue(value: string | number, factor: number): string | number {
  if (typeof value === 'number') return scaleInt(value, factor)
  const pct = value.match(/^(\d+(?:\.\d+)?)%$/)
  if (pct) {
    const drift = (factor - 1) * 4
    return `${Math.min(99, Math.max(55, Math.round(Number(pct[1]) + drift)))}%`
  }
  if (value.startsWith('₹')) {
    const num = Number.parseFloat(value.replace(/[₹L,]/g, ''))
    if (!Number.isNaN(num)) {
      return `₹${Math.max(0.1, Number((num * factor).toFixed(1)))}L`
    }
  }
  return value
}

function scaleQuickStats(items: DashboardKpiItem[], factor: number): DashboardKpiItem[] {
  return items.map((kpi) => ({
    ...kpi,
    value: scaleKpiValue(kpi.value, factor),
    sparklineData: kpi.sparklineData?.map((point) =>
      typeof point === 'number' ? Math.max(0, Number((point * factor).toFixed(1))) : point,
    ),
  }))
}

function scalePipeline(
  stages: ApplicationPipelineStageData[],
  factor: number,
  segment: string,
): ApplicationPipelineStageData[] {
  const slaNudge =
    segment === 'corporate' ? 2 : segment === 'b2b' ? -2 : 0

  return stages.map((stage) => ({
    ...stage,
    count: scaleInt(stage.count, factor),
    delayedCount: scaleInt(stage.delayedCount, factor),
    averageAgeHours: Math.max(
      0,
      Math.round(stage.averageAgeHours * (0.92 + Math.min(factor, 1) * 0.2)),
    ),
    slaPercent: Math.min(100, Math.max(70, Math.round(stage.slaPercent + slaNudge))),
  }))
}

/** Cases stuck in a stage longer than 7 days (avg age or delayed), excluding dispatched. */
export function countCasesOverSevenDays(stages: ApplicationPipelineStageData[]): number {
  return stages
    .filter((stage) => stage.id !== 'dispatched')
    .reduce((sum, stage) => {
      if (stage.averageAgeHours > 168) return sum + stage.count
      return sum + stage.delayedCount
    }, 0)
}

function applyMarineFilters(
  rows: MarineTimelineRow[],
  filters: DashboardIntelligenceFilters,
): MarineTimelineRow[] {
  let next = rows.map((row) => {
    const days = row.daysRemaining
    return {
      ...row,
      ragStatus:
        typeof days === 'number' ? ragFromDaysRemaining(days) : row.ragStatus,
    }
  })

  // Non-marine segments have no crew-change board.
  if (filters.segment !== 'all' && filters.segment !== 'marine') {
    return []
  }

  if (filters.client !== 'all') {
    const needle = filters.client.toLowerCase()
    next = next.filter(
      (row) =>
        row.vessel.toLowerCase().includes(needle) ||
        row.joiningPort.toLowerCase().includes(needle),
    )
  }

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    next = next.filter((row) =>
      [row.vessel, row.joiningPort, row.visaStatus, row.signOn, row.crew]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }

  if (filters.status === 'at-risk') {
    next = next.filter((row) => row.ragStatus !== 'green')
  }

  return next
}

function scaleAttentionAlerts(
  alerts: ExecutiveAttentionAlert[],
  factor: number,
  overSevenDays: number,
): ExecutiveAttentionAlert[] {
  return alerts.map((alert) => {
    if (alert.id === 'ca-over-7d') {
      return {
        ...alert,
        count: overSevenDays,
        oldestWaiting: overSevenDays === 0 ? 'On target' : alert.oldestWaiting,
        priority: overSevenDays === 0 ? 'medium' : 'critical',
      }
    }
    return {
      ...alert,
      count: scaleInt(alert.count, factor),
    }
  })
}

/**
 * Apply dashboard-intelligence global filters to admin dashboard mock data.
 */
export function applyAdminDashboardFilters(
  data: AdminDashboardNextData,
  filters: DashboardIntelligenceFilters,
): AdminDashboardNextData {
  const factor =
    dateScale(filters.datePreset) *
    segmentScale(filters.segment) *
    extraFilterScale(filters)

  const pipelineStages = scalePipeline(data.pipelineStages, factor, filters.segment)
  const overSevenDays = countCasesOverSevenDays(pipelineStages)
  const marineTimeline = applyMarineFilters(data.marineTimeline, filters)

  const quickStats = scaleQuickStats(data.quickStats, factor).map((kpi) => {
    if (kpi.id !== 'cases-over-7d') return kpi
    return {
      ...kpi,
      value: overSevenDays,
      delta: overSevenDays === 0 ? 0 : -overSevenDays,
      deltaLabel: overSevenDays === 0 ? 'Target met: zero' : 'Target: zero in any stage >7d',
    }
  })

  return {
    ...data,
    quickStats,
    pipelineStages,
    marineTimeline,
    attentionAlerts: scaleAttentionAlerts(data.attentionAlerts, factor, overSevenDays),
    operationsHealth: {
      ...data.operationsHealth,
      delayedCases: scaleInt(data.operationsHealth.delayedCases, factor),
      completedToday: scaleInt(data.operationsHealth.completedToday, factor),
      criticalCases: scaleInt(data.operationsHealth.criticalCases, factor),
    },
    pendingVerification: data.pendingVerification.slice(
      0,
      Math.max(0, scaleInt(data.pendingVerification.length, Math.min(factor, 1))),
    ),
  }
}
