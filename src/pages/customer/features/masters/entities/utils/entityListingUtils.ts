import type { EntityMaster } from '@/shared/types/entityMaster'
import { entityStatusLabel } from '../config/entityStatusConfig'

export function getEntityCellValue(row: EntityMaster, key: string): string {
  if (key === 'location') {
    return [row.location, row.city].filter(Boolean).join(', ')
  }
  if (key === 'lastUpdated') {
    return formatEntityDate(row.updatedAt)
  }
  if (key === 'status') {
    return entityStatusLabel[row.status]
  }
  if (key === 'contactPerson') {
    return row.contactPersonName
  }
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesEntitySearch(row: EntityMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.entityName,
    row.contactPersonName,
    row.location,
    row.city,
    row.country,
  ].some(part => part.toLowerCase().includes(normalized))
}

export function formatEntityDate(iso: string): string {
  if (!iso) return '--'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function mapEntityRowsToGridItems(rows: EntityMaster[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.entityName,
    subtitle: row.contactPersonName,
    meta: `${row.country} · ${formatEntityDate(row.updatedAt)}`,
    status: entityStatusLabel[row.status],
    statusColor: row.status === 'active' ? ('success' as const) : ('default' as const),
  }))
}

export function downloadEntityCsv(rows: EntityMaster[]) {
  const headers = ['Entity Name', 'Contact Person', 'Location', 'Country', 'Status', 'Last Updated']
  const lines = rows.map(row =>
    [
      row.entityName,
      row.contactPersonName,
      [row.location, row.city].filter(Boolean).join(', '),
      row.country,
      entityStatusLabel[row.status],
      formatEntityDate(row.updatedAt),
    ]
      .map(cell => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `entity-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
