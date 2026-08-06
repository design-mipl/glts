import { useMemo } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { HandCoins } from 'lucide-react'
import { Button, DonutChart } from '@/design-system/UIComponents'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import {
  CollectionSummary,
  ProcessingTrend,
  DASHBOARD_SPACING,
} from '../../shared'
import { PredictivePanel } from '../../shared/dashboard-intelligence'
import {
  ExecutiveGrid,
  ExecutiveMetric,
  FinancialMetric,
} from '../../shared/dashboard-ui-kit'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminPulseBanner,
  SuperAdminRankChart,
  useSuperAdminChartColors,
} from '../components/SuperAdminChrome'
import type { SuperAdminDashboardTabProps } from '../types'

const ACCOUNTS_HREF = '/admin/dashboard-next/accounts'
const BILLING_HREF = '/admin/finance/invoices'

/**
 * Finance — cash, profitability, AR, margin, forecast.
 * Every block is an executive card container (Accounts / Analytics ChartPanel pattern).
 */
export function FinanceTab({
  data,
  loading,
  onRetry,
  onNavigate,
  forecasts = [],
}: SuperAdminDashboardTabProps) {
  const chart = useSuperAdminChartColors()
  const cash = data.cashPosition
  const blocked = data.blockedCash
  const kpis = data.financeKpis
  const overdueInvoices = data.executiveSummary.outstanding.overdueInvoiceCount

  const pulseParts = [
    blocked.applicationCount > 0
      ? `${blocked.amount} blocked · ${blocked.applicationCount} apps`
      : null,
    overdueInvoices > 0 ? `${overdueInvoices} overdue invoices` : null,
    kpis.creditExposure ? `Credit exposure ${kpis.creditExposure}` : null,
  ].filter(Boolean)

  const ageingSlices = useMemo(() => {
    const palette = [chart.green, chart.amber, chart.coral, chart.navy]
    return data.ageingBuckets.map((bucket, index) => ({
      key: bucket.id,
      label: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
      value: Math.round(bucket.amount / 100000),
      color: palette[index % palette.length],
    }))
  }, [chart, data.ageingBuckets])
  const ageingTotal = ageingSlices.reduce((sum, s) => sum + s.value, 0)

  const cashActions = (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button
        label="Accounts"
        variant="outlined"
        size="sm"
        onClick={() => onNavigate(ACCOUNTS_HREF)}
      />
      <Button
        label="Billing"
        variant="text"
        size="sm"
        onClick={() => onNavigate(BILLING_HREF)}
      />
    </Stack>
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {pulseParts.length > 0 ? (
        <SuperAdminPulseBanner
          icon={<HandCoins size={16} />}
          title="Finance pulse"
          description={pulseParts.join(' · ')}
          tone={overdueInvoices > 0 ? 'error' : 'warning'}
          action={
            <Button
              label="Accounts dashboard"
              variant="outlined"
              size="sm"
              onClick={() => onNavigate(ACCOUNTS_HREF)}
            />
          }
        />
      ) : null}

      <SuperAdminPanel title="Net cash position" action={cashActions}>
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          <FinancialMetric
            label="Bank balance"
            value={cash.bankBalance}
            helperText="Operating accounts"
            tone="info"
            loading={loading}
          />
          <FinancialMetric
            label="Blocked Embassy / VFS"
            value={blocked.amount}
            helperText={`${blocked.applicationCount} apps · ${blocked.expectedReleaseLabel}`}
            tone="warning"
            loading={loading}
          />
          <FinancialMetric
            label="Expected collections"
            value={cash.expectedCollections}
            helperText={`Today ${kpis.collectionsToday} · MTD ${kpis.collectionsMtd}`}
            tone="positive"
            loading={loading}
          />
          <FinancialMetric
            label="Available funds"
            value={cash.availableFunds}
            helperText="Bank − blocked + expected"
            tone="info"
            loading={loading}
          />
        </ExecutiveGrid>
      </SuperAdminPanel>

      <ExecutiveGrid columns={6} spacing={1}>
        <FinancialMetric
          label="EBITDA"
          value={kpis.ebitda}
          delta={kpis.ebitdaDelta}
          deltaLabel={kpis.ebitdaDeltaLabel}
          tone="info"
          loading={loading}
        />
        <FinancialMetric
          label="Gross profit"
          value={kpis.grossProfit}
          helperText={`Margin ${kpis.grossMarginPercent}`}
          delta={kpis.grossProfitDelta}
          deltaLabel="vs prior"
          tone="positive"
          loading={loading}
        />
        <FinancialMetric
          label="Net revenue"
          value={kpis.netRevenue}
          helperText="GLTS earnings"
          delta={kpis.netRevenueDelta}
          deltaLabel="vs prior"
          tone="positive"
          loading={loading}
        />
        <ExecutiveMetric
          label="DSO"
          value={`${kpis.dsoDays} days`}
          delta={kpis.dsoDelta}
          deltaLabel={kpis.dsoDeltaLabel}
          tone={(kpis.dsoDelta ?? 0) <= 0 ? 'positive' : 'warning'}
          loading={loading}
        />
        <ExecutiveMetric
          label="Working capital"
          value={kpis.workingCapitalExposure}
          helperText="AR + blocked fees"
          tone="warning"
          loading={loading}
        />
        <ExecutiveMetric
          label="Credit exposure"
          value={kpis.creditExposure}
          helperText="Agreement limits"
          tone="warning"
          loading={loading}
        />
      </ExecutiveGrid>

      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 5 }}>
          <SuperAdminPanel title="AR ageing">
            <DonutChart
              data={
                ageingSlices.length > 0
                  ? ageingSlices
                  : [{ key: 'none', label: 'None', value: 1, color: chart.slate }]
              }
              height={SA_CHART_HEIGHT}
              loading={loading}
              centerLabel="₹L"
              centerValue={String(ageingTotal)}
            />
          </SuperAdminPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
            <CollectionSummary
              data={data.collectionSummary}
              loading={loading}
              onRetry={onRetry}
            />
          </Box>
        </Grid>
      </Grid>

      <SuperAdminRankChart
        title="Gross margin by vertical"
        items={data.marginByVertical}
        loading={loading}
        valueLabel="Margin %"
        initialTopN="5"
      />

      <Box sx={{ minWidth: 0, '& > *': { height: '100%' } }}>
        <ProcessingTrend
          title="Gross revenue vs collections"
          points={data.revenueTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </Box>

      {forecasts.length > 0 ? (
        <SuperAdminPanel title="Revenue forecast · 30 / 60 / 90 days">
          <PredictivePanel models={forecasts} loading={loading} />
        </SuperAdminPanel>
      ) : null}
    </Stack>
  )
}
