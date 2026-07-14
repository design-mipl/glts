import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import {
  quotationPipelineStatusLabel,
  quotationSharedStatusLabel,
  quotationSourceTypeLabel,
  workflowTypeLabel,
} from '../config/quotationStatusConfig'

export interface QuotationAdvancedFilterState {
  quotationNo: string
  companyName: string
  workflowType: string
  status: string
  sharedStatus: string
  dateFrom: string
  dateTo: string
}

export const INITIAL_QUOTATION_ADVANCED_FILTERS: QuotationAdvancedFilterState = {
  quotationNo: '',
  companyName: '',
  workflowType: 'all',
  status: 'all',
  sharedStatus: 'all',
  dateFrom: '',
  dateTo: '',
}

export function matchesQuotationSearch(record: QuotationRecord, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const version = getCurrentVersion(record)
  return (
    record.quotationNo.toLowerCase().includes(q) ||
    record.id.toLowerCase().includes(q) ||
    record.customer.companyName.toLowerCase().includes(q) ||
    record.customer.contactPersonName.toLowerCase().includes(q) ||
    quotationSourceTypeLabel[record.sourceType].toLowerCase().includes(q) ||
    workflowTypeLabel[record.workflowType].toLowerCase().includes(q) ||
    quotationPipelineStatusLabel[record.status].toLowerCase().includes(q) ||
    (version?.versionLabel.toLowerCase().includes(q) ?? false)
  )
}

export function matchesQuotationAdvancedFilters(
  record: QuotationRecord,
  filters: QuotationAdvancedFilterState,
): boolean {
  if (filters.quotationNo.trim()) {
    const q = filters.quotationNo.trim().toLowerCase()
    if (!record.quotationNo.toLowerCase().includes(q) && !record.id.toLowerCase().includes(q)) return false
  }
  if (filters.companyName.trim()) {
    const q = filters.companyName.trim().toLowerCase()
    if (!record.customer.companyName.toLowerCase().includes(q)) return false
  }
  if (filters.workflowType !== 'all' && record.workflowType !== filters.workflowType) return false
  if (filters.status !== 'all' && record.status !== filters.status) return false
  if (filters.sharedStatus !== 'all' && record.sharedStatus !== filters.sharedStatus) return false
  if (filters.dateFrom && record.createdAt.slice(0, 10) < filters.dateFrom) return false
  if (filters.dateTo && record.createdAt.slice(0, 10) > filters.dateTo) return false
  return true
}

export function getQuotationCellValue(record: QuotationRecord, columnKey: string): string {
  const version = getCurrentVersion(record)
  switch (columnKey) {
    case 'quotationNo':
      return record.quotationNo
    case 'companyName':
      return record.customer.companyName
    case 'sourceType':
      return quotationSourceTypeLabel[record.sourceType]
    case 'workflowType':
      return workflowTypeLabel[record.workflowType]
    case 'status':
      return quotationPipelineStatusLabel[record.status]
    case 'totalAmount':
      return version ? formatInr(version.totals.grandTotal) : '—'
    case 'currentVersion':
      return version?.versionLabel ?? '—'
    case 'versionCount':
      return String(record.pricingVersions.length)
    case 'sharedStatus':
      return quotationSharedStatusLabel[record.sharedStatus]
    case 'validTill':
      return record.validTill || '—'
    case 'createdAt':
      return new Date(record.createdAt).toLocaleDateString()
    default:
      return ''
  }
}

export function hasActiveQuotationFilters(filters: QuotationAdvancedFilterState): boolean {
  return (
    Boolean(filters.quotationNo.trim()) ||
    Boolean(filters.companyName.trim()) ||
    filters.workflowType !== 'all' ||
    filters.status !== 'all' ||
    filters.sharedStatus !== 'all' ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo)
  )
}

export function getQuotationEmptyState(hasSearch: boolean) {
  if (hasSearch) {
    return {
      emptyTitle: 'No quotations match your search',
      emptyDescription: 'Try adjusting filters or search terms.',
    }
  }
  return {
    emptyTitle: 'No quotations yet',
    emptyDescription: 'Create a direct quotation or convert an enquiry to get started.',
    emptyAction: { label: 'Create Quotation' },
  }
}

export function mapQuotationRowsToGridItems(rows: QuotationRecord[]) {
  return rows.map((row) => {
    const version = getCurrentVersion(row)
    return {
      id: row.id,
      title: row.quotationNo,
      subtitle: row.customer.companyName,
      meta: [
        quotationPipelineStatusLabel[row.status],
        quotationSourceTypeLabel[row.sourceType],
        `${row.pricingVersions.length} version(s)`,
      ].join(' · '),
      badge: version ? formatInr(version.totals.grandTotal) : '—',
      status: quotationPipelineStatusLabel[row.status],
    }
  })
}

export function downloadQuotationCsv(rows: QuotationRecord[]) {
  const header = [
    'Quotation No',
    'Company',
    'Type',
    'Workflow',
    'Status',
    'Total',
    'Current Version',
    'Versions',
    'Shared',
    'Valid Till',
    'Created',
  ]
  const lines = rows.map((r) => {
    const version = getCurrentVersion(r)
    return [
      r.quotationNo,
      r.customer.companyName,
      quotationSourceTypeLabel[r.sourceType],
      workflowTypeLabel[r.workflowType],
      quotationPipelineStatusLabel[r.status],
      version ? String(version.totals.grandTotal) : '',
      version?.versionLabel ?? '',
      String(r.pricingVersions.length),
      quotationSharedStatusLabel[r.sharedStatus],
      r.validTill,
      new Date(r.createdAt).toLocaleDateString(),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  })
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'quotations.csv'
  a.click()
  URL.revokeObjectURL(url)
}
