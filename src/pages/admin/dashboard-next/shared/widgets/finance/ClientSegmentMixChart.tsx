import { useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, DonutChart } from '@/design-system/UIComponents'
import {
  colorSlices,
  useDashboardChartColors,
  useDashboardChartSeries,
} from '@/shared/theme/dashboardChartColors'
import type { DashboardClientRow } from '../../types'
import { ChartPanel } from '../ChartPanel'

const PORTFOLIO_SEGMENTS = ['Marine', 'Corporate', 'Retail', 'B2B'] as const
const CHART_HEIGHT = 220

type PortfolioMetric = 'accounts' | 'revenue'

const METRIC_OPTIONS: Array<{ id: PortfolioMetric; label: string }> = [
  { id: 'accounts', label: 'Accounts' },
  { id: 'revenue', label: 'Revenue' },
]

/** Parse display amounts like ₹42.6L / ₹1.2Cr into ₹ lakhs. */
export function parseAmountToLakhs(raw: string | number | undefined): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  const text = String(raw ?? '').trim()
  if (!text) return 0
  const match = text.replace(/,/g, '').match(/([\d.]+)\s*(cr|l|lakhs?)?/i)
  if (!match) return 0
  const n = Number(match[1])
  if (!Number.isFinite(n)) return 0
  const unit = (match[2] ?? 'l').toLowerCase()
  if (unit.startsWith('cr')) return Math.round(n * 100 * 10) / 10
  return Math.round(n * 10) / 10
}

interface SegmentAgg {
  label: string
  accounts: number
  revenueL: number
}

function aggregateBySegment(rows: DashboardClientRow[]): SegmentAgg[] {
  const map = new Map<string, SegmentAgg>()
  for (const label of PORTFOLIO_SEGMENTS) {
    map.set(label, { label, accounts: 0, revenueL: 0 })
  }
  for (const row of rows) {
    const match = PORTFOLIO_SEGMENTS.find(
      (label) => label.toLowerCase() === row.segment.toLowerCase(),
    )
    const key = match ?? row.segment
    const prev = map.get(key) ?? { label: key, accounts: 0, revenueL: 0 }
    prev.accounts += 1
    prev.revenueL = Math.round((prev.revenueL + parseAmountToLakhs(row.revenue)) * 10) / 10
    map.set(key, prev)
  }
  return Array.from(map.values())
}

export interface ClientSegmentMixChartProps {
  rows: DashboardClientRow[]
  loading?: boolean
}

/** Portfolio donut — Accounts | Revenue toggle for Marine · Corporate · Retail · B2B. */
export function ClientSegmentMixChart({ rows, loading }: ClientSegmentMixChartProps) {
  const chartColors = useDashboardChartColors()
  const series = useDashboardChartSeries()
  const [metric, setMetric] = useState<PortfolioMetric>('accounts')

  const segments = useMemo(() => aggregateBySegment(rows), [rows])

  const slices = useMemo(() => {
    const valued = segments
      .map((s) => ({
        key: s.label.toLowerCase(),
        label: s.label,
        value: metric === 'accounts' ? s.accounts : s.revenueL,
        accounts: s.accounts,
        revenueL: s.revenueL,
      }))
      .filter((s) => s.value > 0)
    return colorSlices(valued, series)
  }, [segments, metric, series])

  const totalAccounts = segments.reduce((sum, s) => sum + s.accounts, 0)
  const totalRevenueL = Math.round(segments.reduce((sum, s) => sum + s.revenueL, 0) * 10) / 10
  const centerValue =
    metric === 'accounts' ? String(totalAccounts) : `₹${totalRevenueL.toFixed(1)}L`
  const centerLabel = metric === 'accounts' ? 'accts' : 'revenue'

  return (
    <ChartPanel
      title="Accounts by segment"
      loading={loading}
      action={
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
      }
    >
      <Stack spacing={1.25}>
        <DonutChart
          data={
            slices.length > 0
              ? slices
              : [{ key: 'none', label: 'None', value: 1, color: chartColors.slate }]
          }
          height={CHART_HEIGHT}
          loading={loading}
          centerLabel={centerLabel}
          centerValue={centerValue}
          formatTooltip={(value) =>
            metric === 'accounts'
              ? `${Math.round(Number(value) || 0)} accounts`
              : `₹${Number(value).toFixed(1)}L revenue`
          }
        />

        <Stack spacing={0.5}>
          {segments.map((seg) => {
            const revenueShare =
              totalRevenueL > 0 ? Math.round((seg.revenueL / totalRevenueL) * 1000) / 10 : 0
            return (
              <Stack
                key={seg.label}
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
                spacing={1}
                sx={{ px: 0.5 }}
              >
                <Typography variant="body2" fontWeight={600} noWrap sx={{ minWidth: 0 }}>
                  {seg.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ flexShrink: 0, textAlign: 'right' }}
                >
                  {seg.accounts} accts · ₹{seg.revenueL.toFixed(1)}L
                  {totalRevenueL > 0 ? ` · ${revenueShare}%` : ''}
                </Typography>
              </Stack>
            )
          })}
        </Stack>
      </Stack>
    </ChartPanel>
  )
}
