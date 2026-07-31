import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, Select, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData } from '../types'

type AgeingTab = 'amount' | 'count'
type SpendView = 'all' | 'credit_card' | 'insurance' | 'courier' | 'ticketing' | 'cash'

const SPEND_OPTIONS = [
  { label: 'All packs', value: 'all' },
  { label: 'Credit card', value: 'credit_card' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Courier', value: 'courier' },
  { label: 'Ticketing', value: 'ticketing' },
  { label: 'Cash', value: 'cash' },
] as const

const PACK_COLORS: Record<string, string> = {
  credit_card: ACCOUNTS_CHART_COLORS.coral,
  insurance: ACCOUNTS_CHART_COLORS.blue,
  courier: ACCOUNTS_CHART_COLORS.amber,
  ticketing: ACCOUNTS_CHART_COLORS.violet,
  cash: ACCOUNTS_CHART_COLORS.teal,
  invoiced_uninvoiced: ACCOUNTS_CHART_COLORS.slate,
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

function parseAmountLakhs(amount: string): number {
  const cleaned = amount.replace(/[₹,\s]/g, '').toUpperCase()
  if (cleaned.endsWith('L')) return Number.parseFloat(cleaned) || 0
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n / 100000 : 0
}

function parseAmountThousands(amount: string): number {
  return Math.round(parseAmountLakhs(amount) * 100)
}

export interface AccountsInfographicsProps {
  data: AccountsDashboardData
  loading?: boolean
}

/** Overview infographics — desks · expenses · funds · vendor · invoice exceptions · AR. */
export function AccountsInfographics({ data, loading }: AccountsInfographicsProps) {
  const [ageingTab, setAgeingTab] = useState<AgeingTab>('amount')
  const [spendView, setSpendView] = useState<SpendView>('all')

  const pendingFunds = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Pending').length
  const allocatedFunds = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Allocated').length
  const pendingClaims = data.claimSheetRows.filter((r) => r.status === 'Pending review').length
  const awaitingVendor = data.vendorBillingRows.reduce((sum, r) => sum + r.awaitingInvoiceCount, 0)
  const overdueCount = data.collectionRows.filter((r) =>
    r.status.toLowerCase().includes('overdue'),
  ).length
  const pendingRefunds = data.expenseRefundRows.filter((r) =>
    r.status.toLowerCase().includes('pending'),
  ).length

  const workloadSlices = useMemo(
    () =>
      [
        {
          key: 'expenses',
          label: 'Expenses',
          value: data.expenseDailyRows.length + pendingRefunds,
          color: ACCOUNTS_CHART_COLORS.coral,
        },
        {
          key: 'funds',
          label: 'Funds pending',
          value: pendingFunds,
          color: ACCOUNTS_CHART_COLORS.amber,
        },
        {
          key: 'claims',
          label: 'Claim sheets',
          value: pendingClaims,
          color: ACCOUNTS_CHART_COLORS.violet,
        },
        {
          key: 'vendor',
          label: 'Vendor awaiting',
          value: awaitingVendor,
          color: ACCOUNTS_CHART_COLORS.blue,
        },
        {
          key: 'exceptions',
          label: 'Invoice exceptions',
          value: data.invoiceExceptionRows.length,
          color: ACCOUNTS_CHART_COLORS.teal,
        },
        {
          key: 'overdue',
          label: 'Overdue AR',
          value: overdueCount,
          color: ACCOUNTS_CHART_COLORS.navy,
        },
      ].filter((s) => s.value > 0),
    [
      data.expenseDailyRows.length,
      data.invoiceExceptionRows.length,
      pendingFunds,
      pendingClaims,
      awaitingVendor,
      overdueCount,
      pendingRefunds,
    ],
  )

  const workloadTotal = workloadSlices.reduce((sum, s) => sum + s.value, 0)

  const expensePackSlices = useMemo(() => {
    const packs = ['credit_card', 'insurance', 'courier', 'ticketing', 'cash'] as const
    return packs
      .map((pack) => {
        const items = data.expenseDailyRows.filter((r) => r.pack === pack)
        return {
          key: pack,
          label: SPEND_OPTIONS.find((o) => o.value === pack)?.label ?? pack,
          value: items.length,
          color: PACK_COLORS[pack],
        }
      })
      .filter((s) => s.value > 0)
  }, [data.expenseDailyRows])

  const expensePackTotal = expensePackSlices.reduce((sum, s) => sum + s.value, 0)

  const fundBars = useMemo(
    () => [
      { status: 'Pending', count: pendingFunds },
      { status: 'Allocated', count: allocatedFunds },
    ],
    [pendingFunds, allocatedFunds],
  )

  const claimSlices = useMemo(() => {
    const pending = data.claimSheetRows.filter((r) => r.status === 'Pending review').length
    const approved = data.claimSheetRows.filter((r) => r.status === 'Approved').length
    const rejected = data.claimSheetRows.filter((r) => r.status === 'Rejected').length
    return [
      { key: 'pending', label: 'Pending review', value: pending, color: ACCOUNTS_CHART_COLORS.amber },
      { key: 'approved', label: 'Approved', value: approved, color: ACCOUNTS_CHART_COLORS.green },
      { key: 'rejected', label: 'Rejected', value: rejected, color: ACCOUNTS_CHART_COLORS.coral },
    ].filter((s) => s.value > 0)
  }, [data.claimSheetRows])

  const claimTotal = claimSlices.reduce((sum, s) => sum + s.value, 0)

  const vendorBars = useMemo(
    () =>
      data.vendorBillingRows.map((row) => ({
        name: row.vendorName.length > 18 ? `${row.vendorName.slice(0, 16)}…` : row.vendorName,
        outstanding: parseAmountThousands(row.outstandingAmount),
        awaiting: row.awaitingInvoiceCount,
      })),
    [data.vendorBillingRows],
  )

  const invoicePipelineSlices = useMemo(() => {
    const ready = data.visaSubmissionRows.filter((r) => r.invoiceReady === 'Yes').length
    const unbilled = data.invoiceExceptionRows.filter((r) => r.kind === 'unbilled').length
    const refunds = data.invoiceExceptionRows.filter((r) => r.kind === 'refund').length
    const creditNotes = data.invoiceExceptionRows.filter((r) => r.kind === 'credit_note').length
    return [
      { key: 'ready', label: 'Ready to invoice', value: ready, color: ACCOUNTS_CHART_COLORS.green },
      { key: 'unbilled', label: 'Unbilled', value: unbilled, color: ACCOUNTS_CHART_COLORS.amber },
      { key: 'refunds', label: 'Refunds', value: refunds, color: ACCOUNTS_CHART_COLORS.coral },
      { key: 'cn', label: 'Credit notes', value: creditNotes, color: ACCOUNTS_CHART_COLORS.violet },
    ].filter((s) => s.value > 0)
  }, [data.visaSubmissionRows, data.invoiceExceptionRows])

  const invoicePipelineTotal = invoicePipelineSlices.reduce((sum, s) => sum + s.value, 0)

  const ageingSlices = useMemo(() => {
    const colors = [
      ACCOUNTS_CHART_COLORS.green,
      ACCOUNTS_CHART_COLORS.amber,
      ACCOUNTS_CHART_COLORS.coral,
      ACCOUNTS_CHART_COLORS.navy,
    ]
    return data.ageingBuckets.map((bucket, index) => ({
      key: bucket.id,
      label: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
      value: ageingTab === 'amount' ? Math.round(bucket.amount / 1000) : (bucket.count ?? 0),
      color: colors[index % colors.length],
    }))
  }, [data.ageingBuckets, ageingTab])

  const ageingTotal = ageingSlices.reduce((sum, s) => sum + s.value, 0)

  const spendBars = useMemo(() => {
    const packs = ['credit_card', 'insurance', 'courier', 'ticketing', 'cash'] as const
    return packs
      .filter((pack) => spendView === 'all' || pack === spendView)
      .map((pack) => {
        const items = data.expenseDailyRows.filter((r) => r.pack === pack)
        return {
          pack: SPEND_OPTIONS.find((o) => o.value === pack)?.label ?? pack,
          amount: items.reduce((sum, r) => sum + parseAmountLakhs(r.amount) * 100000, 0) / 1000,
        }
      })
  }, [data.expenseDailyRows, spendView])

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Workload by desk" description="Open items across finance modules">
          <DonutChart
            data={workloadSlices.length > 0 ? workloadSlices : [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]}
            height={240}
            loading={loading}
            centerLabel="open"
            centerValue={String(workloadTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Expense pack mix" description="Today’s packs by type">
          <DonutChart
            data={expensePackSlices.length > 0 ? expensePackSlices : [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]}
            height={240}
            loading={loading}
            centerLabel="packs"
            centerValue={String(expensePackTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Invoice pipeline" description="Ready · unbilled · refunds · credit notes">
          <DonutChart
            data={invoicePipelineSlices.length > 0 ? invoicePipelineSlices : [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]}
            height={240}
            loading={loading}
            centerLabel="cases"
            centerValue={String(invoicePipelineTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Fund allocation" description="Pending vs allocated Ops requests">
          <BarChart
            data={fundBars}
            xKey="status"
            height={220}
            barSize={28}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'count', label: 'Count', color: ACCOUNTS_CHART_COLORS.amber }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Claim sheets" description="Ground Ops — pending · approved · rejected">
          <DonutChart
            data={claimSlices.length > 0 ? claimSlices : [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]}
            height={240}
            loading={loading}
            centerLabel="sheets"
            centerValue={String(claimTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="AR ageing"
          description="Outstanding by age bucket"
          action={
            <Tabs
              value={ageingTab}
              onChange={(value) => setAgeingTab(value as AgeingTab)}
              variant="underline"
              size="sm"
              items={[
                { value: 'amount', label: 'Amount' },
                { value: 'count', label: 'Count' },
              ]}
            />
          }
        >
          <DonutChart
            data={ageingSlices}
            height={240}
            loading={loading}
            centerLabel={ageingTab === 'amount' ? '₹k' : 'inv'}
            centerValue={String(ageingTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Vendor payables"
          description="Outstanding (₹k) by vendor"
        >
          <BarChart
            data={vendorBars}
            xKey="name"
            height={Math.max(240, vendorBars.length * 40 + 40)}
            barSize={18}
            orientation="horizontal"
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
        <ChartPanel
          title="Expense spend by pack"
          description="Card · insurance · courier · ticketing · cash"
          action={
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Expense pack filter"
                value={spendView}
                options={[...SPEND_OPTIONS]}
                onChange={(v) => setSpendView(String(v) as SpendView)}
              />
            </Box>
          }
        >
          <BarChart
            data={spendBars}
            xKey="pack"
            height={240}
            barSize={22}
            showLegend={false}
            loading={loading}
            bars={[
              {
                key: 'amount',
                label: 'Amount (₹k)',
                color:
                  spendView === 'all'
                    ? ACCOUNTS_CHART_COLORS.teal
                    : (PACK_COLORS[spendView] ?? ACCOUNTS_CHART_COLORS.teal),
              },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

export interface AccountsCollectionsTrendProps {
  data: AccountsDashboardData
  loading?: boolean
}

/** Collections vs billed trend — used beside recent activity on Overview. */
export function AccountsCollectionsTrend({ data, loading }: AccountsCollectionsTrendProps) {
  const bars = data.processingTrend.map((point) => ({
    label: point.label,
    billed: point.value,
    collected: point.secondary ?? Math.round(point.value * 0.7),
  }))

  return (
    <ChartPanel title="Collections trend" description="Billed vs recovered (₹L)">
      <BarChart
        data={bars}
        xKey="label"
        height={260}
        barSize={18}
        showLegend
        loading={loading}
        bars={[
          { key: 'billed', label: 'Billed', color: ACCOUNTS_CHART_COLORS.navy },
          { key: 'collected', label: 'Collected', color: ACCOUNTS_CHART_COLORS.green },
        ]}
      />
    </ChartPanel>
  )
}
