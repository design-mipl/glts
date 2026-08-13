import type { FinanceFloorStatus } from '../types'

const PL_METRIC_ORDER = ['net-revenue', 'gross-profit', 'ebitda'] as const

/** Compute available-funds status against minimum operating floor. */
export function computeFloorStatus(
  availableL: number,
  floorL: number,
): { status: FinanceFloorStatus; label: string } {
  if (!Number.isFinite(availableL) || !Number.isFinite(floorL) || floorL <= 0) {
    return { status: 'comfortable', label: 'Well above threshold' }
  }
  if (availableL <= floorL) {
    return { status: 'critical', label: 'At or below floor' }
  }
  if (availableL <= floorL * 1.15) {
    return { status: 'approaching', label: 'Approaching floor' }
  }
  return { status: 'comfortable', label: 'Well above threshold' }
}

export function floorStatusTone(
  status: FinanceFloorStatus,
): 'positive' | 'warning' | 'negative' {
  if (status === 'comfortable') return 'positive'
  if (status === 'approaching') return 'warning'
  return 'negative'
}

/** Enforce Net Revenue → Gross Profit → EBITDA display order. */
export function sortPlMetrics<T extends { id: string }>(metrics: T[]): T[] {
  const rank = (id: string) => {
    const index = PL_METRIC_ORDER.indexOf(id as (typeof PL_METRIC_ORDER)[number])
    return index === -1 ? PL_METRIC_ORDER.length : index
  }
  return [...metrics].sort((a, b) => rank(a.id) - rank(b.id))
}

export function primaryForecastRisk(risks: string[]): string {
  return risks[0] ?? 'No primary risk flagged'
}

export type MarginTrendDirection = 'improving' | 'declining' | 'flat'

/** Six-month margin trend signal from oldest → newest gross margin %. */
export function computeMarginTrendSignal(series: number[]): {
  direction: MarginTrendDirection
  deltaPp: number
} {
  if (series.length < 2) {
    return { direction: 'flat', deltaPp: 0 }
  }
  const first = series[0]
  const last = series[series.length - 1]
  const deltaPp = Number((last - first).toFixed(1))
  if (deltaPp > 0.3) return { direction: 'improving', deltaPp }
  if (deltaPp < -0.3) return { direction: 'declining', deltaPp }
  return { direction: 'flat', deltaPp }
}
