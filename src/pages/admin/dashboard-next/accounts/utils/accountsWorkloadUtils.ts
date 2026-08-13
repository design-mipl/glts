import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData } from '../types'

export interface AccountsWorkloadSlice {
  key: string
  label: string
  value: number
  color: string
}

export interface AccountsWorkloadCounts {
  pendingReconciliations: number
  pendingClaimRecon: number
  pendingClaimApprovals: number
  awaitingVendor: number
  invoicesToGenerate: number
  pendingClientSubmissions: number
  pendingFunds: number
}

function isPendingReconciliationStatus(status: string): boolean {
  return !status.toLowerCase().includes('matched')
}

/** Insurance, ticketing, courier, and credit-card reconciliation packs. */
function isPackReconciliationCategory(category: string): boolean {
  const normalized = category.toLowerCase()
  return (
    normalized.includes('insurance') ||
    normalized.includes('ticketing') ||
    normalized.includes('ticket') ||
    normalized.includes('courier') ||
    normalized.includes('credit card')
  )
}

function countPendingClientSubmissions(
  rows: AccountsDashboardData['invoiceSubmissions'],
): number {
  return rows.filter((row) => {
    const status = row.status.toLowerCase()
    return status.includes('due today') || status.includes('pending') || status.includes('draft ready')
  }).length
}

export function getAccountsWorkloadCounts(data: AccountsDashboardData): AccountsWorkloadCounts {
  return {
    pendingFunds: data.fundAllocationRows.filter((row) => row.allocationStatus === 'Pending').length,
    pendingClaimApprovals: data.claimSheetRows.filter((row) => row.status === 'Pending review').length,
    pendingClaimRecon: data.claimSheetRows.filter((row) => row.status === 'Approved').length,
    awaitingVendor: data.vendorBillingRows.reduce(
      (sum, row) => sum + row.awaitingInvoiceCount,
      0,
    ),
    invoicesToGenerate: data.visaSubmissionRows.filter((row) => row.invoiceReady === 'Yes').length,
    pendingClientSubmissions: countPendingClientSubmissions(data.invoiceSubmissions),
    pendingReconciliations: data.reconciliationRows.filter(
      (row) =>
        isPendingReconciliationStatus(row.status) && isPackReconciliationCategory(row.category),
    ).length,
  }
}

/** Open finance desk workload — reconciliations through fund allocation. */
export function buildAccountsWorkloadSlices(data: AccountsDashboardData): AccountsWorkloadSlice[] {
  const counts = getAccountsWorkloadCounts(data)

  return [
    {
      key: 'reconciliations',
      label: 'Reconciliations',
      value: counts.pendingReconciliations,
      color: ACCOUNTS_CHART_COLORS.coral,
    },
    {
      key: 'claim_recon',
      label: 'Claim recon',
      value: counts.pendingClaimRecon,
      color: ACCOUNTS_CHART_COLORS.teal,
    },
    {
      key: 'claim_approvals',
      label: 'Claim approvals',
      value: counts.pendingClaimApprovals,
      color: ACCOUNTS_CHART_COLORS.violet,
    },
    {
      key: 'vendor',
      label: 'Vendor awaiting',
      value: counts.awaitingVendor,
      color: ACCOUNTS_CHART_COLORS.blue,
    },
    {
      key: 'invoices_generate',
      label: 'Invoices to generate',
      value: counts.invoicesToGenerate,
      color: ACCOUNTS_CHART_COLORS.green,
    },
    {
      key: 'client_submissions',
      label: 'Client submissions',
      value: counts.pendingClientSubmissions,
      color: ACCOUNTS_CHART_COLORS.amber,
    },
    {
      key: 'fund_allocation',
      label: 'Fund allocation',
      value: counts.pendingFunds,
      color: ACCOUNTS_CHART_COLORS.navy,
    },
  ].filter((slice) => slice.value > 0)
}
