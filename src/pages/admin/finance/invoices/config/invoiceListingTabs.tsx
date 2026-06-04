import type { Invoice } from '@/shared/types/invoice'

export type InvoiceListingTab =
  | 'all'
  | 'draft'
  | 'submitted'
  | 'shared'
  | 'paid'
  | 'overdue'
  | 'credit_notes'
  | 'debit_notes'

export function filterInvoicesByTab(rows: Invoice[], tab: InvoiceListingTab): Invoice[] {
  switch (tab) {
    case 'draft':
      return rows.filter(r => r.invoiceStatus === 'draft')
    case 'submitted':
      return rows.filter(
        r =>
          r.invoiceStatus === 'submitted' &&
          r.invoiceType !== 'credit_note' &&
          r.invoiceType !== 'debit_note',
      )
    case 'shared':
      return rows.filter(r => r.invoiceStatus === 'shared')
    case 'paid':
      return rows.filter(r => r.invoiceStatus === 'paid' || r.invoiceStatus === 'partially_paid')
    case 'overdue':
      return rows.filter(r => r.invoiceStatus === 'overdue')
    case 'credit_notes':
      return rows.filter(r => r.invoiceType === 'credit_note')
    case 'debit_notes':
      return rows.filter(r => r.invoiceType === 'debit_note')
    default:
      return rows
  }
}

export function getInvoiceTabCounts(rows: Invoice[]): Record<InvoiceListingTab, number> {
  return {
    all: rows.length,
    draft: rows.filter(r => r.invoiceStatus === 'draft').length,
    submitted: rows.filter(
      r =>
        r.invoiceStatus === 'submitted' &&
        r.invoiceType !== 'credit_note' &&
        r.invoiceType !== 'debit_note',
    ).length,
    shared: rows.filter(r => r.invoiceStatus === 'shared').length,
    paid: rows.filter(r => r.invoiceStatus === 'paid' || r.invoiceStatus === 'partially_paid').length,
    overdue: rows.filter(r => r.invoiceStatus === 'overdue').length,
    credit_notes: rows.filter(r => r.invoiceType === 'credit_note').length,
    debit_notes: rows.filter(r => r.invoiceType === 'debit_note').length,
  }
}

export const INVOICE_LISTING_TABS: { id: InvoiceListingTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'shared', label: 'Shared' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'credit_notes', label: 'Credit Notes' },
  { id: 'debit_notes', label: 'Debit Notes' },
]
