import { sacCodeMasterService } from '@/shared/services/sacCodeMasterService'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
export function formatServicePrice(row: ServiceMaster): string {
  if (row.defaultPrice == null) return '—'
  return row.defaultPrice.toLocaleString()
}

export function getServiceSacLabel(row: ServiceMaster): string {
  if (!row.mappedSacCodeId) return '—'
  const sac = sacCodeMasterService.getById(row.mappedSacCodeId)
  return sac ? `${sac.sacCode} · ${sac.sacTitle}` : '—'
}

export function getServiceCellValue(row: ServiceMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'defaultPrice') return formatServicePrice(row)
  if (key === 'mappedSacCode') return getServiceSacLabel(row)
  if (key === 'gstRate') return taxMasterService.getGstLabel(row.gstRateId)
  if (key === 'tdsSection') return taxMasterService.getTdsLabel(row.tdsSectionId)
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesServiceSearch(row: ServiceMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.serviceCode,
    row.serviceName,
    row.description,
    row.category,
    row.subcategory,
    getServiceSacLabel(row),
    row.status,
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getServiceEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No services found',
    emptyDescription: 'Add a service to use in quotations, invoices, and billing.',
    emptyAction: { label: 'Add service', onClick: onCreate },
  }
}

export function downloadServiceCsv(rows: ServiceMaster[]) {
  const headers = [
    'Service Code',
    'Service Name',
    'Category',
    'Subcategory',
    'Price',
    'SAC',
    'Status',
  ]
  const lines = rows.map((row) =>
    [
      row.serviceCode,
      row.serviceName,
      row.category,
      row.subcategory,
      row.defaultPrice ?? '',
      getServiceSacLabel(row),
      masterStatusLabel[row.status],
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `service-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
