import type { DashboardSegmentComparisonRow } from '../types'

/** Minimal segment card shape for comparison table / chart rows. */
export interface SegmentComparisonSource {
  id: string
  label: string
  revenue: string
  netRevenue: string
  grossMarginPercent: string
  activeApplications: number
  approvalPercent: string
  growthLabel: string
  growthPercent: number
  grossRevenueL: number
  netRevenueL: number
  collectionsL: number
  outstandingL: number
  marginPercent: number
}

export function toSegmentComparisonRows(
  segments: SegmentComparisonSource[],
): DashboardSegmentComparisonRow[] {
  return segments.map((segment) => ({
    id: segment.id,
    label: segment.label,
    revenue: segment.revenue,
    netRevenue: segment.netRevenue,
    grossMarginPercent: segment.grossMarginPercent,
    activeApplications: segment.activeApplications,
    approvalPercent: segment.approvalPercent,
    growthLabel: segment.growthLabel,
    growthPercent: segment.growthPercent,
    grossRevenueL: segment.grossRevenueL,
    netRevenueL: segment.netRevenueL,
    collectionsL: segment.collectionsL,
    outstandingL: segment.outstandingL,
    marginPercent: segment.marginPercent,
  }))
}
