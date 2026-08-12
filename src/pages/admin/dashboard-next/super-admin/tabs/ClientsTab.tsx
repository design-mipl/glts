import { useMemo } from 'react'
import { Grid, Stack } from '@mui/material'
import { DonutChart } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminRankChart,
  SuperAdminSection,
  colorSlices,
  useSuperAdminChartColors,
  useSuperAdminChartSeries,
} from '../components/SuperAdminChrome'
import type { SuperAdminDashboardTabProps } from '../types'

/** Always show the four business segments, even when a slice count is 0. */
const PORTFOLIO_SEGMENTS = ['Marine', 'Corporate', 'Retail', 'B2B'] as const

/**
 * Clients — portfolio → growth → risk → margin.
 */
export function ClientsTab({ data, loading }: SuperAdminDashboardTabProps) {
  const chart = useSuperAdminChartColors()
  const series = useSuperAdminChartSeries()

  const segmentSlices = useMemo(() => {
    const counts = new Map<string, number>()
    for (const label of PORTFOLIO_SEGMENTS) counts.set(label, 0)
    for (const row of data.clientRows) {
      const match = PORTFOLIO_SEGMENTS.find(
        (label) => label.toLowerCase() === row.segment.toLowerCase(),
      )
      const key = match ?? row.segment
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return colorSlices(
      Array.from(counts.entries())
        .filter(([, value]) => value > 0)
        .map(([label, value]) => ({
          key: label.toLowerCase(),
          label,
          value,
        })),
      series,
    )
  }, [data.clientRows, series])

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection
        title="Portfolio"
        description="Segment mix and largest accounts by revenue"
      >
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <SuperAdminPanel title="Accounts by segment">
              <DonutChart
                data={
                  segmentSlices.length > 0
                    ? segmentSlices
                    : [{ key: 'none', label: 'None', value: 1, color: chart.slate }]
                }
                height={SA_CHART_HEIGHT}
                loading={loading}
                centerLabel="accts"
                centerValue={String(data.clientRows.length)}
              />
            </SuperAdminPanel>
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <SuperAdminRankChart
              title="Top accounts by revenue"
              items={data.topRevenueClients}
              loading={loading}
              valueLabel="Revenue"
              initialTopN="5"
            />
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection
        title="Growth"
        description="Accounts with the strongest period-over-period lift"
      >
        <SuperAdminRankChart
          title="Top growth opportunities"
          items={data.fastestGrowingClients}
          loading={loading}
          valueLabel="Growth"
          initialTopN="5"
        />
      </SuperAdminSection>

      <SuperAdminSection
        title="Risk"
        description="Accounts that need credit, collections, or reactivation attention"
      >
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="High-risk clients"
              items={data.highRiskClients}
              loading={loading}
              valueLabel="Risk"
              initialTopN="5"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="Dormant clients"
              items={data.dormantClients}
              loading={loading}
              valueLabel="Idle"
              initialTopN="5"
            />
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection
        title="Margin"
        description="Gross margin leaders and accounts that may need repricing"
      >
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="High margin clients"
              items={data.highMarginClients}
              loading={loading}
              valueLabel="Margin"
              initialTopN="5"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="Low margin clients"
              items={data.lowMarginClients}
              loading={loading}
              valueLabel="Margin"
              initialTopN="5"
            />
          </Grid>
        </Grid>
      </SuperAdminSection>
    </Stack>
  )
}
