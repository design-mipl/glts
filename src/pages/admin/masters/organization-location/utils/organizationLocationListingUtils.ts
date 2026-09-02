import type { OrganizationLocationMaster } from '@/shared/types/organizationLocationMaster'
import { formatMasterDate } from '../../utils/masterListingUtils'
import { organizationTypeLabel } from '../config/organizationTypeConfig'

export function getOrganizationLocationCellValue(
  row: OrganizationLocationMaster,
  key: string,
): string {
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  if (key === 'organizationType') return organizationTypeLabel[row.organizationType]
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesOrganizationLocationSearch(
  row: OrganizationLocationMaster,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const haystack = [
    row.name,
    organizationTypeLabel[row.organizationType],
    row.contactPerson,
    row.mobileNumber,
    row.emailAddress,
    row.address,
    row.city,
    row.state,
    row.country,
    row.pincode,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(normalized)
}

export function getOrganizationLocationEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No organizations or locations found',
    emptyDescription: 'Add a GLTS branch or partner location to use across operations.',
    emptyAction: { label: 'Add location', onClick: onCreate },
  }
}

export function downloadOrganizationLocationCsv(rows: OrganizationLocationMaster[]) {
  const headers = [
    'Name',
    'Organization Type',
    'Contact Person',
    'Mobile',
    'Email',
    'Address',
    'Country',
    'State',
    'City',
    'Pincode',
    'Created By',
    'Created Date',
    'Updated By',
    'Updated Date',
  ]
  const lines = rows.map((row) =>
    [
      row.name,
      organizationTypeLabel[row.organizationType],
      row.contactPerson,
      row.mobileNumber,
      row.emailAddress,
      row.address,
      row.country,
      row.state,
      row.city,
      row.pincode,
      row.createdBy,
      formatMasterDate(row.createdAt),
      row.updatedBy,
      formatMasterDate(row.updatedAt),
    ]
      .map((cell) => `"${cell.replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `organization-location-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
