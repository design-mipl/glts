import type { Invoice } from '@/shared/types/invoice'

export type InvoiceListingTab =
  | 'draft'
  | 'submitted'
  | 'shared'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'credit_notes'

export function filterInvoicesByTab(rows: Invoice[], tab: InvoiceListingTab): Invoice[] {
  switch (tab) {
    case 'draft':
      return rows.filter(r => r.invoiceStatus === 'draft')
    case 'submitted':
      return rows.filter(r => r.invoiceStatus === 'submitted' && r.invoiceType !== 'credit_note')
    case 'shared':
      return rows.filter(r => r.invoiceStatus === 'shared')
    case 'paid':
      return rows.filter(r => r.invoiceStatus === 'paid' || r.invoiceStatus === 'partially_paid')
    case 'overdue':
      return rows.filter(r => r.invoiceStatus === 'overdue')
    case 'cancelled':
      return rows.filter(r => r.invoiceStatus === 'cancelled')
    case 'credit_notes':
      return rows.filter(r => r.invoiceType === 'credit_note')
    default:
      return rows
  }
}

export function getInvoiceTabCounts(rows: Invoice[]): Record<InvoiceListingTab, number> {
  return {
    draft: rows.filter(r => r.invoiceStatus === 'draft').length,
    submitted: rows.filter(r => r.invoiceStatus === 'submitted' && r.invoiceType !== 'credit_note').length,
    shared: rows.filter(r => r.invoiceStatus === 'shared').length,
    paid: rows.filter(r => r.invoiceStatus === 'paid' || r.invoiceStatus === 'partially_paid').length,
    overdue: rows.filter(r => r.invoiceStatus === 'overdue').length,
    cancelled: rows.filter(r => r.invoiceStatus === 'cancelled').length,
    credit_notes: rows.filter(r => r.invoiceType === 'credit_note').length,
  }
}

export const INVOICE_LISTING_TABS: { id: InvoiceListingTab; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'shared', label: 'Shared' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'credit_notes', label: 'Credit Notes' },
]
