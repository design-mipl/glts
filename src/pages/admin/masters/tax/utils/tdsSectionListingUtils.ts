import type { TdsSection } from '@/shared/types/taxMaster'
import { getTdsApplicableOnLabel } from '@/shared/services/taxMasterService'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function getTdsSectionCellValue(row: TdsSection, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'applicableOn') return getTdsApplicableOnLabel(row.applicableOn)
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  if (key === 'createdAt') return row.createdAt
  if (key === 'updatedAt') return row.updatedAt
  if (key === 'ratePercent') return String(row.ratePercent).padStart(6, '0')
  if (key === 'thresholdLimit') {
    return row.thresholdLimit != null ? String(row.thresholdLimit).padStart(12, '0') : ''
  }
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesTdsSectionSearch(row: TdsSection, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.sectionCode,
    row.description,
    String(row.ratePercent),
    getTdsApplicableOnLabel(row.applicableOn),
    row.status,
    row.createdBy,
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getTdsSectionEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No TDS sections found',
    emptyDescription: 'Add a TDS section for invoicing and vendor payment compliance.',
    emptyAction: { label: 'Add TDS section', onClick: onCreate },
  }
}

export function downloadTdsSectionCsv(rows: TdsSection[]) {
  const headers = [
    'TDS Section',
    'TDS %',
    'Applicable On',
    'Threshold',
    'Status',
    'Created By',
  ]
  const lines = rows.map((row) =>
    [
      row.sectionCode,
      row.ratePercent,
      getTdsApplicableOnLabel(row.applicableOn),
      row.thresholdLimit ?? '',
      masterStatusLabel[row.status],
      row.createdBy,
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tds-sections-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
