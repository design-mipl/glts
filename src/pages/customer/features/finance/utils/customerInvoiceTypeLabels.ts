import type { Invoice, InvoiceType } from '@/shared/types/invoice'

const TYPE_LABELS: Record<InvoiceType, string> = {
  single_invoice: 'Single Application Invoice',
  bulk_invoice: 'Bulk Application Invoice',
  cumulative: 'Consolidated Invoice',
  additional_expense: 'Additional / Revised Invoice',
  final_settlement: 'Final Settlement Invoice',
  credit_note: 'Credit Note',
  debit_note: 'Debit Note',
}

export function getCustomerInvoiceTypeLabel(invoice: Invoice): string {
  if (invoice.vesselName && invoice.invoiceType !== 'credit_note' && invoice.invoiceType !== 'debit_note') {
    return `${TYPE_LABELS[invoice.invoiceType]} · Marine`
  }
  return TYPE_LABELS[invoice.invoiceType] ?? invoice.invoiceType
}

export function getCustomerInvoiceTypeLabelShort(type: InvoiceType): string {
  return TYPE_LABELS[type] ?? type
}
