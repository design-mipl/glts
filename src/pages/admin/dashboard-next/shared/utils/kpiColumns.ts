/** Allowed KPI strip column counts for ExecutiveGrid. */
export type KpiColumnCount = 2 | 3 | 4 | 5 | 6

/**
 * Map a KPI item count to a single-row grid column count.
 * Caps at 6 so 7+ KPIs wrap rather than become unreadably narrow.
 */
export function kpiColumns(count: number, max: KpiColumnCount = 6): KpiColumnCount {
  if (count <= 0) return 4
  const capped = Math.min(Math.max(count, 2), max)
  if (capped === 2 || capped === 3 || capped === 4 || capped === 5 || capped === 6) {
    return capped
  }
  return 4
}
