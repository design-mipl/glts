import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ProgressSummary, DASHBOARD_SPACING } from '../../shared'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
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

function parseMarginPercent(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const n = Number.parseFloat(String(value).replace('%', ''))
  return Number.isFinite(n) ? n : 0
}

/** Performance — revenue, margin, segments, SLA, productivity. */
export function PerformanceTab({ data, loading }: SuperAdminDashboardTabProps) {
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

  const marginBars = useMemo(
    () =>
      data.marginByVertical.map((item) => ({
        vertical: item.primary,
        margin: parseMarginPercent(item.value),
      })),
    [data.marginByVertical],
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
    () =>
      data.processingTimeByCountry.map((point) => ({
        country: point.label,
        days: point.value,
      })),
    [data.processingTimeByCountry],
  )

  const branchBars = useMemo(
    () =>
      data.branchPerformance.map((point) => ({
        branch: point.label,
        score: point.value,
      })),
    [data.branchPerformance],
  )

  const staffBars = useMemo(
    () =>
      data.staffLeaderboard.map((item) => ({
        team: item.primary,
        progress: item.progress ?? 0,
      })),
    [data.staffLeaderboard],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ChartPanel
          title="Revenue vs collections"
          description="Monthly billed vs collected across the network (₹Cr)"
        >
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
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Network SLA
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            Operations · Docs · Collections · Ground
          </Typography>
          <ProgressSummary items={data.slaOverview} loading={loading} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Gross margin by vertical" description="GP % this month">
          <BarChart
            data={marginBars}
            xKey="vertical"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'margin', label: 'Margin %', color: SUPER_ADMIN_CHART_COLORS.teal }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Segment share" description="Revenue mix by vertical">
          <DonutChart
            data={
              segmentSlices.length > 0
                ? segmentSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={220}
            loading={loading}
            centerLabel="%"
            centerValue={String(segmentTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Avg TAT by country" description="Mean days received → issued">
          <BarChart
            data={countryBars}
            xKey="country"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'days', label: 'Days', color: SUPER_ADMIN_CHART_COLORS.amber }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Branch performance" description="Composite health score">
          <BarChart
            data={branchBars}
            xKey="branch"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'score', label: 'Score', color: SUPER_ADMIN_CHART_COLORS.blue }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Staff productivity" description="Team completion vs capacity">
          <BarChart
            data={staffBars}
            xKey="team"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'progress', label: 'Progress %', color: SUPER_ADMIN_CHART_COLORS.violet }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Throughput signals
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            Application throughput · utilization · rework · queue health
          </Typography>
          <ProgressSummary items={data.staffProductivity} loading={loading} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14, mb: 0.5 }}>
            Sales / CRM
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            Placeholder until CRM sync lands — pipeline {data.salesPlaceholder.pipelineValue} · win
            rate {data.salesPlaceholder.winRate}
          </Typography>
          <Stack spacing={0.75}>
            {data.salesPlaceholder.notes.slice(0, 3).map((note) => (
              <Typography key={note} variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                · {note}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  )
}
