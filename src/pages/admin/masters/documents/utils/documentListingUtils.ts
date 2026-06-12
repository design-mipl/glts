import type { DocumentMaster } from '@/shared/types/documentMaster'
import { richTextToPlainText } from '@/shared/utils/richTextUtils'
import { documentStatusLabel } from '../config/documentStatusConfig'

export function getDocumentCellValue(row: DocumentMaster, key: string): string {
  if (key === 'createdAt') {
    return new Date(row.createdAt).toLocaleDateString()
  }
  if (key === 'status') {
    return documentStatusLabel[row.status]
  }
  if (key === 'description') {
    return richTextToPlainText(row.description)
  }
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesDocumentSearch(row: DocumentMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const plainDescription = richTextToPlainText(row.description)
  return [row.id, row.documentType, plainDescription, row.status].some((part) =>
    part.toLowerCase().includes(normalized),
  )
}

export function formatDocumentDate(iso: string): string {
  if (!iso) return '--'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function mapDocumentRowsToGridItems(rows: DocumentMaster[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.documentType,
    subtitle: richTextToPlainText(row.description) || documentStatusLabel[row.status],
    meta: formatDocumentDate(row.createdAt),
    status: documentStatusLabel[row.status],
    statusColor: row.status === 'active' ? ('success' as const) : ('default' as const),
  }))
}

export interface DocumentListingEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getDocumentEmptyState(onCreate: () => void): DocumentListingEmptyState {
  return {
    emptyTitle: 'No documents found',
    emptyDescription: 'Create a document type to maintain the standard list used across checklists.',
    emptyAction: { label: 'New document', onClick: onCreate },
  }
}

export function downloadDocumentCsv(rows: DocumentMaster[]) {
  const headers = ['Document ID', 'Document Type', 'Description', 'Status', 'Created Date']
  const lines = rows.map((row) =>
    [
      row.id,
      row.documentType,
      richTextToPlainText(row.description).replace(/"/g, '""'),
      documentStatusLabel[row.status],
      formatDocumentDate(row.createdAt),
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `document-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
