import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData, AccountsInvoiceRow } from '../types'

export type AccountsInvoicePipelineId = 'pending_to_invoice' | 'total_invoiced' | 'total_credit_notes'

export interface AccountsInvoicePipelineSlice {
  key: AccountsInvoicePipelineId
  label: string
  value: number
  color: string
}

const PIPELINE_META: Record<
  AccountsInvoicePipelineId,
  { label: string; color: string }
> = {
  pending_to_invoice: {
    label: 'Pending to be invoiced',
    color: ACCOUNTS_CHART_COLORS.amber,
  },
  total_invoiced: {
    label: 'Total invoiced',
    color: ACCOUNTS_CHART_COLORS.green,
  },
  total_credit_notes: {
    label: 'Total credit Notes',
    color: ACCOUNTS_CHART_COLORS.violet,
  },
}

function isInvoicedStatus(status: string): boolean {
  const normalized = status.toLowerCase()
  return (
    normalized.includes('posted') ||
    normalized.includes('approved') ||
    normalized.includes('issued')
  )
}

function countPendingToInvoice(data: AccountsDashboardData): number {
  const readyCases = data.visaSubmissionRows.filter((row) => row.invoiceReady === 'Yes').length
  const unbilled = data.invoiceExceptionRows.filter((row) => row.kind === 'unbilled').length
  return readyCases + unbilled
}

function countTotalInvoiced(data: AccountsDashboardData): number {
  const issuedInvoices = data.invoiceRows.filter((row: AccountsInvoiceRow) =>
    isInvoicedStatus(row.status),
  ).length
  const generatedDrafts = data.invoicePostingQueue.length
  return issuedInvoices + generatedDrafts
}

function countTotalCreditNotes(data: AccountsDashboardData): number {
  return data.invoiceExceptionRows.filter((row) => row.kind === 'credit_note').length
}

/** Invoice pipeline mix — pending · invoiced · credit notes. */
export function buildAccountsInvoicePipelineSlices(
  data: AccountsDashboardData,
): AccountsInvoicePipelineSlice[] {
  const counts: Record<AccountsInvoicePipelineId, number> = {
    pending_to_invoice: countPendingToInvoice(data),
    total_invoiced: countTotalInvoiced(data),
    total_credit_notes: countTotalCreditNotes(data),
  }

  return (Object.keys(PIPELINE_META) as AccountsInvoicePipelineId[])
    .map((key) => ({
      key,
      label: PIPELINE_META[key].label,
      value: counts[key],
      color: PIPELINE_META[key].color,
    }))
    .filter((slice) => slice.value > 0)
}
