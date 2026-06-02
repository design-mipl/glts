import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'

export function getUserCellValue(row: AdminPortalUser, key: string): string {
  if (key === 'fullName') return row.fullName
  if (key === 'email') return row.email
  if (key === 'phone') return row.phone
  if (key === 'team') return teamService.getById(row.teamId)?.name ?? '—'
  if (key === 'designation') return row.designation
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'lastLogin') return row.lastLoginAt ? formatMasterDate(row.lastLoginAt) : '—'
  if (key === 'createdAudit') return `${row.createdBy} ${formatMasterDate(row.createdAt)}`
  if (key === 'updatedAudit') return `${row.updatedBy} ${formatMasterDate(row.updatedAt)}`
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesUserSearch(row: AdminPortalUser, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const teamName = teamService.getById(row.teamId)?.name ?? ''
  return [
    row.fullName,
    row.email,
    row.phone,
    row.designation,
    row.employeeId,
    teamName,
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getUserEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No users found',
    emptyDescription: 'Add a user to grant portal access and configure permissions.',
    emptyAction: { label: 'Add user', onClick: onCreate },
  }
}

export function downloadUserCsv(rows: AdminPortalUser[]) {
  const headers = [
    'User Name',
    'Email',
    'Phone',
    'Team',
    'Designation',
    'Status',
    'Last Login',
  ]
  const lines = rows.map((row) =>
    [
      row.fullName,
      row.email,
      row.phone,
      teamService.getById(row.teamId)?.name ?? '',
      row.designation,
      masterStatusLabel[row.status],
      row.lastLoginAt ? formatMasterDate(row.lastLoginAt) : '',
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `admin-users-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function getActivityLogCellValue(
  row: { activity: string; doneBy: string; timestamp: string },
  key: string,
): string {
  if (key === 'activity') return row.activity
  if (key === 'doneBy') return row.doneBy
  if (key === 'timestamp') return row.timestamp
  return ''
}

export function formatUserDateTime(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
