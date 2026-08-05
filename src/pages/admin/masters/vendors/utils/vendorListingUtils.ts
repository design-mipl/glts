import type { Vendor } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { paymentTermsLabel } from '../config/paymentTermsConfig'
import { vendorCategoryLabel } from '../config/vendorCategoryConfig'
import { vendorStatusLabel, vendorTypeLabel } from '../config/vendorStatusConfig'

export function matchesVendorSearch(record: Vendor, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    record.vendorName.toLowerCase().includes(q) ||
    record.vendorId.toLowerCase().includes(q) ||
    record.id.toLowerCase().includes(q) ||
    record.contactPerson.toLowerCase().includes(q) ||
    record.emailAddress.toLowerCase().includes(q) ||
    vendorCategoryLabel[record.vendorCategory].toLowerCase().includes(q)
  )
}

export function getVendorCellValue(record: Vendor, columnKey: string): string {
  switch (columnKey) {
    case 'vendorId':
      return record.vendorId
    case 'vendorName':
      return record.vendorName
    case 'vendorCategory':
      return vendorCategoryLabel[record.vendorCategory]
    case 'vendorType':
      return vendorTypeLabel[record.vendorType]
    case 'servicesCount':
      return String(record.serviceMappings.length)
    case 'gstStatus':
      return record.gstApplicable ? 'GST Applicable' : 'No GST'
    case 'paymentTerms':
      return paymentTermsLabel[record.commercial.paymentTerms]
    case 'outstandingAmount':
      return formatInr(record.outstandingAmount)
    case 'status':
      return vendorStatusLabel[record.status]
    case 'updatedAt':
      return new Date(record.updatedAt).toLocaleDateString()
    default:
      return ''
  }
}

export function downloadVendorCsv(records: Vendor[]) {
  const headers = [
    'Vendor ID',
    'Vendor Name',
    'Category',
    'Type',
    'Services',
    'GST',
    'Payment Terms',
    'Outstanding',
    'Status',
    'Last Updated',
  ]
  const rows = records.map((r) =>
    [
      r.vendorId,
      r.vendorName,
      vendorCategoryLabel[r.vendorCategory],
      vendorTypeLabel[r.vendorType],
      r.serviceMappings.length,
      r.gstApplicable ? 'Yes' : 'No',
      paymentTermsLabel[r.commercial.paymentTerms],
      r.outstandingAmount,
      vendorStatusLabel[r.status],
      r.updatedAt,
    ].join(','),
  )
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'vendors-export.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function mapVendorRowsToGridItems(records: Vendor[]) {
  return records.map((r) => ({
    id: r.id,
    title: r.vendorName,
    subtitle: r.vendorId,
    badge: vendorStatusLabel[r.status],
    meta: `${vendorCategoryLabel[r.vendorCategory]} · ${r.serviceMappings.length} services · ${formatInr(r.outstandingAmount)} outstanding`,
  }))
}

export function getVendorEmptyState(hasSearch: boolean) {
  return {
    emptyTitle: hasSearch ? 'No vendors match your search' : 'No vendors yet',
    emptyDescription: hasSearch
      ? 'Try a different search term or clear filters.'
      : 'Add your first operational or financial vendor.',
    emptyAction: hasSearch ? undefined : { label: 'Add vendor', onClick: () => {} },
  }
}
