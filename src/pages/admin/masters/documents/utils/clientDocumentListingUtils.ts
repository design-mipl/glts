import {
  formatApplicabilityLabels,
  getApplicabilityLabel,
} from '@/shared/services/clientDocumentMasterService'
import type { ClientDocumentMaster } from '@/shared/types/clientDocumentMaster'
import type { MasterApplicability } from '@/shared/types/masterCommon'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function getClientDocumentCellValue(row: ClientDocumentMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'isMandatory') return row.isMandatory ? 'Yes' : 'No'
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  if (key === 'createdAt') return row.createdAt
  if (key === 'updatedAt') return row.updatedAt
  if (key === 'applicableFor') return formatApplicabilityLabels(row.applicableFor)
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesClientDocumentSearch(row: ClientDocumentMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.id,
    row.documentType,
    row.description,
    row.status,
    row.createdBy,
    row.updatedBy,
    ...row.applicableFor.map(getApplicabilityLabel),
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getClientDocumentEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No client documents found',
    emptyDescription:
      'Add client document types used for corporate, marine, and B2B onboarding checklists.',
    emptyAction: { label: 'New client document', onClick: onCreate },
  }
}

export function downloadClientDocumentCsv(rows: ClientDocumentMaster[]) {
  const headers = [
    'Document ID',
    'Document Type',
    'Description',
    'Applicable For',
    'Mandatory',
    'Status',
    'Created By',
    'Updated By',
  ]
  const lines = rows.map((row) =>
    [
      row.id,
      row.documentType,
      row.description.replace(/"/g, '""'),
      formatApplicabilityLabels(row.applicableFor as MasterApplicability[]),
      row.isMandatory ? 'Yes' : 'No',
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
  link.download = `client-document-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
