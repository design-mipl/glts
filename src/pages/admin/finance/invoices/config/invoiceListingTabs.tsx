import type { Invoice } from '@/shared/types/invoice'

export type InvoiceListingTab = 'all' | 'draft' | 'submitted' | 'overdue' | 'credit_notes'

export function filterInvoicesByTab(rows: Invoice[], tab: InvoiceListingTab): Invoice[] {
  switch (tab) {
    case 'draft':
      return rows.filter(r => r.invoiceStatus === 'draft')
    case 'submitted':
      return rows.filter(r => r.invoiceStatus === 'submitted' || r.invoiceStatus === 'shared')
    case 'overdue':
      return rows.filter(r => r.invoiceStatus === 'overdue')
    case 'credit_notes':
      return rows.filter(r => r.invoiceType === 'credit_note')
    default:
      return rows
  }
}

export function getInvoiceTabCounts(rows: Invoice[]): Record<InvoiceListingTab, number> {
  return {
    all: rows.length,
    draft: rows.filter(r => r.invoiceStatus === 'draft').length,
    submitted: rows.filter(r => r.invoiceStatus === 'submitted' || r.invoiceStatus === 'shared').length,
    overdue: rows.filter(r => r.invoiceStatus === 'overdue').length,
    credit_notes: rows.filter(r => r.invoiceType === 'credit_note').length,
  }
}

export const INVOICE_LISTING_TABS: { id: InvoiceListingTab; label: string }[] = [
  { id: 'all', label: 'All invoices' },
  { id: 'draft', label: 'Draft invoices' },
  { id: 'submitted', label: 'Submitted invoices' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'credit_notes', label: 'Credit notes' },
]
