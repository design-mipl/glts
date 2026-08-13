import type { DashboardCommercialHeroData } from '../../shared/types'
import type { AccountsDashboardData, AccountsInvoiceRow } from '../types'
import { getAccountsWorkloadCounts } from './accountsWorkloadUtils'

function parseAmountInr(amount: string): number {
  const cleaned = amount.replace(/[₹,\s]/g, '').toUpperCase()
  if (cleaned.endsWith('CR')) return (Number.parseFloat(cleaned) || 0) * 10000000
  if (cleaned.endsWith('L')) return (Number.parseFloat(cleaned) || 0) * 100000
  return Number.parseFloat(cleaned) || 0
}

function formatCompactInr(total: number): string {
  if (total >= 10000000) {
    const cr = total / 10000000
    return `₹${Number.isInteger(cr) ? cr.toFixed(0) : cr.toFixed(1)}Cr`
  }
  if (total >= 100000) {
    const lakhs = total / 100000
    return `₹${Number.isInteger(lakhs) ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`
  }
  if (total >= 1000) return `₹${Math.round(total / 1000)}k`
  return `₹${Math.round(total).toLocaleString('en-IN')}`
}

function isInvoicedStatus(status: string): boolean {
  const normalized = status.toLowerCase()
  return normalized.includes('posted') || normalized.includes('approved') || normalized.includes('issued')
}

function countTotalInvoiced(data: AccountsDashboardData): number {
  const issued = data.invoiceRows.filter((row: AccountsInvoiceRow) => isInvoicedStatus(row.status)).length
  return issued + data.invoicePostingQueue.length
}

function countPendingToInvoice(data: AccountsDashboardData): number {
  const ready = data.visaSubmissionRows.filter((row) => row.invoiceReady === 'Yes').length
  const unbilled = data.invoiceExceptionRows.filter((row) => row.kind === 'unbilled').length
  return ready + unbilled
}

function sumPendingToInvoiceAmount(data: AccountsDashboardData): number {
  return data.invoiceExceptionRows
    .filter((row) => row.kind === 'unbilled')
    .reduce((sum, row) => sum + parseAmountInr(row.amount), 0)
}

function countPendingClientSubmissions(data: AccountsDashboardData): number {
  return data.invoiceSubmissions.filter((row) => {
    const status = row.status.toLowerCase()
    return status.includes('due today') || status.includes('pending') || status.includes('draft ready')
  }).length
}

function countInvoicesSubmitted(data: AccountsDashboardData): number {
  return data.invoiceSubmissions.filter((row) => !row.status.toLowerCase().includes('pending data')).length
}

function sumInvoicesSubmittedAmount(data: AccountsDashboardData): number {
  return data.invoiceRows
    .filter((row) => isInvoicedStatus(row.status))
    .reduce((sum, row) => sum + parseAmountInr(row.amount), 0)
}

function countPendingCollections(data: AccountsDashboardData): number {
  return data.collectionRows.filter((row) => !row.status.toLowerCase().includes('collected')).length
}

function sumPendingCollectionsAmount(data: AccountsDashboardData): number {
  return data.collectionRows
    .filter((row) => !row.status.toLowerCase().includes('collected'))
    .reduce((sum, row) => sum + parseAmountInr(row.outstandingAmount), 0)
}

export interface AccountsHeroKpiModel {
  commercialHero: DashboardCommercialHeroData
  totalInvoicedCount: number
  submissionsDueCount: number
  invoicesSubmittedCount: number
  invoicesSubmittedAmount: string
  pendingCollectionsCount: number
  pendingCollectionsAmount: string
  cashBlockedAmount: string
  cashBlockedApps: number
  invoicesPendingCount: number
  invoicesPendingAmount: string
  reconciliationPendingCount: number
}

/** Aggregate Accounts hero KPI inputs from dashboard payload. */
export function buildAccountsHeroKpiModel(data: AccountsDashboardData): AccountsHeroKpiModel {
  const workload = getAccountsWorkloadCounts(data)
  const blocked = data.financeWorkspace.blockedCash
  const invoicedCountMtd = data.commercialHero.invoicedCountHero?.mtd.value

  return {
    commercialHero: data.commercialHero,
    totalInvoicedCount:
      invoicedCountMtd != null ? Number(invoicedCountMtd) : countTotalInvoiced(data),
    submissionsDueCount: workload.pendingClientSubmissions || countPendingClientSubmissions(data),
    invoicesSubmittedCount: countInvoicesSubmitted(data),
    invoicesSubmittedAmount: formatCompactInr(sumInvoicesSubmittedAmount(data)),
    pendingCollectionsCount: countPendingCollections(data),
    pendingCollectionsAmount: formatCompactInr(sumPendingCollectionsAmount(data)),
    cashBlockedAmount: blocked.amount,
    cashBlockedApps: blocked.applicationCount,
    invoicesPendingCount: countPendingToInvoice(data),
    invoicesPendingAmount: formatCompactInr(sumPendingToInvoiceAmount(data)),
    reconciliationPendingCount: workload.pendingReconciliations,
  }
}
