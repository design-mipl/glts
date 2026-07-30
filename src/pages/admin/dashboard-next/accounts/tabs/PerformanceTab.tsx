import { useState } from 'react'
import { Box, Grid, Stack, Typography, alpha } from '@mui/material'
import { BarChart, DonutChart, LineChart, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardTabProps } from '../types'

const PERIOD_OPTIONS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
] as const

const PRODUCTIVITY_ACCENTS = [
  ACCOUNTS_CHART_COLORS.green,
  ACCOUNTS_CHART_COLORS.blue,
  ACCOUNTS_CHART_COLORS.amber,
  ACCOUNTS_CHART_COLORS.navy,
] as const

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

/** Performance — multi-color charts matching ops PerformanceTab. */
export function PerformanceTab({ data, loading }: AccountsDashboardTabProps) {
  const brand = usePublicBrandColors()
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const trendPoints = data.processingTrend.map((p) => ({
    label: p.label,
    billed: p.value,
    collected: p.secondary ?? Math.round(p.value * 0.72),
  }))

  const branchBars = data.branchPerformance.map((b) => ({
    branch: b.label,
    revenue: b.value,
  }))

  const topClientBars = data.topClients.slice(0, 6).map((c) => ({
    name: c.name.length > 18 ? `${c.name.slice(0, 16)}…` : c.name,
    revenue: c.sharePercent,
  }))

  const ageingSlices = data.ageingBuckets.map((bucket, index) => {
    const colors = [
      ACCOUNTS_CHART_COLORS.green,
      ACCOUNTS_CHART_COLORS.amber,
      ACCOUNTS_CHART_COLORS.coral,
      ACCOUNTS_CHART_COLORS.navy,
    ]
    return {
      key: bucket.id,
      label: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
      value: Math.round(bucket.amount / 100000),
      color: colors[index % colors.length],
    }
  })

  const segmentSlices = data.revenueBySegment.map((row, index) => {
    const colors = [
      ACCOUNTS_CHART_COLORS.navy,
      ACCOUNTS_CHART_COLORS.blue,
      ACCOUNTS_CHART_COLORS.teal,
      ACCOUNTS_CHART_COLORS.violet,
    ]
    return {
      key: row.id,
      label: row.name,
      value: row.sharePercent,
      color: colors[index % colors.length],
    }
  })

  const pvrBars = data.purchaseVsRevenue.trend.map((point) => ({
    label: point.label,
    revenue: point.revenue,
    purchase: point.purchase,
  }))

  const ageingTotal = ageingSlices.reduce((s, x) => s + x.value, 0)

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ChartPanel
          title="Collections trend"
          description="Billed vs collected"
          action={
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Performance period"
                value={period}
                options={[...PERIOD_OPTIONS]}
                onChange={(v) => setPeriod(String(v) as 'week' | 'month')}
              />
            </Box>
          }
        >
          <LineChart
            data={trendPoints}
            xKey="label"
            height={240}
            showLegend
            loading={loading}
            lines={[
              { key: 'billed', label: 'Billed', color: ACCOUNTS_CHART_COLORS.navy },
              { key: 'collected', label: 'Collected', color: ACCOUNTS_CHART_COLORS.green },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Working capital
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            Recovery and cash signals
          </Typography>
          <Grid container spacing={1.25}>
            {data.metricComparison.map((metric, index) => {
              const accent = PRODUCTIVITY_ACCENTS[index % PRODUCTIVITY_ACCENTS.length]
              const delta = metric.delta
              const deltaUp = delta != null && delta > 0
              const deltaDown = delta != null && delta < 0
              return (
                <Grid key={metric.label} size={{ xs: 6 }}>
                  <Box
                    sx={{
                      height: '100%',
                      p: 1.5,
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: brand.border,
                      borderLeft: `2px solid ${alpha(accent, 0.55)}`,
                      bgcolor: alpha(accent, 0.04),
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ fontSize: 12, display: 'block' }}
                    >
                      {metric.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: 'text.primary',
                      }}
                    >
                      {loading ? '—' : metric.value}
                    </Typography>
                    {delta != null ? (
                      <Typography
                        sx={{
                          mt: 0.35,
                          fontSize: 11,
                          fontWeight: 600,
                          color: deltaUp
                            ? alpha(ACCOUNTS_CHART_COLORS.green, 0.9)
                            : deltaDown
                              ? alpha(ACCOUNTS_CHART_COLORS.coral, 0.85)
                              : 'text.secondary',
                        }}
                      >
                        {delta > 0 ? '+' : ''}
                        {delta}
                      </Typography>
                    ) : null}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="AR ageing mix" description="Outstanding by bucket (₹L)">
          <DonutChart
            data={ageingSlices}
            height={240}
            loading={loading}
            centerLabel="₹L"
            centerValue={String(ageingTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Revenue by segment" description="Share % — Marine · B2B · Corporate · B2C">
          <DonutChart
            data={segmentSlices}
            height={240}
            loading={loading}
            centerLabel="segs"
            centerValue={String(segmentSlices.length)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Branch revenue" description="MTD revenue by branch (₹L)">
          <BarChart
            data={branchBars}
            xKey="branch"
            height={220}
            barSize={22}
            showLegend={false}
            loading={loading}
            bars={[
              { key: 'revenue', label: 'Revenue', color: ACCOUNTS_CHART_COLORS.blue },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Top clients" description="Share of revenue (%)">
          <BarChart
            data={topClientBars}
            xKey="name"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[
              { key: 'revenue', label: 'Share %', color: ACCOUNTS_CHART_COLORS.violet },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ChartPanel title="Purchase vs revenue" description="Cost vs revenue trend">
          <BarChart
            data={pvrBars}
            xKey="label"
            height={240}
            barSize={20}
            showLegend
            loading={loading}
            bars={[
              { key: 'revenue', label: 'Revenue', color: ACCOUNTS_CHART_COLORS.teal },
              { key: 'purchase', label: 'Purchase', color: ACCOUNTS_CHART_COLORS.coral },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}
