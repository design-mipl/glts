import type { GstRate } from '@/shared/types/taxMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

export function getGstRateCellValue(row: GstRate, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'createdAt') return formatMasterDate(row.createdAt)
  if (key === 'updatedAt') return formatMasterDate(row.updatedAt)
  if (key === 'ratePercent') return `${row.ratePercent}%`
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesGstRateSearch(row: GstRate, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.slabName,
    row.description,
    String(row.ratePercent),
    row.status,
    row.createdBy,
    row.updatedBy,
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getGstRateEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No GST rates found',
    emptyDescription: 'Add a GST slab to use across invoicing and service tax mapping.',
    emptyAction: { label: 'Add rate', onClick: onCreate },
  }
}

export function downloadGstRateCsv(rows: GstRate[]) {
  const headers = ['Slab Name', 'Rate %', 'Description', 'Status', 'Created By', 'Updated By']
  const lines = rows.map((row) =>
    [
      row.slabName,
      row.ratePercent,
      row.description.replace(/"/g, '""'),
      masterStatusLabel[row.status],
      row.createdBy,
      row.updatedBy,
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `gst-rates-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
