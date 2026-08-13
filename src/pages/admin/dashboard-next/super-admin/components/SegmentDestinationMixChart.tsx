import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Button, BarChart, DonutChart } from '@/design-system/UIComponents'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  TopNSelect,
  colorSlices,
  sliceTopN,
  useSuperAdminChartColors,
  useSuperAdminChartSeries,
  useTopN,
} from './SuperAdminChrome'
import type {
  SuperAdminDestinationMetric,
  SuperAdminDestinationMixItem,
} from '../types'

const METRIC_OPTIONS: Array<{ id: SuperAdminDestinationMetric; label: string }> = [
  { id: 'volume', label: 'Volume' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'margin', label: 'Margin' },
  { id: 'rejection', label: 'Rejection' },
]

function metricValue(
  item: SuperAdminDestinationMixItem,
  metric: SuperAdminDestinationMetric,
): number {
  if (metric === 'revenue') return item.revenueL
  if (metric === 'margin') return item.grossProfitL
  if (metric === 'rejection') return item.rejectionPct
  return item.volume
}

function formatCenter(metric: SuperAdminDestinationMetric, total: number): string {
  if (metric === 'volume') return String(Math.round(total))
  return `₹${total.toFixed(1)}L`
}

function formatTooltip(metric: SuperAdminDestinationMetric, value: number): string {
  if (metric === 'volume') return `${Math.round(value)} apps`
  if (metric === 'revenue') return `₹${value.toFixed(1)}L revenue`
  if (metric === 'rejection') return `${value.toFixed(1)}% rejection`
  return `₹${value.toFixed(1)}L GP`
}

export interface SegmentDestinationMixChartProps {
  title?: string
  items: SuperAdminDestinationMixItem[]
  loading?: boolean
}

/**
 * Destination / country chart with Volume · Revenue · Margin · Rejection toggle.
 * Volume / Revenue / Margin → donut (mix). Rejection → horizontal bars (rate %).
 */
export function SegmentDestinationMixChart({
  title = 'By destination',
  items,
  loading,
}: SegmentDestinationMixChartProps) {
  const theme = useTheme()
  const chartColors = useSuperAdminChartColors()
  const series = useSuperAdminChartSeries()
  const top = useTopN('10')
  const [metric, setMetric] = useState<SuperAdminDestinationMetric>('volume')
  const isRejection = metric === 'rejection'

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => metricValue(b, metric) - metricValue(a, metric)),
    [items, metric],
  )

  const scoped = useMemo(() => sliceTopN(sorted, top.topN), [sorted, top.topN])

  const slices = useMemo(() => {
    if (isRejection) return []
    return colorSlices(
      scoped.map((item) => ({
        key: item.id,
        label: item.label,
        value: metricValue(item, metric),
      })),
      series,
    )
  }, [scoped, metric, series, isRejection])

  const rejectionBars = useMemo(() => {
    if (!isRejection) return []
    return scoped.map((item) => ({
      destination: item.label,
      rejectionPct: item.rejectionPct,
      rejectedCount: item.rejectedCount,
      decidedCount: item.decidedCount,
    }))
  }, [scoped, isRejection])

  const total = slices.reduce((sum, s) => sum + s.value, 0)
  const avgRejection =
    scoped.length > 0
      ? Math.round(
          (scoped.reduce((sum, s) => sum + s.rejectionPct, 0) / scoped.length) * 10,
        ) / 10
      : 0
  const worst = scoped[0]
  const centerLabel =
    metric === 'volume' ? 'apps' : metric === 'revenue' ? 'revenue' : 'gross profit'

  return (
    <SuperAdminPanel
      title={title}
      action={
        <Stack direction="row" spacing={1} useFlexGap alignItems="center" flexWrap="wrap">
          <Stack direction="row" spacing={0.5} useFlexGap>
            {METRIC_OPTIONS.map((option) => {
              const selected = option.id === metric
              return (
                <Button
                  key={option.id}
                  size="sm"
                  variant={selected ? 'contained' : 'outlined'}
                  label={option.label}
                  onClick={() => setMetric(option.id)}
                  aria-pressed={selected}
                />
              )
            })}
          </Stack>
          <TopNSelect
            value={top.topN}
            onChange={top.setTopN}
            ariaLabel={`${title} top N`}
          />
        </Stack>
      }
    >
      <Box>
        {isRejection ? (
          <Stack spacing={1}>
            {worst ? (
              <Typography variant="caption" color="warning.main" fontWeight={600}>
                Highest rejection: {worst.label} · {worst.rejectionPct.toFixed(1)}% · avg{' '}
                {avgRejection}%
              </Typography>
            ) : null}
            <BarChart
              data={
                rejectionBars.length > 0
                  ? rejectionBars
                  : [{ destination: 'None', rejectionPct: 0 }]
              }
              bars={[
                {
                  key: 'rejectionPct',
                  label: 'Rejection %',
                  color: theme.palette.warning.main,
                },
              ]}
              xKey="destination"
              orientation="horizontal"
              height={SA_CHART_HEIGHT}
              showLegend={false}
              loading={loading}
              barSize={14}
              wrapCategoryLabels
              formatY={(v) => `${Number(v).toFixed(1)}%`}
              tooltipExtras={[
                {
                  key: 'rejectedCount',
                  label: 'Rejected',
                  format: (v) => String(v ?? '—'),
                },
                {
                  key: 'decidedCount',
                  label: 'Decided',
                  format: (v) => String(v ?? '—'),
                },
              ]}
            />
          </Stack>
        ) : (
          <DonutChart
            data={
              slices.length > 0
                ? slices
                : [{ key: 'none', label: 'None', value: 1, color: chartColors.slate }]
            }
            height={SA_CHART_HEIGHT}
            loading={loading}
            centerLabel={centerLabel}
            centerValue={formatCenter(metric, total)}
            formatTooltip={(value) => formatTooltip(metric, Number(value) || 0)}
          />
        )}
      </Box>
    </SuperAdminPanel>
  )
}
