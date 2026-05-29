import type { BookerUser } from '@/shared/types/bookerUser'
import { formatManagedUserDate } from '../../shared/utils/managedUserFormatters'

export function getBookerCellValue(row: BookerUser, key: string): string {
  if (key === 'name') return row.fullName
  if (key === 'createdBy') return row.createdBy
  if (key === 'lastLogin') return row.lastLogin ?? '--'
  if (key === 'lastUpdated') return formatManagedUserDate(row.updatedAt)
  if (key === 'status') return row.status
  return String(row[key as keyof BookerUser] ?? '')
}

export function matchesBookerSearch(row: BookerUser, query: string): boolean {
  const q = query.toLowerCase()
  return (
    row.fullName.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.mobile.includes(q)
  )
}

export function downloadBookerCsv(rows: BookerUser[]) {
  const header = ['Name', 'Email', 'Mobile', 'Location', 'Created By', 'Status', 'Last Login', 'Last Updated']
  const lines = rows.map(row =>
    [
      row.fullName,
      row.email,
      row.mobile,
      row.location,
      row.createdBy,
      row.status,
      row.lastLogin ?? '',
      formatManagedUserDate(row.updatedAt),
    ].join(','),
  )
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'booker-users.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function mapBookerRowsToGridItems(rows: BookerUser[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.fullName,
    subtitle: row.email,
    meta: row.location,
    badge: row.status === 'active' ? 'Active' : 'Inactive',
  }))
}
