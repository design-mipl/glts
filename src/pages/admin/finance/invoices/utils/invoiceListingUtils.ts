import type { Invoice, InvoiceListFilters } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  billingModeLabel,
  invoiceStatusLabel,
  invoiceTypeLabel,
  paymentStatusLabel,
} from '../config/invoiceStatusConfig'
import type { InvoiceListingTab } from '../config/invoiceListingTabs'

export interface InvoiceAdvancedFilterState {
  company: string
  billingEntity: string
  vessel: string
  billingMode: string
  applicationId: string
  batchId: string
  invoiceType: string
  invoiceStatus: string
  paymentStatus: string
  country: string
  visaType: string
  dateFrom: string
  dateTo: string
}

export const EMPTY_INVOICE_ADVANCED_FILTERS: InvoiceAdvancedFilterState = {
  company: '',
  billingEntity: '',
  vessel: '',
  billingMode: '',
  applicationId: '',
  batchId: '',
  invoiceType: '',
  invoiceStatus: '',
  paymentStatus: '',
  country: '',
  visaType: '',
  dateFrom: '',
  dateTo: '',
}

export function matchesInvoiceSearch(record: Invoice, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    record.invoiceId.toLowerCase().includes(q) ||
    record.companyName.toLowerCase().includes(q) ||
    record.billingEntity.toLowerCase().includes(q) ||
    (record.vesselName ?? '').toLowerCase().includes(q) ||
    (record.poReference ?? '').toLowerCase().includes(q) ||
    record.gltsReferences.some(r => r.toLowerCase().includes(q)) ||
    record.batchIds.some(b => b.toLowerCase().includes(q))
  )
}

export function applyInvoiceAdvancedFilters(
  rows: Invoice[],
  filters: InvoiceAdvancedFilterState,
): Invoice[] {
  return rows.filter(row => {
    if (filters.company && !row.companyName.toLowerCase().includes(filters.company.toLowerCase())) return false
    if (filters.billingEntity && !row.billingEntity.toLowerCase().includes(filters.billingEntity.toLowerCase()))
      return false
    if (filters.vessel && !(row.vesselName ?? '').toLowerCase().includes(filters.vessel.toLowerCase())) return false
    if (filters.billingMode && row.billingMode !== filters.billingMode) return false
    if (filters.applicationId && !row.gltsReferences.some(r => r.toLowerCase().includes(filters.applicationId.toLowerCase())))
      return false
    if (filters.batchId && !row.batchIds.some(b => b.toLowerCase().includes(filters.batchId.toLowerCase()))) return false
    if (filters.invoiceType && row.invoiceType !== filters.invoiceType) return false
    if (filters.invoiceStatus && row.invoiceStatus !== filters.invoiceStatus) return false
    if (filters.paymentStatus && row.paymentStatus !== filters.paymentStatus) return false
    if (filters.country && !(row.country ?? '').toLowerCase().includes(filters.country.toLowerCase())) return false
    if (filters.visaType && !(row.visaType ?? '').toLowerCase().includes(filters.visaType.toLowerCase())) return false
    if (filters.dateFrom && row.invoiceDate < filters.dateFrom) return false
    if (filters.dateTo && row.invoiceDate > filters.dateTo) return false
    return true
  })
}

export function advancedFiltersToServiceFilters(
  filters: InvoiceAdvancedFilterState,
): InvoiceListFilters {
  return {
    company: filters.company || undefined,
    billingEntity: filters.billingEntity || undefined,
    vessel: filters.vessel || undefined,
    billingMode: (filters.billingMode || 'all') as InvoiceListFilters['billingMode'],
    applicationId: filters.applicationId || undefined,
    batchId: filters.batchId || undefined,
    invoiceType: (filters.invoiceType || 'all') as InvoiceListFilters['invoiceType'],
    invoiceStatus: (filters.invoiceStatus || 'all') as InvoiceListFilters['invoiceStatus'],
    paymentStatus: (filters.paymentStatus || 'all') as InvoiceListFilters['paymentStatus'],
    country: filters.country || undefined,
    visaType: filters.visaType || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  }
}

