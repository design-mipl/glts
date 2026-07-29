import { useMemo, useState } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { Tabs } from '@/design-system/UIComponents'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart } from '@/design-system/UIComponents'
import {
  BranchPerformance,
  BusinessSegmentBreakdown,
  ChartPanel,
  CountryDistribution,
  DashboardTable,
  MetricComparison,
  ProcessingTrend,
  RevenueSnapshot,
  RiskOverview,
  SLAOverview,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AccountsDashboardTabProps, AccountsTopRevenueRow } from '../types'

type TopRevenueTab = 'clients' | 'countries' | 'segments'

export function AnalyticsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AccountsDashboardTabProps) {
  const [topTab, setTopTab] = useState<TopRevenueTab>('clients')
  const pvr = data.purchaseVsRevenue

  const topColumns: Column<AccountsTopRevenueRow>[] = useMemo(
    () => [
      { key: 'rank', label: '#', widthSize: 'sm', sortable: false },
      { key: 'name', label: 'Name', widthSize: 'lg', sortable: false },
      { key: 'revenue', label: 'Revenue', widthSize: 'md', sortable: false },
      {
        key: 'sharePercent',
        label: 'Share %',
        widthSize: 'sm',
        sortable: false,
        render: (_value, row) => `${row.sharePercent}%`,
      },
    ],
    [],
  )

  const topData =
    topTab === 'clients'
      ? data.topClients
      : topTab === 'countries'
        ? data.topCountries
        : data.revenueBySegment

  const topTitle =
    topTab === 'clients'
      ? 'Top 10 clients'
      : topTab === 'countries'
        ? 'Top 10 countries'
        : 'Revenue by business segment'

  const trendData = pvr.trend.map((point) => ({
    label: point.label,
    revenue: point.revenue,
    purchase: point.purchase,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot
          title="Revenue trend"
          data={data.revenueSnapshot}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BranchPerformance
          title="Branch revenue"
          subtitle="MTD revenue by branch (₹L)"
          branches={data.branchPerformance}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CountryDistribution
          title="Country revenue mix"
          slices={data.countryDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BusinessSegmentBreakdown
          title="Business segment revenue"
          slices={data.businessSegments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <ProcessingTrend
          title="Collections trend"
          subtitle="Billed vs recovered (₹L)"
          points={data.processingTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <MetricComparison
          title="Recovery metrics"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Box>
          <Box sx={{ mb: 1 }}>
            <Tabs
              size="sm"
              items={[
                { label: 'Top 10 clients', value: 'clients' },
                { label: 'Top 10 countries', value: 'countries' },
                { label: 'By segment', value: 'segments' },
              ]}
              value={topTab}
              onChange={(value) => setTopTab(value as TopRevenueTab)}
            />
          </Box>
          <DashboardTable
            title="Top revenue"
            subtitle={topTitle}
            columns={topColumns}
            data={topData}
            rowKey="id"
            loading={loading}
            pageSize={5}
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <ChartPanel
          title="Purchase vs revenue"
          subtitle={`Margin ${pvr.profitMargin} (${pvr.profitMarginPercent}%)`}
          loading={loading}
          onRetry={onRetry}
          heightSpacing={28}
        >
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Purchase {pvr.purchaseCost} · Vendor {pvr.vendorCost} · Revenue {pvr.revenue}
            </Typography>
          </Stack>
          <BarChart
            data={trendData}
            xKey="label"
            bars={[
              { key: 'revenue', label: 'Revenue' },
              { key: 'purchase', label: 'Purchase' },
            ]}
            height={220}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          title="Financial risk"
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/finance/invoices')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SLAOverview
          title="Finance SLA"
          items={data.slaOverview}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
