import { sacCodeMasterService } from '@/shared/services/sacCodeMasterService'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function formatServicePrice(row: ServiceMaster): string {
  if (row.defaultPrice == null) return '—'
  return `₹${row.defaultPrice.toLocaleString('en-IN')}`
}

export function getServiceSacLabel(row: ServiceMaster): string {
  if (!row.mappedSacCodeId) return '—'
  const sac = sacCodeMasterService.getById(row.mappedSacCodeId)
  return sac ? `${sac.sacCode} · ${sac.sacTitle}` : '—'
}

export function getServiceCellValue(row: ServiceMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  if (key === 'defaultPrice') {
    return row.defaultPrice == null ? '' : String(row.defaultPrice).padStart(12, '0')
  }
  if (key === 'mappedSacCode') return getServiceSacLabel(row)
  if (key === 'gstRate') return taxMasterService.getGstLabel(row.gstRateId)
  if (key === 'applicableFor') {
    return row.applicableFor
      .map(
        (value) =>
          MASTER_APPLICABILITY_OPTIONS.find((option) => option.value === value)?.label ?? value,
      )
      .join(', ')
  }
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesServiceSearch(row: ServiceMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.serviceName,
    row.description,
    getServiceSacLabel(row),
    taxMasterService.getGstLabel(row.gstRateId),
    row.status,
    ...row.applicableFor.map(
      (value) =>
        MASTER_APPLICABILITY_OPTIONS.find((option) => option.value === value)?.label ?? value,
    ),
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getServiceEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No fees found',
    emptyDescription: 'Add a GLTS fee to use in quotations, invoices, and billing.',
    emptyAction: { label: 'Add fee', onClick: onCreate },
  }
}

export function downloadServiceCsv(rows: ServiceMaster[]) {
  const headers = [
    'Fee Name',
    'Price',
    'SAC',
    'GST',
    'Applicable For',
    'Status',
  ]
  const lines = rows.map((row) =>
    [
      row.serviceName,
      row.defaultPrice ?? '',
      getServiceSacLabel(row),
      taxMasterService.getGstLabel(row.gstRateId),
      getServiceCellValue(row, 'applicableFor'),
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
  link.download = `glts-fee-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
