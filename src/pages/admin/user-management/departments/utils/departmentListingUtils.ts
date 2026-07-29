import { departmentService } from '@/shared/services/departmentService'
import type { DepartmentMaster } from '@/shared/types/departmentMaster'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'

export function getDepartmentCellValue(row: DepartmentMaster, key: string): string {
  if (key === 'name') return row.name
  if (key === 'description') return row.description
  if (key === 'totalUsers') return String(departmentService.countUsers(row.id))
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'createdAudit') return `${row.createdBy} ${formatMasterDate(row.createdAt)}`
  if (key === 'updatedAudit') return `${row.updatedBy} ${formatMasterDate(row.updatedAt)}`
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesDepartmentSearch(row: DepartmentMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [row.name, row.description, row.status, row.createdBy, row.updatedBy].some((part) =>
    part.toLowerCase().includes(normalized),
  )
}

export function getDepartmentEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No departments found',
    emptyDescription: 'Create a department to organize users by organizational unit.',
    emptyAction: { label: 'Add department', onClick: onCreate },
  }
}

export function downloadDepartmentCsv(rows: DepartmentMaster[]) {
  const headers = [
    'Department Name',
    'Description',
    'Total Users',
    'Status',
    'Created By',
    'Updated By',
  ]
  const lines = rows.map((row) =>
    [
      row.name,
      row.description,
      String(departmentService.countUsers(row.id)),
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
  link.download = `departments-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function getDepartmentMemberCellValue(
  row: { fullName: string; email: string; designation: string; status: MasterRecordStatus },
  key: string,
): string {
  if (key === 'fullName') return row.fullName
  if (key === 'email') return row.email
  if (key === 'designation') return row.designation
  if (key === 'status') return masterStatusLabel[row.status]
  return ''
}
