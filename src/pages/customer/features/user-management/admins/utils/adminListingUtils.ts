import type { AdminUser } from '@/shared/types/adminUser'
import { formatManagedUserDate } from '../../shared/utils/managedUserFormatters'

export function getAdminCellValue(row: AdminUser, key: string): string {
  if (key === 'fullName' || key === 'name') return row.fullName
  if (key === 'lastLogin') return row.lastLogin ?? '--'
  if (key === 'lastUpdated') return formatManagedUserDate(row.updatedAt)
  if (key === 'status') return row.status
  return String(row[key as keyof AdminUser] ?? '')
}

export function matchesAdminSearch(row: AdminUser, query: string): boolean {
  const q = query.toLowerCase()
  return (
    row.fullName.toLowerCase().includes(q) ||
    row.email.toLowerCase().includes(q) ||
    row.mobile.includes(q)
  )
}

export function downloadAdminCsv(rows: AdminUser[]) {
  const header = ['Name', 'Email', 'Mobile', 'Location', 'Status', 'Last Login', 'Last Updated']
  const lines = rows.map(row =>
    [
      row.fullName,
      row.email,
      row.mobile,
      row.location,
      row.status,
      row.lastLogin ?? '',
      formatManagedUserDate(row.updatedAt),
    ].join(','),
  )
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'admin-users.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function mapAdminRowsToGridItems(rows: AdminUser[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.fullName,
    subtitle: row.email,
    meta: row.location,
    badge: row.status === 'active' ? 'Active' : 'Inactive',
  }))
}
