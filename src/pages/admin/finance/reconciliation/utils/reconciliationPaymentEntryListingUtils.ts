import type { ReconciliationPaymentEntryRow, ReconciliationStatus } from '@/shared/types/reconciliation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getReconciliationPaymentModeLabel,
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'

export function matchesReconciliationPaymentEntrySearch(
  row: ReconciliationPaymentEntryRow,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return [
    row.refNo,
    row.passengerName,
    row.client,
    row.visaCountry,
    row.paymentReferenceNumber,
    row.cardUsed,
    row.staffName,
    row.servicesSummary,
    getReconciliationPaymentModeLabel(row.paymentMode),
    row.referenceNumber,
    row.reconciledBy,
    getReconciliationStatusLabel(row.status),
    ...row.services.map(service => `${service.serviceName} ${service.vendorName ?? ''}`),
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getReconciliationPaymentEntryCellValue(
  row: ReconciliationPaymentEntryRow,
  key: string,
): string {
  switch (key) {
    case 'refNo':
      return row.refNo
    case 'passengerName':
      return row.passengerName
    case 'client':
      return row.client
    case 'visaCountry':
      return row.visaCountry
    case 'servicesSummary':
      return row.servicesSummary
    case 'serviceCount':
      return String(row.serviceCount)
    case 'paymentDate':
      return row.paymentDate
    case 'paymentMode':
      return getReconciliationPaymentModeLabel(row.paymentMode)
    case 'paymentReferenceNumber':
      return row.paymentReferenceNumber || '—'
    case 'cardUsed':
      return row.cardUsed || '—'
    case 'amountInr':
      return formatInr(row.amountInr)
    case 'foreignCurrencyAmount':
      return row.foreignCurrencyAmount > 0 ? row.foreignCurrencyAmount.toFixed(2) : '—'
    case 'staffName':
      return row.staffName
    case 'reconciliationStatus':
      return getReconciliationStatusLabel(row.status)
    case 'reconciledBy':
      return row.reconciledBy || '—'
    default:
      return ''
  }
}

export function computePaymentEntryReconciliationKpis(rows: ReconciliationPaymentEntryRow[]) {
  const pending = rows.filter(row => row.status === 'pending').length
  const submitted = rows.filter(row => row.status === 'submitted').length
  const rejected = rows.filter(row => row.status === 'rejected').length
  const totalAmount = rows.reduce((sum, row) => sum + row.amountInr, 0)
  return {
    total: rows.length,
    pending,
    submitted,
    rejected,
    totalAmount,
  }
}

export function getPaymentEntryReconciliationEmptyState(
  hasSearch: boolean,
  statusTab: ReconciliationStatus = 'pending',
) {
  if (hasSearch) {
    return {
      title: 'No matching payment entries',
      description: 'Try a different search or clear filters.',
    }
  }
  if (statusTab === 'submitted') {
    return {
      title: 'No submitted payment entries in this period',
      description: 'Reconciled payments will appear here after you submit them from Pending.',
    }
  }
  if (statusTab === 'rejected') {
    return {
      title: 'No rejected payment entries in this period',
      description: 'Rejected payments will appear here when you reject a pending item.',
    }
  }
  return {
    title: 'No pending payment entries in this period',
    description:
      'Card and bank transfer payments from Application Management pending payment will appear here.',
  }
}

export function downloadPaymentEntryReconciliationCsv(rows: ReconciliationPaymentEntryRow[]) {
  const headers = [
    'GLTS reference',
    'Passenger name',
    'Client',
    'Country',
    'Services',
    'Service count',
    'Payment date',
    'Mode of payment',
    'Payment reference',
    'Amount in INR',
    'Staff name',
    'Reconciliation status',
    'User',
  ]

  const lines = rows.map(row => [
    row.refNo,
    row.passengerName,
    row.client,
    row.visaCountry,
    row.servicesSummary,
    row.serviceCount,
    row.paymentDate,
    getReconciliationPaymentModeLabel(row.paymentMode),
    row.paymentReferenceNumber,
    row.amountInr,
    row.staffName,
    getReconciliationStatusLabel(row.status),
    row.reconciledBy || '',
  ])

  const escape = (value: string | number) => {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
  }

  const csv = [headers, ...lines].map(line => line.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reconciliation-payment-entries-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function mapPaymentEntryRowsToGridItems(rows: ReconciliationPaymentEntryRow[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.passengerName,
    subtitle: `${row.client} · ${row.servicesSummary}`,
    meta: row.refNo,
    status: getReconciliationStatusLabel(row.status),
    statusColor: (row.status === 'submitted'
      ? 'success'
      : row.status === 'rejected'
        ? 'default'
        : 'warning') as 'success' | 'warning' | 'default',
  }))
}
