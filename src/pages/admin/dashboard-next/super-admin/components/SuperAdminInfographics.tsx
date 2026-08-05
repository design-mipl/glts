import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
import type { SuperAdminDashboardData } from '../types'

function ChartPanel({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

export interface SuperAdminInfographicsProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onRetry?: () => void
  onPipelineStageClick?: (stageId: string) => void
}

/**
 * Overview strip — commercial mix only.
 * Pipeline / AR / capacity / country deep-dives live on Operations, Finance, Business, Analytics.
 */
export function SuperAdminInfographics({ data, loading }: SuperAdminInfographicsProps) {
  const verticalSlices = useMemo(
    () =>
      data.businessSegments.map((slice, index) => ({
        key: slice.id,
        label: slice.label,
        value: slice.value,
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [data.businessSegments],
  )
  const verticalTotal = verticalSlices.reduce((sum, s) => sum + s.value, 0)

  const jurisdictionBars = useMemo(
    () => data.branchPerformance.map((b) => ({ jurisdiction: b.label, score: b.value })),
    [data.branchPerformance],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Revenue mix by vertical" description="Share of network revenue">
          <DonutChart
            data={
              verticalSlices.length > 0
                ? verticalSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={240}
            loading={loading}
            centerLabel="%"
            centerValue={String(verticalTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Jurisdiction health" description="Composite score by jurisdiction">
          <BarChart
            data={jurisdictionBars}
            xKey="jurisdiction"
            height={240}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'score', label: 'Score' }]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

/** Primary revenue vs collections trend for Overview executive row. */
export function SuperAdminRevenueTrend({
  data,
  loading,
}: {
  data: SuperAdminDashboardData
  loading?: boolean
}) {
  const points = useMemo(
    () =>
      data.revenueTrend.map((p) => ({
        label: p.label,
        revenue: p.value,
        collected: p.secondary ?? 0,
      })),
    [data.revenueTrend],
  )

  return (
    <ChartPanel title="Revenue vs collections" description="Monthly billed vs collected (₹Cr)">
      <BarChart
        data={points}
        xKey="label"
        height={240}
        barSize={12}
        showLegend
        loading={loading}
        bars={[
          { key: 'revenue', label: 'Revenue', color: SUPER_ADMIN_CHART_COLORS.navy },
          { key: 'collected', label: 'Collected', color: SUPER_ADMIN_CHART_COLORS.green },
        ]}
      />
    </ChartPanel>
  )
}
