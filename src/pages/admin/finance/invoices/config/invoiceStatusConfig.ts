import type { InvoiceStatus, InvoiceType, PaymentStatus } from '@/shared/types/invoice'

export type BadgeColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'

export const invoiceTypeLabel: Record<InvoiceType, string> = {
  single_invoice: 'Single invoice',
  cumulative: 'Cumulative invoice',
  additional_expense: 'Additional expense',
  final_settlement: 'Final settlement',
  credit_note: 'Credit note',
}

export const invoiceTypeColor: Record<InvoiceType, BadgeColor> = {
  single_invoice: 'info',
  cumulative: 'success',
  additional_expense: 'error',
  final_settlement: 'primary',
  credit_note: 'secondary',
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  shared: 'Shared',
  partially_paid: 'Partially paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
  failed: 'Failed',
  adjusted: 'Adjusted',
}

export const billingModeLabel = {
  application_wise: 'Application-wise',
  company_wise: 'Company-wise',
} as const

export function invoiceStatusBadgeColor(status: InvoiceStatus): BadgeColor {
  switch (status) {
    case 'paid':
      return 'success'
    case 'overdue':
    case 'cancelled':
      return 'error'
    case 'partially_paid':
    case 'shared':
      return 'warning'
    case 'submitted':
      return 'info'
    default:
      return 'neutral'
  }
}

export function paymentStatusBadgeColor(status: PaymentStatus): BadgeColor {
  switch (status) {
    case 'paid':
      return 'success'
    case 'partial':
    case 'adjusted':
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'neutral'
  }
}

export const INVOICE_TYPE_OPTIONS = Object.entries(invoiceTypeLabel)
  .filter(([value]) => value !== 'credit_note')
  .map(([value, label]) => ({ value, label }))

export const INVOICE_STATUS_OPTIONS = Object.entries(invoiceStatusLabel).map(([value, label]) => ({
  value,
  label,
}))

export const PAYMENT_STATUS_OPTIONS = Object.entries(paymentStatusLabel).map(([value, label]) => ({
  value,
  label,
}))

export const BILLING_MODE_OPTIONS = Object.entries(billingModeLabel).map(([value, label]) => ({
  value,
  label,
}))
