import type { WorkflowMaster } from '@/shared/types/workflowMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function getWorkflowCellValue(row: WorkflowMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'updatedAt') return row.updatedAt
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesWorkflowSearch(row: WorkflowMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [row.name, row.description, row.status, masterStatusLabel[row.status]].some((part) =>
    part.toLowerCase().includes(normalized),
  )
}

export function getWorkflowEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No workflows found',
    emptyDescription: 'Create a reusable visa processing workflow with ordered statuses.',
    emptyAction: { label: 'Create Workflow', onClick: onCreate },
  }
}

export function downloadWorkflowCsv(rows: WorkflowMaster[]) {
  const headers = ['Workflow Name', 'Description', 'Status', 'Last Updated', 'Steps']
  const lines = rows.map((row) =>
    [
      row.name,
      row.description,
      masterStatusLabel[row.status],
      row.updatedAt,
      String(row.steps.length),
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `workflows-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
