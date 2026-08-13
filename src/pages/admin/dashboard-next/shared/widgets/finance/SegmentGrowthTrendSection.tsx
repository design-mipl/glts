import { useMemo, type KeyboardEvent } from 'react'
import { Grid, Stack } from '@mui/material'
import { LineChart } from '@/design-system/UIComponents'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../constants'
import { ChartPanel } from '../ChartPanel'
import type { DashboardSegmentTrendPoint } from '../../types'

const CHART_HEIGHT = 220

export interface SegmentGrowthTrendSectionProps {
  title?: string
  description?: string
  revenueTrend: DashboardSegmentTrendPoint[]
  applicationTrend: DashboardSegmentTrendPoint[]
  loading?: boolean
  onChartClick?: () => void
}

/** Monthly revenue and application trends by segment — shared across finance dashboards. */
export function SegmentGrowthTrendSection({
  title = 'Revenue & demand growth',
  description = 'Monthly trends by segment',
  revenueTrend,
  applicationTrend,
  loading,
  onChartClick,
}: SegmentGrowthTrendSectionProps) {
  const chart = useDashboardChartColors()

  const segmentSeries = useMemo(
    () =>
      [
        { key: 'marine', label: 'Marine', color: chart.navy },
        { key: 'corporate', label: 'Corporate', color: chart.blue },
        { key: 'retail', label: 'Retail', color: chart.green },
        { key: 'b2b', label: 'B2B', color: chart.amber },
      ] as const,
    [chart],
  )

  const chartClickProps = onChartClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick: onChartClick,
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onChartClick()
          }
        },
        sx: { cursor: 'pointer', height: '100%' },
      }
    : { sx: { height: '100%' } }

  return (
    <Stack component="section" spacing={DASHBOARD_SPACING.field} aria-label={title}>
      <ExecutiveSectionHeader title={title} description={description} />
      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack {...chartClickProps}>
            <ChartPanel
              title="Revenue growth trend"
              subtitle="Monthly gross (invoiced) revenue by segment (₹L)"
              loading={loading}
            >
              <LineChart
                data={revenueTrend as unknown as Record<string, unknown>[]}
                xKey="label"
                height={CHART_HEIGHT}
                showLegend
                loading={loading}
                lines={[...segmentSeries]}
              />
            </ChartPanel>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack {...chartClickProps}>
            <ChartPanel
              title="Monthly application trend"
              subtitle="Demand and workload by segment"
              loading={loading}
            >
              <LineChart
                data={applicationTrend as unknown as Record<string, unknown>[]}
                xKey="label"
                height={CHART_HEIGHT}
                showLegend
                loading={loading}
                lines={[...segmentSeries]}
              />
            </ChartPanel>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
