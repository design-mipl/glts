import type { Invoice } from '@/shared/types/invoice'

/** GST filed when a filing date is set (configurable later via backend). */
export function isGstFiled(invoice: Invoice): boolean {
  return Boolean(invoice.gstFiledAt?.trim())
}

/** Any recorded payment (partial or full) — treated like paid for correction rules. */
export function hasClientPayment(invoice: Invoice): boolean {
  if (invoice.paymentStatus === 'partial' || invoice.paymentStatus === 'paid' || invoice.paymentStatus === 'adjusted') {
    return true
  }
  if (invoice.invoiceStatus === 'partially_paid' || invoice.invoiceStatus === 'paid') {
    return true
  }
  return invoice.payments.some(p => p.amount > 0)
}

export function canModifyInvoice(invoice: Invoice): boolean {
  if (invoice.invoiceType === 'credit_note') return false
  if (invoice.invoiceStatus === 'draft' || invoice.invoiceStatus === 'cancelled') return false
  if (isGstFiled(invoice)) return false
  if (hasClientPayment(invoice)) return false
  return true
}

export function canCancelInvoice(invoice: Invoice): boolean {
  return canModifyInvoice(invoice)
}

export function canCreateCreditNote(invoice: Invoice): boolean {
  if (invoice.invoiceType === 'credit_note') return false
  if (invoice.invoiceStatus === 'draft' || invoice.invoiceStatus === 'cancelled') return false
  if (isGstFiled(invoice)) return true
  return hasClientPayment(invoice)
}

/** Extra expenses on the same case — not a correction path. */
export function canCreateSecondaryInvoice(invoice: Invoice): boolean {
  if (invoice.invoiceType === 'credit_note') return false
  if (invoice.invoiceStatus === 'draft' || invoice.invoiceStatus === 'cancelled') return false
  return true
}

export function canCreateRevisedInvoice(invoice: Invoice): boolean {
  if (invoice.invoiceType === 'credit_note') {
    return Boolean(invoice.sourceInvoiceId)
  }
  return invoice.invoiceStatus === 'cancelled'
}

export type InvoiceCorrectionKind = 'modify' | 'cancel' | 'credit_note' | 'none'

export function getInvoiceCorrectionKind(invoice: Invoice): InvoiceCorrectionKind {
  if (canModifyInvoice(invoice)) return 'modify'
  if (canCreateCreditNote(invoice)) return 'credit_note'
  return 'none'
}
