import { useMemo, type KeyboardEvent } from 'react'
import { Grid, Stack } from '@mui/material'
import { BarChart } from '@/design-system/UIComponents'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../constants'
import { ChartPanel } from '../ChartPanel'
import type { DashboardSegmentComparisonRow } from '../../types'

const CHART_HEIGHT = 220

function formatLakhAxis(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return String(value ?? '')
  const rounded = Number.isInteger(n) ? String(n) : n.toFixed(1)
  return `₹${rounded}L`
}

export interface SegmentRevenueCollectionsSectionProps {
  title?: string
  description?: string
  rows: DashboardSegmentComparisonRow[]
  loading?: boolean
  onChartClick?: () => void
}

/** Gross vs net revenue and collections vs outstanding by segment. */
export function SegmentRevenueCollectionsSection({
  title = 'Revenue & collections',
  description = 'Commercial comparison by segment',
  rows,
  loading,
  onChartClick,
}: SegmentRevenueCollectionsSectionProps) {
  const chart = useDashboardChartColors()

  const grossNetBars = useMemo(
    () =>
      rows.map((row) => ({
        segment: row.label,
        gross: row.grossRevenueL,
        net: row.netRevenueL,
        marginLabel: row.grossMarginPercent,
      })),
    [rows],
  )

  const collectionsOutstanding = useMemo(
    () =>
      rows.map((row) => ({
        segment: row.label,
        collections: row.collectionsL,
        outstanding: row.outstandingL,
      })),
    [rows],
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
      <ExecutiveSectionHeader title={title} description={description} count={rows.length} />
      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack {...chartClickProps}>
            <ChartPanel
              title="Gross vs net revenue"
              subtitle="Gross = invoiced · Net = profit (₹L)"
              loading={loading}
            >
              <BarChart
                data={grossNetBars}
                xKey="segment"
                height={CHART_HEIGHT}
                barSize={18}
                showLegend
                loading={loading}
                formatY={formatLakhAxis}
                bars={[
                  { key: 'gross', label: 'Gross revenue', color: chart.navy },
                  { key: 'net', label: 'Net revenue', color: chart.green },
                ]}
                tooltipExtras={[{ key: 'marginLabel', label: 'Gross margin' }]}
              />
            </ChartPanel>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack {...chartClickProps}>
            <ChartPanel
              title="Collections vs outstanding"
              subtitle="Financial health by segment (₹L)"
              loading={loading}
            >
              <BarChart
                data={collectionsOutstanding}
                xKey="segment"
                height={CHART_HEIGHT}
                barSize={22}
                stacked
                showLegend
                loading={loading}
                formatY={formatLakhAxis}
                bars={[
                  { key: 'collections', label: 'Collections', color: chart.green },
                  { key: 'outstanding', label: 'Outstanding', color: chart.amber },
                ]}
              />
            </ChartPanel>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
