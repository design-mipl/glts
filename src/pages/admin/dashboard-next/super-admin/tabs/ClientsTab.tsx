import { useMemo } from 'react'
import { Grid, Stack } from '@mui/material'
import { DonutChart } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared'
import { SuperAdminWorkListing } from '../components/SuperAdminWorkListing'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminRankChart,
  SuperAdminSection,
  colorSlices,
  useSuperAdminChartColors,
  useSuperAdminChartSeries,
} from '../components/SuperAdminChrome'
import type { SuperAdminDashboardTabProps, SuperAdminWorkRow } from '../types'

/**
 * Clients — account intelligence (health, risk, margin, dormant, top accounts).
 */
export function ClientsTab({
  data,
  loading,
  onNavigate,
  onOpenClient,
}: SuperAdminDashboardTabProps) {
  const chart = useSuperAdminChartColors()
  const series = useSuperAdminChartSeries()

  const accountRows: SuperAdminWorkRow[] = useMemo(
    () =>
      data.clientRows.map((row) => ({
        id: row.id,
        primary: row.client,
        secondary: `${row.segment} · ${row.applications} apps · Rev ${row.revenue}`,
        category: row.segment,
        status: row.status,
        value: row.outstanding,
        priority: row.status.toLowerCase().includes('risk') ? 'High' : 'Medium',
      })),
    [data.clientRows],
  )

  const segmentSlices = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of data.clientRows) {
      counts.set(row.segment, (counts.get(row.segment) ?? 0) + 1)
    }
    return colorSlices(
      Array.from(counts.entries()).map(([label, value]) => ({
        key: label.toLowerCase(),
        label,
        value,
      })),
      series,
    )
  }, [data.clientRows, series])

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection title="Portfolio snapshot">
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <SuperAdminRankChart
              title="Client health scores"
              items={data.clientHealth}
              loading={loading}
              valueLabel="Score"
            />
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection title="Risk & margin">
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

      <SuperAdminSection title="Top accounts">
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="Top accounts by revenue"
              items={data.topRevenueClients}
              loading={loading}
              valueLabel="Revenue"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="Top growth opportunities"
              items={data.fastestGrowingClients}
              loading={loading}
              valueLabel="Growth"
            />
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection
        title="Key accounts"
        actionLabel="Open clients"
        onAction={() => onNavigate('/admin/customer-accounts/corporate-accounts')}
      >
        <SuperAdminWorkListing
          title="Key accounts"
          rows={accountRows}
          loading={loading}
          openLabel="Open"
          onOpen={(row) => onOpenClient?.(row.id)}
          onViewAll={() => onNavigate('/admin/customer-accounts/corporate-accounts')}
          viewAllLabel="Open clients"
          emptyTitle="No key accounts"
          emptyDescription="Accounts will appear here when loaded."
        />
      </SuperAdminSection>
    </Stack>
  )
}
