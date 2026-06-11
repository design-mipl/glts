import { taxMasterService } from '@/shared/services/taxMasterService'
import type { SacCodeMaster } from '@/shared/types/sacCodeMaster'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function getSacCodeCellValue(row: SacCodeMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'defaultGst') return taxMasterService.getGstLabel(row.defaultGstRateId)
  if (key === 'defaultTds') {
    const pct = taxMasterService.getTdsPercent(row.defaultTdsSectionId)
    return pct != null ? `${pct}%` : '—'
  }
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

export function matchesSacCodeSearch(row: SacCodeMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.sacCode,
    row.sacTitle,
    row.description,
    row.category,
    row.status,
    taxMasterService.getGstLabel(row.defaultGstRateId),
    ...row.applicableFor.map(
      (value) =>
        MASTER_APPLICABILITY_OPTIONS.find((option) => option.value === value)?.label ?? value,
    ),
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getSacCodeEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No SAC codes found',
    emptyDescription: 'Add a SAC code to classify services and default tax mapping.',
    emptyAction: { label: 'Add SAC code', onClick: onCreate },
  }
}

export function downloadSacCodeCsv(rows: SacCodeMaster[]) {
  const headers = ['SAC Code', 'Title', 'Category', 'GST', 'TDS %', 'Status']
  const lines = rows.map((row) =>
    [
      row.sacCode,
      row.sacTitle,
      row.category,
      taxMasterService.getGstLabel(row.defaultGstRateId),
      taxMasterService.getTdsPercent(row.defaultTdsSectionId) ?? '',
      masterStatusLabel[row.status],
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sac-codes-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