export function getInvoiceCellValue(record: Invoice, columnKey: string): string {
  switch (columnKey) {
    case 'invoiceId':
      return record.invoiceId
    case 'billingMode':
      return billingModeLabel[record.billingMode]
    case 'invoiceType':
      return invoiceTypeLabel[record.invoiceType]
    case 'companyName':
      return record.companyName
    case 'billingEntity':
      return record.billingEntity
    case 'vessel':
      return record.vesselName ?? '—'
    case 'gltsReference':
      return record.gltsReferences.join(', ') || '—'
    case 'batchId':
      return record.batchIds.join(', ') || '—'
    case 'totalApplications':
      return String(record.totalApplications)
    case 'invoiceAmount':
      return formatInr(record.totals.finalAmount)
    case 'advanceAdjusted':
      return formatInr(record.totals.advanceAdjusted)
    case 'balancePayable':
      return formatInr(record.totals.balancePayable)
    case 'invoiceStatus':
      return invoiceStatusLabel[record.invoiceStatus]
    case 'paymentStatus':
      return paymentStatusLabel[record.paymentStatus]
    case 'invoiceDate':
      return record.invoiceDate
    case 'dueDate':
      return record.dueDate
    case 'lastUpdated':
      return new Date(record.lastUpdated).toLocaleDateString()
    default:
      return ''
  }
}

export function downloadInvoiceCsv(records: Invoice[]) {
  const headers = [
    'Invoice ID',
    'Billing Mode',
    'Invoice Type',
    'Company',
    'Billing Entity',
    'Vessel',
    'GLTS Reference',
    'Batch ID',
    'Total Applications',
    'Invoice Amount',
    'Advance Adjusted',
    'Balance Payable',
    'Invoice Status',
    'Payment Status',
    'Invoice Date',
    'Due Date',
    'Last Updated',
  ]
  const rows = records.map(r =>
    [
      r.invoiceId,
      billingModeLabel[r.billingMode],
      invoiceTypeLabel[r.invoiceType],
      r.companyName,
      r.billingEntity,
      r.vesselName ?? '',
      r.gltsReferences.join(';'),
      r.batchIds.join(';'),
      r.totalApplications,
      r.totals.finalAmount,
      r.totals.advanceAdjusted,
      r.totals.balancePayable,
      invoiceStatusLabel[r.invoiceStatus],
      paymentStatusLabel[r.paymentStatus],
      r.invoiceDate,
      r.dueDate,
      r.lastUpdated,
    ].join(','),
  )
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'invoices-export.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function mapInvoiceRowsToGridItems(records: Invoice[]) {
  return records.map(r => ({
    id: r.id,
    title: r.invoiceId,
    subtitle: r.companyName,
    badge: invoiceStatusLabel[r.invoiceStatus],
    meta: `${invoiceTypeLabel[r.invoiceType]} · ${formatInr(r.totals.finalAmount)}`,
  }))
}

export function getInvoiceEmptyState(tab: InvoiceListingTab, hasSearch: boolean) {
  const tabLabel =
    tab === 'draft'
      ? 'draft invoices'
      : tab === 'submitted'
        ? 'submitted invoices'
        : tab === 'overdue'
          ? 'overdue invoices'
          : tab === 'credit_notes'
            ? 'credit notes'
            : 'invoices'

  return {
    emptyTitle: hasSearch ? 'No invoices match your search' : `No ${tabLabel} yet`,
    emptyDescription: hasSearch
      ? 'Try adjusting search or filters.'
      : 'Generate an invoice from billable applications to get started.',
    emptyAction: hasSearch ? undefined : { label: 'Generate invoice', onClick: () => {} },
  }
}

export function getInvoiceFilterOptions(rows: Invoice[]) {
  const companies = [...new Set(rows.map(r => r.companyName))].sort()
  const billingEntities = [...new Set(rows.map(r => r.billingEntity))].sort()
  const vessels = [...new Set(rows.map(r => r.vesselName).filter(Boolean) as string[])].sort()
  const countries = [...new Set(rows.map(r => r.country).filter(Boolean) as string[])].sort()
  const visaTypes = [...new Set(rows.map(r => r.visaType).filter(Boolean) as string[])].sort()
  return { companies, billingEntities, vessels, countries, visaTypes }
}
