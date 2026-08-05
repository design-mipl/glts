import { useMemo } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { BarChart, LineChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  QuickStats,
  RiskOverview,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ExecutiveGrid,
  ProgressMetric,
} from '../../shared/dashboard-ui-kit'
import { SUPER_ADMIN_CHART_COLORS } from '../data/superAdminChartColors'
import type { SuperAdminDashboardTabProps } from '../types'

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

/**
 * Analytics — deep performance charts (not a clone of Business mix).
 * Country / visa / segment mix live on Business; people capacity on Operations.
 */
export function AnalyticsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  const brand = usePublicBrandColors()

  const revenuePoints = useMemo(
    () =>
      data.revenueTrend.map((p) => ({
        label: p.label,
        revenue: p.value,
        collected: p.secondary ?? 0,
      })),
    [data.revenueTrend],
  )

  const tatBars = useMemo(
    () => data.processingTimeByCountry.map((p) => ({ country: p.label, days: p.value })),
    [data.processingTimeByCountry],
  )

  const capacityBars = useMemo(
    () =>
      data.teamCapacity.map((row) => ({
        team: row.department,
        open: row.openCases,
        capacity: row.capacity,
        done: row.completedToday,
      })),
    [data.teamCapacity],
  )

  const throughputPoints = useMemo(
    () =>
      data.processingTrend.map((p) => ({
        label: p.label,
        processed: p.value,
        completed: p.secondary ?? 0,
      })),
    [data.processingTrend],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <ChartPanel title="Revenue vs collections" description="Monthly billed vs collected (₹Cr)">
          <LineChart
            data={revenuePoints}
            xKey="label"
            height={260}
            showLegend
            loading={loading}
            lines={[
              { key: 'revenue', label: 'Revenue', color: SUPER_ADMIN_CHART_COLORS.navy },
              { key: 'collected', label: 'Collected', color: SUPER_ADMIN_CHART_COLORS.green },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Avg TAT by country" description="Days received → issued">
          <BarChart
            data={tatBars}
            xKey="country"
            height={220}
            barSize={14}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'days', label: 'Days' }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Throughput trend" description="Processed vs completed">
          <LineChart
            data={throughputPoints}
            xKey="label"
            height={220}
            showLegend
            loading={loading}
            lines={[
              { key: 'processed', label: 'Processed', color: SUPER_ADMIN_CHART_COLORS.navy },
              { key: 'completed', label: 'Completed', color: SUPER_ADMIN_CHART_COLORS.green },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ChartPanel title="Team capacity vs load" description="Open · capacity · done today">
          <BarChart
            data={capacityBars}
            xKey="team"
            height={240}
            barSize={12}
            showLegend
            loading={loading}
            bars={[
              { key: 'open', label: 'Open', color: SUPER_ADMIN_CHART_COLORS.amber },
              { key: 'capacity', label: 'Capacity', color: SUPER_ADMIN_CHART_COLORS.navy },
              { key: 'done', label: 'Done today', color: SUPER_ADMIN_CHART_COLORS.teal },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14, mb: 1.5 }}>
            Network SLA
          </Typography>
          <ExecutiveGrid columns={2} spacing={DASHBOARD_SPACING.field}>
            {data.slaOverview.map((item) => (
              <ProgressMetric
                key={item.id}
                label={item.label}
                value={item.value}
                helperText={item.helperText}
                loading={loading}
              />
            ))}
          </ExecutiveGrid>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <QuickStats
          title="Commercial snapshot (placeholder)"
          loading={loading}
          items={[
            {
              id: 'pipe',
              label: 'Pipeline value',
              value: data.salesPlaceholder.pipelineValue,
            },
            {
              id: 'win',
              label: 'Win rate',
              value: data.salesPlaceholder.winRate,
            },
            {
              id: 'deal',
              label: 'Average deal',
              value: data.salesPlaceholder.avgDeal,
            },
            {
              id: 'conv',
              label: 'Proposal conversion',
              value: data.salesPlaceholder.conversion,
            },
          ]}
        />
      </Grid>
    </Grid>
  )
}
