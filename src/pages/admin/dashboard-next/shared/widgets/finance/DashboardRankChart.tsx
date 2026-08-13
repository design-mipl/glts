import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { BarChart, Select } from '@/design-system/UIComponents'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { ChartPanel } from '../ChartPanel'

const TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 10', value: '10' },
  { label: 'Top 15', value: '15' },
  { label: 'Top 20', value: '20' },
  { label: 'Top 25', value: '25' },
] as const

export type DashboardRankTopN = '5' | '10' | '15' | '20' | '25'

function rankNumericValue(item: { value?: string | number; progress?: number }): number {
  if (typeof item.progress === 'number' && Number.isFinite(item.progress)) return item.progress
  if (typeof item.value === 'number' && Number.isFinite(item.value)) return item.value
  const text = String(item.value ?? '')
  const match = text.match(/([\d.]+)/)
  return match ? Number(match[1]) : 0
}

function truncateLabel(label: string, max = 18) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

function sliceTopN<T>(rows: T[], topN: DashboardRankTopN): T[] {
  return rows.slice(0, Number(topN))
}

export interface DashboardRankChartProps {
  title: string
  subtitle?: string
  items: Array<{
    id: string
    primary: string
    value?: string | number
    progress?: number
    secondary?: string
  }>
  loading?: boolean
  valueLabel?: string
  initialTopN?: DashboardRankTopN
}

/** Horizontal ranking chart with Top N selector. */
export function DashboardRankChart({
  title,
  subtitle,
  items,
  loading,
  valueLabel = 'Value',
  initialTopN = '10',
}: DashboardRankChartProps) {
  const chart = useDashboardChartColors()
  const [topN, setTopN] = useState<DashboardRankTopN>(initialTopN)

  const rows = useMemo(() => {
    const sorted = [...items].sort((a, b) => rankNumericValue(b) - rankNumericValue(a))
    return sliceTopN(sorted, topN).map((item) => ({
      name: truncateLabel(item.primary),
      value: rankNumericValue(item),
      status: typeof item.value === 'string' ? item.value : undefined,
      reason: item.secondary?.trim() || undefined,
    }))
  }, [items, topN])

  const chartHeight = Math.max(180, 28 * Math.max(rows.length, 4))

  return (
    <ChartPanel
      title={title}
      subtitle={subtitle}
      loading={loading}
      action={
        <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
          <Select
            size="sm"
            fullWidth
            aria-label={`${title} top N`}
            value={topN}
            options={[...TOP_N_OPTIONS]}
            onChange={(next) => setTopN(String(next) as DashboardRankTopN)}
          />
        </Box>
      }
    >
      <BarChart
        data={rows}
        xKey="name"
        orientation="horizontal"
        height={chartHeight}
        barSize={14}
        showLegend={false}
        loading={loading}
        bars={[{ key: 'value', label: valueLabel, color: chart.navy }]}
        tooltipExtras={[
          { key: 'status', label: 'Status', format: (v) => String(v) },
          { key: 'reason', label: 'Reason', format: (v) => String(v) },
        ]}
      />
    </ChartPanel>
  )
}
