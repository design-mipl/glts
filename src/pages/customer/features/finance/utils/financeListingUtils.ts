import type { InvoiceListingRow, CustomerPaymentRow } from '../types/customerFinance.types'
import { getCustomerInvoiceTypeLabel } from './customerInvoiceTypeLabels'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  invoiceStatusLabel,
  paymentStatusLabel,
} from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'

export function getInvoiceListingCellValue(row: InvoiceListingRow, key: string): string {
  const inv = row.invoice
  switch (key) {
    case 'invoiceNumber':
      return inv.invoiceId
    case 'invoiceType':
      return getCustomerInvoiceTypeLabel(inv)
    case 'linkedApplicationsCount':
      return String(row.linkedApplicationsCount)
    case 'bookers':
      return row.bookers.join(', ')
    case 'passengerCrewCount':
      return String(row.passengerCrewCount)
    case 'invoiceDate':
      return inv.invoiceDate
    case 'dueDate':
      return inv.dueDate
    case 'totalAmount':
      return formatInr(inv.totals.finalAmount)
    case 'paidAmount':
      return formatInr(row.paidAmount)
    case 'outstandingAmount':
      return formatInr(row.outstandingAmount)
    case 'status':
      return invoiceStatusLabel[inv.invoiceStatus]
    case 'paymentStatus':
      return paymentStatusLabel[inv.paymentStatus]
    default:
      return ''
  }
}

export function invoiceListingSearchMatch(row: InvoiceListingRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const inv = row.invoice
  return [
    inv.invoiceId,
    getCustomerInvoiceTypeLabel(inv),
    row.bookers.join(' '),
    inv.companyName,
    inv.vesselName ?? '',
    invoiceStatusLabel[inv.invoiceStatus],
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getPaymentListingCellValue(row: CustomerPaymentRow, key: string): string {
  switch (key) {
    case 'paymentDate':
      return row.paymentDate
    case 'receiptNumber':
      return row.receiptNumber
    case 'invoiceNumber':
      return row.invoiceNumber
    case 'amount':
      return formatInr(row.amount)
    case 'paymentMode':
      return row.paymentMode
    case 'transactionReference':
      return row.transactionReference
    case 'status':
      return row.status
    case 'verificationStatus':
      return row.verificationStatus
    default:
      return ''
  }
}

export function paymentListingSearchMatch(row: CustomerPaymentRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.receiptNumber,
    row.invoiceNumber,
    row.paymentMode,
    row.transactionReference,
    row.status,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function buildFinanceExportCsv(
  invoices: InvoiceListingRow[],
  payments: CustomerPaymentRow[],
): string {
  const invHeader = 'Invoice Number,Type,Date,Due Date,Total,Paid,Outstanding,Status'
  const invRows = invoices.map(r =>
    [
      r.invoice.invoiceId,
      getCustomerInvoiceTypeLabel(r.invoice),
      r.invoice.invoiceDate,
      r.invoice.dueDate,
      r.invoice.totals.finalAmount,
      r.paidAmount,
      r.outstandingAmount,
      invoiceStatusLabel[r.invoice.invoiceStatus],
    ].join(','),
  )
  const payHeader = 'Receipt,Invoice,Date,Amount,Mode,Reference,Status'
  const payRows = payments.map(p =>
    [p.receiptNumber, p.invoiceNumber, p.paymentDate, p.amount, p.paymentMode, p.transactionReference, p.status].join(
      ',',
    ),
  )
  return [invHeader, ...invRows, '', payHeader, ...payRows].join('\n')
}
