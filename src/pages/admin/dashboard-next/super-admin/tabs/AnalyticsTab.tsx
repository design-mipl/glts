import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  QuickStats,
  RiskOverview,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ComparisonLayout,
  ExecutiveGrid,
  ProgressMetric,
  RankingList,
} from '../../shared/dashboard-ui-kit'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
import type { SuperAdminDashboardTabProps, SuperAdminRankItem } from '../types'

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
      <Stack spacing={0.5} sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {description}
          </Typography>
        ) : null}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

function toRankingItems(items: SuperAdminRankItem[]) {
  return items.map((item, index) => ({
    id: item.id,
    primary: item.primary,
    secondary: item.secondary,
    rank: index + 1,
    value: item.value,
    progress: item.progress,
  }))
}

/** Analytics — multi-color charts for revenue, mix, SLA, and people signals. */
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

  const segmentSlices = useMemo(
    () =>
      data.businessSegments.map((slice, index) => ({
        key: slice.id,
        label: slice.label,
        value: slice.value,
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [data.businessSegments],
  )
  const segmentTotal = segmentSlices.reduce((sum, s) => sum + s.value, 0)

  const countryBars = useMemo(
    () => data.countryDistribution.map((s) => ({ country: s.label, share: s.value })),
    [data.countryDistribution],
  )

  const visaBars = useMemo(
    () => data.visaDistribution.map((s) => ({ visa: s.label, share: s.value })),
    [data.visaDistribution],
  )

  const branchBars = useMemo(
    () => data.branchPerformance.map((b) => ({ branch: b.label, score: b.value })),
    [data.branchPerformance],
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
      <Grid size={{ xs: 12, lg: 8 }}>
        <ChartPanel title="Revenue vs collections" description="Monthly billed vs collected (₹Cr)">
          <LineChart
            data={revenuePoints}
            xKey="label"
            height={240}
            showLegend
            loading={loading}
            lines={[
              { key: 'revenue', label: 'Revenue', color: SUPER_ADMIN_CHART_COLORS.navy },
              { key: 'collected', label: 'Collected', color: SUPER_ADMIN_CHART_COLORS.green },
            ]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartPanel title="Segment share" description="Revenue mix by vertical">
          <DonutChart
            data={
              segmentSlices.length > 0
                ? segmentSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={240}
            loading={loading}
            centerLabel="%"
            centerValue={String(segmentTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <ChartPanel title="Country mix" description="Destination share">
          <BarChart
            data={countryBars}
            xKey="country"
            height={200}
            barSize={14}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: SUPER_ADMIN_CHART_COLORS.blue }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <ChartPanel title="Visa mix" description="Product share">
          <BarChart
            data={visaBars}
            xKey="visa"
            height={200}
            barSize={14}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: SUPER_ADMIN_CHART_COLORS.violet }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <ChartPanel title="Branch scores" description="Composite health">
          <BarChart
            data={branchBars}
            xKey="branch"
            height={200}
            barSize={14}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'score', label: 'Score', color: SUPER_ADMIN_CHART_COLORS.teal }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <ChartPanel title="Avg TAT by country" description="Days received → issued">
          <BarChart
            data={tatBars}
            xKey="country"
            height={200}
            barSize={14}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'days', label: 'Days', color: SUPER_ADMIN_CHART_COLORS.amber }]}
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
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Team capacity vs load" description="Open · capacity · done today">
          <BarChart
            data={capacityBars}
            xKey="team"
            height={220}
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
          columns={4}
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

      <Grid size={{ xs: 12 }}>
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          {data.staffProductivity.map((item) => (
            <ProgressMetric
              key={item.id}
              label={item.label}
              value={item.value}
              helperText={item.helperText}
              loading={loading}
            />
          ))}
        </ExecutiveGrid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ComparisonLayout
          left={
            <RankingList
              title="Department leaderboard"
              items={toRankingItems(data.staffLeaderboard)}
              loading={loading}
            />
          }
          right={
            <TeamCapacity
              title="Queue vs capacity"
              rows={data.teamCapacity}
              loading={loading}
              onRetry={onRetry}
              onViewAll={() => onNavigate('/admin/user-management/teams')}
            />
          }
        />
      </Grid>
    </Grid>
  )
}
