import { Divider, Stack } from '@mui/material'
import { DASHBOARD_SPACING } from '../../constants'
import type { DashboardSegmentComparisonRow, DashboardSegmentTrendPoint } from '../../types'
import { SegmentGrowthTrendSection } from './SegmentGrowthTrendSection'
import { SegmentRevenueCollectionsSection } from './SegmentRevenueCollectionsSection'

export interface FinanceSegmentAnalyticsSectionsProps {
  comparisonRows: DashboardSegmentComparisonRow[]
  revenueTrend: DashboardSegmentTrendPoint[]
  applicationTrend: DashboardSegmentTrendPoint[]
  loading?: boolean
  onChartClick?: () => void
}

/** Revenue & collections + revenue & demand growth — shared finance segment analytics. */
export function FinanceSegmentAnalyticsSections({
  comparisonRows,
  revenueTrend,
  applicationTrend,
  loading,
  onChartClick,
}: FinanceSegmentAnalyticsSectionsProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section} divider={<Divider flexItem />}>
      <SegmentRevenueCollectionsSection
        rows={comparisonRows}
        loading={loading}
        onChartClick={onChartClick}
      />
      <SegmentGrowthTrendSection
        revenueTrend={revenueTrend}
        applicationTrend={applicationTrend}
        loading={loading}
        onChartClick={onChartClick}
      />
    </Stack>
  )
}
