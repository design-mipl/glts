import type { VendorBillingSummaryRow } from '@/shared/types/vendorBilling'
import type { VendorCharge } from '@/shared/types/vendorBilling'
import type { VendorBillingBill, VendorBillingPayment } from '@/shared/types/vendorBilling'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export function matchesVendorBillingSummarySearch(row: VendorBillingSummaryRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    row.vendorName.toLowerCase().includes(q) ||
    row.vendorId.toLowerCase().includes(q) ||
    row.id.toLowerCase().includes(q)
  )
}

export function getVendorBillingSummaryCellValue(row: VendorBillingSummaryRow, key: string): string {
  switch (key) {
    case 'vendorName':
      return row.vendorName
    case 'vendorId':
      return row.vendorId
    case 'awaitingInvoiceCount':
      return String(row.awaitingInvoiceCount)
    case 'billsCount':
      return String(row.billsCount)
    case 'outstandingAmount':
      return formatInr(row.outstandingAmount)
    case 'lastInvoiceDate':
      return row.lastInvoiceDate ?? ''
    case 'lastPaymentDate':
      return row.lastPaymentDate ?? ''
    case 'status':
      return row.status
    default:
      return ''
  }
}

export function getAwaitingInvoiceCellValue(row: VendorCharge, key: string): string {
  switch (key) {
    case 'applicationId':
      return row.applicationId
    case 'companyName':
      return row.companyName ?? ''
    case 'applicantName':
      return row.applicantName ?? ''
    case 'serviceName':
      return row.serviceName
    case 'amount':
      return String(row.amount)
    case 'completedAt':
      return row.completedAt
    default:
      return ''
  }
}

export function matchesAwaitingInvoiceSearch(row: VendorCharge, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.chargeReference,
    row.applicationId,
    row.companyName,
    row.applicantName,
    row.serviceName,
    row.serviceType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getVendorBillCellValue(row: VendorBillingBill, key: string): string {
  switch (key) {
    case 'billNumber':
      return row.billNumber
    case 'vendorInvoiceNumber':
      return row.vendorInvoiceNumber
    case 'invoiceDate':
      return row.invoiceDate
    case 'dueDate':
      return row.dueDate
    case 'invoiceAmount':
      return String(row.invoiceAmount)
    case 'paidAmount':
      return String(row.paidAmount)
    case 'workflowStatus':
      return row.workflowStatus
    case 'paymentStatus':
      return row.paymentStatus
    default:
      return ''
  }
}

export function matchesVendorBillSearch(row: VendorBillingBill, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [row.billNumber, row.vendorInvoiceNumber, row.remarks]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getVendorPaymentCellValue(row: VendorBillingPayment, key: string): string {
  switch (key) {
    case 'paymentNumber':
      return row.paymentNumber
    case 'vendorInvoiceNumber':
      return row.vendorInvoiceNumber
    case 'paymentDate':
      return row.paymentDate
    case 'amount':
      return String(row.amount)
    case 'paymentMode':
      return row.paymentMode
    case 'transactionReference':
      return row.transactionReference
    case 'status':
      return row.status
    default:
      return ''
  }
}

export function matchesVendorPaymentSearch(row: VendorBillingPayment, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.paymentNumber,
    row.vendorInvoiceNumber,
    row.transactionReference,
    row.paymentMode,
    row.remarks,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function downloadVendorBillingSummaryCsv(rows: VendorBillingSummaryRow[]) {
  const headers = [
    'Vendor ID',
    'Vendor Name',
    'Awaiting Invoice',
    'Open Bills',
    'Outstanding',
    'Last Invoice Date',
    'Last Payment Date',
    'Status',
  ]
  const lines = rows.map(row =>
    [
      row.vendorId,
      row.vendorName,
      row.awaitingInvoiceCount,
      row.billsCount,
      row.outstandingAmount,
      row.lastInvoiceDate ?? '',
      row.lastPaymentDate ?? '',
      row.status,
    ].join(','),
  )
  const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'vendor-billing-summary.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}

export function computeVendorBillingKpis(rows: VendorBillingSummaryRow[]) {
  return {
    totalVendors: rows.length,
    awaitingInvoiceTotal: rows.reduce((sum, r) => sum + r.awaitingInvoiceCount, 0),
    totalOutstanding: rows.reduce((sum, r) => sum + r.outstandingAmount, 0),
    vendorsWithOutstanding: rows.filter(r => r.outstandingAmount > 0).length,
  }
}

export function mapVendorBillingSummaryToGridItems(rows: VendorBillingSummaryRow[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.vendorName,
    subtitle: row.vendorId,
    meta: `${row.awaitingInvoiceCount} awaiting · ${formatInr(row.outstandingAmount)} outstanding`,
    badge: row.status === 'active' ? 'Active' : 'Inactive',
  }))
}
