import type { InvoiceStatus, InvoiceType, PaymentStatus } from '@/shared/types/invoice'

export type BadgeColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'

export const invoiceTypeLabel: Record<InvoiceType, string> = {
  single_application: 'Single application',
  batch: 'Batch',
  cumulative: 'Cumulative',
  service_wise: 'Service-wise',
  additional_expense: 'Additional expense',
  final_settlement: 'Final settlement',
  credit_note: 'Credit note',
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  generated: 'Generated',
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
}

export const billingModeLabel = {
  single: 'Single',
  batch: 'Batch',
  cumulative: 'Cumulative',
  service_wise: 'Service-wise',
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
    case 'generated':
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
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'neutral'
  }
}

export const INVOICE_TYPE_OPTIONS = Object.entries(invoiceTypeLabel).map(([value, label]) => ({
  value,
  label,
}))

export const INVOICE_STATUS_OPTIONS = Object.entries(invoiceStatusLabel).map(([value, label]) => ({
  value,
  label,
}))

export const PAYMENT_STATUS_OPTIONS = Object.entries(paymentStatusLabel).map(([value, label]) => ({
  value,
  label,
}))
