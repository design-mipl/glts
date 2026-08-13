import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BarChart, LineChart } from '@/design-system/UIComponents'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  useSuperAdminChartColors,
} from '../SuperAdminChrome'
import type {
  AnalyticsPeriodMonths,
  AnalyticsStackedChart,
  AnalyticsTrendChart,
} from '../../types/analyticsTypes'

function sliceTrendData<T extends { label: string }>(data: T[], months: AnalyticsPeriodMonths): T[] {
  return data.slice(-months)
}

function formatYValue(value: number, format?: AnalyticsTrendChart['yFormat']): string {
  if (format === 'percent') return `${value}%`
  if (format === 'currency') return `₹${value.toLocaleString('en-IN')}L`
  return value.toLocaleString('en-IN')
}

export interface AnalyticsLineTrendPanelProps {
  chart: AnalyticsTrendChart
  periodMonths: AnalyticsPeriodMonths
  loading?: boolean
}

export function AnalyticsLineTrendPanel({
  chart,
  periodMonths,
  loading,
}: AnalyticsLineTrendPanelProps) {
  const colors = useSuperAdminChartColors()
  const chartColors = [colors.navy, colors.teal, colors.amber, colors.green, colors.coral, colors.violet]

  const data = useMemo(
    () => sliceTrendData(chart.data, periodMonths),
    [chart.data, periodMonths],
  )

  const lines = useMemo(
    () =>
      chart.lines.map((line, index) => ({
        key: line.key,
        label: line.label,
        color: chartColors[index % chartColors.length],
      })),
    [chart.lines, chartColors],
  )

  return (
    <SuperAdminPanel title={chart.title}>
      {chart.description ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {chart.description}
        </Typography>
      ) : null}
      <LineChart
        data={data}
        xKey={chart.xKey}
        height={SA_CHART_HEIGHT}
        showLegend
        loading={loading}
        lines={lines}
        formatY={(v) => formatYValue(Number(v), chart.yFormat)}
        formatTooltip={(v) => formatYValue(Number(v), chart.yFormat)}
      />
    </SuperAdminPanel>
  )
}

export interface AnalyticsStackedTrendPanelProps {
  chart: AnalyticsStackedChart
  periodMonths: AnalyticsPeriodMonths
  loading?: boolean
}

export function AnalyticsStackedTrendPanel({
  chart,
  periodMonths,
  loading,
}: AnalyticsStackedTrendPanelProps) {
  const colors = useSuperAdminChartColors()
  const chartColors = [colors.navy, colors.amber, colors.teal, colors.green]

  const data = useMemo(
    () => sliceTrendData(chart.data, periodMonths),
    [chart.data, periodMonths],
  )

  const bars = useMemo(
    () =>
      chart.bars.map((bar, index) => ({
        key: bar.key,
        label: bar.label,
        color: chartColors[index % chartColors.length],
      })),
    [chart.bars, chartColors],
  )

  return (
    <SuperAdminPanel title={chart.title}>
      {chart.description ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {chart.description}
        </Typography>
      ) : null}
      <BarChart
        data={data}
        xKey={chart.xKey}
        height={SA_CHART_HEIGHT}
        stacked
        showLegend
        loading={loading}
        bars={bars}
        formatY={(v) => formatYValue(Number(v), chart.yFormat)}
      />
    </SuperAdminPanel>
  )
}

export interface AnalyticsPeriodToggleProps {
  value: AnalyticsPeriodMonths
  onChange: (next: AnalyticsPeriodMonths) => void
}

const PERIOD_OPTIONS: Array<{ label: string; value: AnalyticsPeriodMonths }> = [
  { label: '6M', value: 6 },
  { label: '12M', value: 12 },
  { label: '24M', value: 24 },
]

/** Period selector for trend charts — 6M · 12M · 24M. */
export function AnalyticsPeriodToggle({ value, onChange }: AnalyticsPeriodToggleProps) {
  return (
    <Stack direction="row" spacing={0.5} role="group" aria-label="Trend period">
      {PERIOD_OPTIONS.map((option) => {
        const selected = option.value === value
        return (
          <Box
            key={option.value}
            component="button"
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            sx={{
              border: '1px solid',
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: selected ? 'action.selected' : 'transparent',
              color: selected ? 'primary.main' : 'text.secondary',
              borderRadius: 1.25,
              px: 1.25,
              py: 0.5,
              fontSize: 12,
              fontWeight: selected ? 700 : 500,
              cursor: 'pointer',
              lineHeight: 1.2,
            }}
          >
            {option.label}
          </Box>
        )
      })}
    </Stack>
  )
}
