import type { RequirementMaster } from '@/shared/types/requirementMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

export function getRequirementCellValue(row: RequirementMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'questions') return String(row.questions.length)
  if (key === 'documents') return String(row.documents.length)
  if (key === 'updatedAt') return row.updatedAt
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesRequirementSearch(row: RequirementMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [row.id, row.name, row.description, row.status, masterStatusLabel[row.status]].some((part) =>
    part.toLowerCase().includes(normalized),
  )
}

export function getRequirementEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No requirement packs found',
    emptyDescription: 'Create a pack with questionnaire questions and documents from Document Master.',
    emptyAction: { label: 'Create pack', onClick: onCreate },
  }
}

export function mapRequirementRowsToGridItems(rows: RequirementMaster[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.name,
    subtitle: row.description || `${row.questions.length} questions · ${row.documents.length} documents`,
    meta: formatMasterDate(row.updatedAt),
    status: masterStatusLabel[row.status],
    statusColor: row.status === 'active' ? ('success' as const) : ('default' as const),
  }))
}

export function downloadRequirementCsv(rows: RequirementMaster[]) {
  const headers = ['ID', 'Name', 'Description', 'Questions', 'Documents', 'Status', 'Last Updated']
  const lines = rows.map((row) =>
    [
      row.id,
      row.name,
      row.description.replace(/"/g, '""'),
      String(row.questions.length),
      String(row.documents.length),
      masterStatusLabel[row.status],
      formatMasterDate(row.updatedAt),
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `requirement-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
