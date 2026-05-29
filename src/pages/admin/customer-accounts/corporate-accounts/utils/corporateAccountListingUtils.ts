import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { corporatePortalStatusLabel } from '../config/corporateAccountStatusConfig'

export function matchesCorporateAccountSearch(record: CorporateAccount, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    record.companyName.toLowerCase().includes(q) ||
    record.companyId.toLowerCase().includes(q) ||
    record.id.toLowerCase().includes(q) ||
    (record.superAdmin?.fullName.toLowerCase().includes(q) ?? false)
  )
}

export function getCorporateAccountCellValue(record: CorporateAccount, columnKey: string): string {
  const counts = corporateAccountService.getCounts(record)
  switch (columnKey) {
    case 'companyId':
      return record.companyId
    case 'companyName':
      return record.companyName
    case 'workflowType':
      return record.workflowType
    case 'superAdmin':
      return record.superAdmin?.fullName ?? '—'
    case 'totalAdmins':
      return String(counts.totalAdmins)
    case 'totalEntities':
      return String(counts.totalEntities)
    case 'totalVessels':
      return String(counts.totalVessels)
    case 'portalStatus':
      return corporatePortalStatusLabel[record.portalStatus]
    case 'updatedAt':
      return new Date(record.updatedAt).toLocaleDateString()
    default:
      return ''
  }
}

export function downloadCorporateAccountCsv(records: CorporateAccount[]) {
  const headers = ['Company ID', 'Company', 'Workflow', 'Super Admin', 'Admins', 'Entities', 'Vessels', 'Portal Status', 'Updated']
  const rows = records.map((r) => {
    const c = corporateAccountService.getCounts(r)
    return [r.companyId, r.companyName, r.workflowType, r.superAdmin?.fullName ?? '', c.totalAdmins, c.totalEntities, c.totalVessels, corporatePortalStatusLabel[r.portalStatus], r.updatedAt].join(',')
  })
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'corporate-accounts-export.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function mapCorporateAccountRowsToGridItems(records: CorporateAccount[]) {
  return records.map((r) => ({
    id: r.id,
    title: r.companyName,
    subtitle: r.companyId,
    badge: corporatePortalStatusLabel[r.portalStatus],
    meta: `${r.workflowType} · ${corporateAccountService.getCounts(r).totalAdmins} admins`,
  }))
}

export function getCorporateAccountEmptyState(hasSearch: boolean) {
  return {
    emptyTitle: hasSearch ? 'No corporate accounts match your search' : 'No corporate accounts yet',
    emptyDescription: hasSearch ? 'Try a different search term.' : 'Create a corporate account from an approved agreement.',
    emptyAction: hasSearch ? undefined : { label: 'Create corporate account', onClick: () => {} },
  }
}
