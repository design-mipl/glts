import type { JurisdictionMaster } from '@/shared/types/jurisdictionMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function getJurisdictionCellValue(row: JurisdictionMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'createdAudit') return `${row.createdBy} ${row.createdAt}`
  if (key === 'updatedAudit') return `${row.updatedBy} ${row.updatedAt}`
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesJurisdictionSearch(row: JurisdictionMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [row.name, row.description, row.status, masterStatusLabel[row.status]].some((part) =>
    part.toLowerCase().includes(normalized),
  )
}

export function getJurisdictionEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No jurisdictions found',
    emptyDescription: 'Add a jurisdiction to manage consulate and VFS processing regions.',
    emptyAction: { label: 'Add jurisdiction', onClick: onCreate },
  }
}

export function downloadJurisdictionCsv(rows: JurisdictionMaster[]) {
  const headers = ['Jurisdiction Name', 'Description', 'Status']
  const lines = rows.map((row) =>
    [row.name, row.description, masterStatusLabel[row.status]]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `jurisdictions-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
