import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { ChartPanel, DASHBOARD_SPACING } from '../../shared'
import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData } from '../types'
import { buildAccountsClaimSheetSlices, getAccountsClaimSheetTotals } from '../utils/accountsClaimSheetUtils'
import { buildAccountsExpenseTypeSlices } from '../utils/accountsExpenseTypeUtils'
import { buildAccountsInvoicePipelineSlices } from '../utils/accountsInvoicePipelineUtils'

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

/** Overview desk snapshot — expense · invoice · claims · funds · vendor. */
export function AccountsInfographics({ data, loading }: AccountsInfographicsProps) {
  const pendingFunds = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Pending').length
  const allocatedFunds = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Allocated').length

  const expenseTypeSlices = useMemo(() => buildAccountsExpenseTypeSlices(data), [data])
  const expenseTypeTotal = expenseTypeSlices.reduce((sum, s) => sum + s.value, 0)

  const claimSlices = useMemo(() => buildAccountsClaimSheetSlices(data), [data])
  const claimTotals = useMemo(() => getAccountsClaimSheetTotals(data), [data])

  const invoicePipelineSlices = useMemo(() => buildAccountsInvoicePipelineSlices(data), [data])
  const invoicePipelineTotal = invoicePipelineSlices.reduce((sum, s) => sum + s.value, 0)

  const fundBars = useMemo(
    () => [
      { status: 'Pending', count: pendingFunds },
      { status: 'Allocated', count: allocatedFunds },
    ],
    [pendingFunds, allocatedFunds],
  )

  const vendorBars = useMemo(
    () =>
      data.vendorBillingRows.map((row) => ({
        name: row.vendorName.length > 18 ? `${row.vendorName.slice(0, 16)}…` : row.vendorName,
        outstanding: parseAmountThousands(row.outstandingAmount),
        awaiting: row.awaitingInvoiceCount,
      })),
    [data.vendorBillingRows],
  )

  const emptySlice = [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="Type of Expense"
          subtitle="Credit card · claim cash · insurance · tickets · consulate bank"
          loading={loading}
        >
          <DonutChart
            data={expenseTypeSlices.length > 0 ? expenseTypeSlices : emptySlice}
            height={240}
            loading={loading}
            legendPlacement="bottom"
            centerLabel="expenses"
            centerValue={String(expenseTypeTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Invoice pipeline" subtitle="Pending · invoiced · credit notes" loading={loading}>
          <DonutChart
            data={invoicePipelineSlices.length > 0 ? invoicePipelineSlices : emptySlice}
            height={220}
            loading={loading}
            centerLabel="invoices"
            centerValue={String(invoicePipelineTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Claim sheets" subtitle="Ready · approved · reconciled" loading={loading}>
          <DonutChart
            data={claimSlices.length > 0 ? claimSlices : emptySlice}
            height={220}
            loading={loading}
            centerLabel="sheets"
            centerValue={String(claimTotals.count)}
            formatTooltip={(value, _name, item) => {
              const slice = item?.payload as { count?: number; amountLabel?: string } | undefined
              if (slice?.count != null && slice.amountLabel) {
                return [`${slice.count} · ${slice.amountLabel}`, '']
              }
              return [String(value), '']
            }}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Fund allocation" subtitle="Pending vs allocated Ops requests" loading={loading}>
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

      <Grid size={{ xs: 12, md: 6, lg: 8 }}>
        <ChartPanel title="Vendor payables" subtitle="Outstanding (₹k) by vendor" loading={loading}>
          <BarChart
            data={vendorBars}
            xKey="name"
            height={Math.max(220, vendorBars.length * 40 + 40)}
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
    </Grid>
  )
}
