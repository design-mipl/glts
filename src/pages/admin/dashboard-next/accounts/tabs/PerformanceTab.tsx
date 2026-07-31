import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography, alpha } from '@mui/material'
import { BarChart, DonutChart, LineChart, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardTabProps, AccountsTopRevenueRow } from '../types'

const PERIOD_OPTIONS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
] as const

const TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 7', value: '7' },
  { label: 'Top 10', value: '10' },
] as const

type TopN = 5 | 7 | 10

const PRODUCTIVITY_ACCENTS = [
  ACCOUNTS_CHART_COLORS.green,
  ACCOUNTS_CHART_COLORS.blue,
  ACCOUNTS_CHART_COLORS.amber,
  ACCOUNTS_CHART_COLORS.navy,
] as const

const PAYMENT_MODE_COLORS: Record<string, string> = {
  'Credit card': ACCOUNTS_CHART_COLORS.coral,
  'Vendor payable': ACCOUNTS_CHART_COLORS.blue,
  Cash: ACCOUNTS_CHART_COLORS.teal,
  '—': ACCOUNTS_CHART_COLORS.slate,
}

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

function toTopBars(rows: AccountsTopRevenueRow[], limit: TopN) {
  return rows.slice(0, limit).map((row) => ({
    name: row.name,
    share: row.sharePercent,
  }))
}

function topChartHeight(count: number): number {
  return Math.max(260, count * 44 + 56)
}

function parseAmountLakhs(amount: string): number {
  const cleaned = amount.replace(/[₹,\s]/g, '').toUpperCase()
  if (cleaned.endsWith('L')) return Number.parseFloat(cleaned) || 0
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n / 100000 : 0
}

