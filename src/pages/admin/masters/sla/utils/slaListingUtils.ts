import {
  SLA_DOMAIN_LABELS,
  getSlaSubmoduleLabel,
  type SlaMaster,
} from '@/shared/types/slaMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function getSlaCellValue(row: SlaMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'segment') return getSlaSubmoduleLabel(row.domain, row.segment)
  if (key === 'domain') return SLA_DOMAIN_LABELS[row.domain]
  if (key === 'singleE2e') return `${row.single.e2eHours}h`
  if (key === 'bulkE2e') {
    return `${row.bulkBands['0_10'].e2eHours}/${row.bulkBands['11_20'].e2eHours}/${row.bulkBands['21_plus'].e2eHours}h`
  }
  if (key === 'updatedAt') return row.updatedAt
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesSlaSearch(row: SlaMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.name,
    getSlaSubmoduleLabel(row.domain, row.segment),
    SLA_DOMAIN_LABELS[row.domain],
    row.status,
    masterStatusLabel[row.status],
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getSlaEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No SLA policies found',
    emptyDescription:
      'Create SLAs by admin module and submodule, with hours per listing tab for single and bulk bands.',
    emptyAction: { label: 'Create SLA', onClick: onCreate },
  }
}

export function downloadSlaCsv(rows: SlaMaster[]) {
  const headers = [
    'Name',
    'Module',
    'Submodule',
    'Single E2E',
    'Bulk 0-10',
    'Bulk 11-20',
    'Bulk 21+',
    'Status',
    'Last Updated',
  ]
  const lines = rows.map((row) =>
    [
      row.name,
      SLA_DOMAIN_LABELS[row.domain],
      getSlaSubmoduleLabel(row.domain, row.segment),
      String(row.single.e2eHours),
      String(row.bulkBands['0_10'].e2eHours),
      String(row.bulkBands['11_20'].e2eHours),
      String(row.bulkBands['21_plus'].e2eHours),
      masterStatusLabel[row.status],
      row.updatedAt,
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sla-masters-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
