import type { ReconciliationFilters, ReconciliationItem, ReconciliationTab } from '@/shared/types/reconciliation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { RECONCILIATION_PERIOD_OPTIONS } from '../config/reconciliationListingConfig'

export const EMPTY_RECONCILIATION_FILTERS: ReconciliationFilters = {
  period: 'ytd',
  customFrom: '',
  customTo: '',
  paymentMode: '',
  status: '',
}

export function hasReconciliationFiltersActive(
  filters: ReconciliationFilters,
  tab: ReconciliationTab,
): boolean {
  if (filters.period !== 'ytd') return true
  if (filters.period === 'custom' && (filters.customFrom || filters.customTo)) return true
  if (filters.status) return true
  if (tab === 'mode_of_payment' && filters.paymentMode) return true
  return false
}

export function getReconciliationPeriodLabel(filters: ReconciliationFilters): string {
  const option = RECONCILIATION_PERIOD_OPTIONS.find(item => item.value === filters.period)
  if (filters.period === 'custom' && (filters.customFrom || filters.customTo)) {
    return `${filters.customFrom || '…'} → ${filters.customTo || '…'}`
  }
  return option?.label ?? 'Period'
}

export function getReconciliationCellValue(row: ReconciliationItem, key: string): string | number {
  const value = row[key as keyof ReconciliationItem]
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value == null ? '' : String(value)
}

export function matchesReconciliationSearch(row: ReconciliationItem, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [
    row.refNo,
    row.passengerName,
    row.client,
    row.vendor,
    row.bookedBy,
    row.consultant,
    row.visaCountry,
    row.policyNumber,
    row.trackingNumber,
    row.chargesName,
    row.claimNumber,
    row.referenceNumber,
    row.acEntryNo,
    row.paymentMode,
    row.staffName,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function computeReconciliationKpis(rows: ReconciliationItem[]) {
  const pending = rows.filter(row => row.status === 'pending').length
  const submitted = rows.filter(row => row.status === 'submitted').length
  const totalAmount = rows.reduce((sum, row) => sum + (row.total || row.amountInr || 0), 0)
  return {
    total: rows.length,
    pending,
    submitted,
    totalAmount,
  }
}

export function getReconciliationEmptyState(tab: ReconciliationTab, hasSearch: boolean) {
  if (hasSearch) {
    return {
      title: 'No matching records',
      description: 'Try a different search or clear filters.',
    }
  }
  const labels: Record<ReconciliationTab, string> = {
    approved_claim_sheet: 'approved claim sheets',
    insurance: 'insurance expenses',
    ticket: 'ticket expenses',
    courier: 'courier expenses',
    mode_of_payment: 'payment records',
  }
  return {
    title: `No ${labels[tab]} in this period`,
    description: 'Adjust the period filter or check expense / claim sheet data.',
  }
}

export function downloadReconciliationCsv(rows: ReconciliationItem[], tab: ReconciliationTab) {
  const headersByTab: Record<ReconciliationTab, string[]> = {
    approved_claim_sheet: [
      'Claim number',
      'GLTS No',
      'Passenger',
      'Client',
      'Visa country',
      'Team',
      'Reviewed',
      'Case total',
      'Claim total',
      'Status',
      'Settlement reference',
    ],
    insurance: [
      'RefNo',
      'GLTS creation date',
      'PassengerName',
      'Client',
      'BookedBy',
      'Consultant',
      'VisaCountry',
      'Vendor',
      'Insurance booking date',
      'Policy number',
      'Vendor Invoice number',
      'Cost',
      'Markup',
      'Total',
      'Status',
    ],
    ticket: [
      'RefNo',
      'GLTS Creation date',
      'PassengerName',
      'Client',
      'Booker',
      'Consultant',
      'VisaCountry',
      'Vendor',
      'Ticket Booking date',
      'Cost',
      'Markup',
      'Total',
      'Locations of Ticket bookings',
      'Status',
    ],
    courier: [
      'RefNo',
      'GLTS Creation date',
      'PassengerName',
      'Client',
      'Booker',
      'Consultant',
      'VisaCountry',
      'Vendor',
      'Courier booking date',
      'Tracking no (AWB)',
      'Courier Booked by GLTS staff',
      'Cost',
      'Markup',
      'Total',
      'Locations of Courier',
      'Status',
    ],
    mode_of_payment: [
      'GLTS No',
      'Passenger Name',
      'Country',
      'Charges Name',
      'Vendor Name',
      'Payment Date',
      'Mode of payment',
      'Card Used',
      'Amount in INR',
      'Foreign Currency Amount',
      'Staff Name',
      'AC Person Name',
      'AC Entry No',
      'Status',
    ],
  }

  const headers = headersByTab[tab]
  const lines = rows.map(row => {
    switch (tab) {
      case 'approved_claim_sheet':
        return [
          row.claimNumber,
          row.refNo,
          row.passengerName,
          row.client,
          row.visaCountry,
          row.claimTeam,
          row.claimReviewedAt,
          row.total,
          row.claimGrandTotal,
          row.status,
          row.referenceNumber,
        ]
      case 'insurance':
        return [
          row.refNo,
          row.gltsCreationDate,
          row.passengerName,
          row.client,
          row.bookedBy,
          row.consultant,
          row.visaCountry,
          row.vendor,
          row.bookingDate,
          row.policyNumber,
          row.vendorInvoiceNumber,
          row.cost,
          row.markup,
          row.total,
          row.status,
        ]
      case 'ticket':
        return [
          row.refNo,
          row.gltsCreationDate,
          row.passengerName,
          row.client,
          row.bookedBy,
          row.consultant,
          row.visaCountry,
          row.vendor,
          row.bookingDate,
          row.cost,
          row.markup,
          row.total,
          `${row.locationFrom} → ${row.locationTo}`,
          row.status,
        ]
      case 'courier':
        return [
          row.refNo,
          row.gltsCreationDate,
          row.passengerName,
          row.client,
          row.bookedBy,
          row.consultant,
          row.visaCountry,
          row.vendor,
          row.bookingDate,
          row.trackingNumber,
          row.courierBookedBy,
          row.cost,
          row.markup,
          row.total,
          `${row.locationFrom} → ${row.locationTo}`,
          row.status,
        ]
      case 'mode_of_payment':
        return [
          row.refNo,
          row.passengerName,
          row.visaCountry,
          row.chargesName,
          row.vendor,
          row.paymentDate,
          row.paymentMode,
          row.cardUsed,
          row.amountInr,
          row.foreignCurrencyAmount,
          row.staffName,
          row.acPersonName,
          row.acEntryNo || row.referenceNumber,
          row.status,
        ]
      default:
        return []
    }
  })

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
  link.download = `reconciliation-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function formatReconciliationMoney(value: number): string {
  return formatInr(value)
}