/** Performance — AR + module throughput charts (expenses · funds · vendor · invoices). */
export function PerformanceTab({ data, loading }: AccountsDashboardTabProps) {
  const brand = usePublicBrandColors()
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [clientTopN, setClientTopN] = useState<TopN>(5)
  const [countryTopN, setCountryTopN] = useState<TopN>(5)

  const trendPoints = data.processingTrend.map((p) => ({
    label: p.label,
    billed: p.value,
    collected: p.secondary ?? Math.round(p.value * 0.72),
  }))

  const topClientBars = useMemo(
    () => toTopBars(data.topClients, clientTopN),
    [data.topClients, clientTopN],
  )

  const topCountryBars = useMemo(
    () => toTopBars(data.topCountries, countryTopN),
    [data.topCountries, countryTopN],
  )

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

  const paymentModeBars = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of data.expenseDailyRows) {
      const mode = row.paymentMode || '—'
      map.set(mode, (map.get(mode) ?? 0) + parseAmountLakhs(row.amount) * 100)
    }
    return Array.from(map.entries()).map(([mode, amount]) => ({
      mode,
      amount: Math.round(amount),
    }))
  }, [data.expenseDailyRows])

  const fundThroughputBars = useMemo(() => {
    const pending = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Pending').length
    const allocated = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Allocated').length
    const claimPending = data.claimSheetRows.filter((r) => r.status === 'Pending review').length
    const claimApproved = data.claimSheetRows.filter((r) => r.status === 'Approved').length
    return [
      { stage: 'Funds pending', count: pending },
      { stage: 'Funds allocated', count: allocated },
      { stage: 'Claims pending', count: claimPending },
      { stage: 'Claims approved', count: claimApproved },
    ]
  }, [data.fundAllocationRows, data.claimSheetRows])

  const vendorBars = useMemo(
    () =>
      data.vendorBillingRows.map((row) => ({
        name: row.vendorName,
        outstanding: Math.round(parseAmountLakhs(row.outstandingAmount) * 100),
        awaiting: row.awaitingInvoiceCount,
      })),
    [data.vendorBillingRows],
  )

  const exceptionSlices = useMemo(() => {
    const unbilled = data.invoiceExceptionRows.filter((r) => r.kind === 'unbilled').length
    const refunds = data.invoiceExceptionRows.filter((r) => r.kind === 'refund').length
    const creditNotes = data.invoiceExceptionRows.filter((r) => r.kind === 'credit_note').length
    const expenseRefunds = data.expenseRefundRows.filter((r) =>
      r.status.toLowerCase().includes('pending'),
    ).length
    return [
      { key: 'unbilled', label: 'Unbilled', value: unbilled, color: ACCOUNTS_CHART_COLORS.amber },
      { key: 'inv-refund', label: 'Invoice refunds', value: refunds, color: ACCOUNTS_CHART_COLORS.coral },
      { key: 'cn', label: 'Credit notes', value: creditNotes, color: ACCOUNTS_CHART_COLORS.violet },
      {
        key: 'exp-refund',
        label: 'Expense refunds',
        value: expenseRefunds,
        color: ACCOUNTS_CHART_COLORS.teal,
      },
    ].filter((s) => s.value > 0)
  }, [data.invoiceExceptionRows, data.expenseRefundRows])

  const exceptionTotal = exceptionSlices.reduce((sum, s) => sum + s.value, 0)

  const collectionRateBars = useMemo(
    () => [
      {
        metric: 'Collection rate %',
        value: data.collectionSummary.collectionRate,
      },
      {
        metric: 'Overdue share',
        value: Math.max(
          8,
          Math.round(
            100 - data.collectionSummary.collectionRate + (period === 'month' ? 4 : 0),
          ),
        ),
      },
    ],
    [data.collectionSummary.collectionRate, period],
  )

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
        <ChartPanel title="Expense by payment mode" description="Spend mix from expense module (₹k)">
          <BarChart
            data={paymentModeBars}
            xKey="mode"
            height={220}
            barSize={24}
            showLegend={false}
            loading={loading}
            bars={[
              {
                key: 'amount',
                label: 'Amount ₹k',
                color: PAYMENT_MODE_COLORS[paymentModeBars[0]?.mode ?? ''] ?? ACCOUNTS_CHART_COLORS.coral,
              },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Fund & claim throughput" description="Ops requests and Ground Ops claim sheets">
          <BarChart
            data={fundThroughputBars}
            xKey="stage"
            height={220}
            barSize={22}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'count', label: 'Count', color: ACCOUNTS_CHART_COLORS.amber }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Vendor outstanding" description="Payables and charges awaiting invoice">
          <BarChart
            data={vendorBars}
            xKey="name"
            height={Math.max(240, vendorBars.length * 44 + 48)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend
            loading={loading}
            bars={[
              { key: 'outstanding', label: 'Outstanding ₹k', color: ACCOUNTS_CHART_COLORS.blue },
              { key: 'awaiting', label: 'Awaiting invoice', color: ACCOUNTS_CHART_COLORS.coral },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Invoice & expense exceptions" description="Unbilled · refunds · credit notes">
          <DonutChart
            data={
              exceptionSlices.length > 0
                ? exceptionSlices
                : [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]
            }
            height={240}
            loading={loading}
            centerLabel="open"
            centerValue={String(exceptionTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Collection rate vs overdues" description="Recovery health for selected period">
          <BarChart
            data={collectionRateBars}
            xKey="metric"
            height={220}
            barSize={28}
            showLegend={false}
            loading={loading}
            bars={[
              { key: 'value', label: '%', color: ACCOUNTS_CHART_COLORS.green },
            ]}
          />
        </ChartPanel>
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
        <ChartPanel
          title="Top clients"
          description="Share of revenue (%)"
          action={
            <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Top clients count"
                value={String(clientTopN)}
                options={[...TOP_N_OPTIONS]}
                onChange={(v) => setClientTopN(Number(v) as TopN)}
              />
            </Box>
          }
        >
          <BarChart
            data={topClientBars}
            xKey="name"
            height={topChartHeight(clientTopN)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            loading={loading}
            bars={[
              { key: 'share', label: 'Share %', color: ACCOUNTS_CHART_COLORS.violet },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Top countries"
          description="Share of revenue (%)"
          action={
            <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Top countries count"
                value={String(countryTopN)}
                options={[...TOP_N_OPTIONS]}
                onChange={(v) => setCountryTopN(Number(v) as TopN)}
              />
            </Box>
          }
        >
          <BarChart
            data={topCountryBars}
            xKey="name"
            height={topChartHeight(countryTopN)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            loading={loading}
            bars={[
              { key: 'share', label: 'Share %', color: ACCOUNTS_CHART_COLORS.blue },
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
