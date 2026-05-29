import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import {
  agreementStatusLabel,
  agreementTypeLabel,
  billingTypeLabel,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

export function matchesAgreementSearch(record: CommercialAgreement, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    record.agreementId.toLowerCase().includes(q) ||
    record.companyName.toLowerCase().includes(q) ||
    record.id.toLowerCase().includes(q) ||
    agreementTypeLabel[record.agreementType].toLowerCase().includes(q) ||
    workflowTypeLabel[record.workflowType].toLowerCase().includes(q)
  )
}

export function getAgreementCellValue(record: CommercialAgreement, columnKey: string): string {
  switch (columnKey) {
    case 'agreementId':
      return record.agreementId
    case 'companyName':
      return record.companyName
    case 'agreementType':
      return agreementTypeLabel[record.agreementType]
    case 'workflowType':
      return workflowTypeLabel[record.workflowType]
    case 'billingType':
      return billingTypeLabel[record.billingType]
    case 'startDate':
      return record.startDate || '—'
    case 'endDate':
      return record.endDate || '—'
    case 'status':
      return agreementStatusLabel[record.status]
    case 'updatedAt':
      return new Date(record.updatedAt).toLocaleDateString()
    default:
      return ''
  }
}

export function downloadAgreementCsv(records: CommercialAgreement[]) {
  const headers = [
    'Agreement ID',
    'Company',
    'Agreement Type',
    'Workflow',
    'Billing',
    'Start Date',
    'End Date',
    'Status',
    'Last Updated',
  ]
  const rows = records.map((r) =>
    [
      r.agreementId,
      r.companyName,
      agreementTypeLabel[r.agreementType],
      workflowTypeLabel[r.workflowType],
      billingTypeLabel[r.billingType],
      r.startDate,
      r.endDate,
      agreementStatusLabel[r.status],
      r.updatedAt,
    ].join(','),
  )
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'agreements-export.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function mapAgreementRowsToGridItems(records: CommercialAgreement[]) {
  return records.map((r) => ({
    id: r.id,
    title: r.companyName,
    subtitle: r.agreementId,
    badge: agreementStatusLabel[r.status],
    meta: `${workflowTypeLabel[r.workflowType]} · ${billingTypeLabel[r.billingType]}`,
  }))
}

export function getAgreementEmptyState(hasSearch: boolean) {
  return {
    emptyTitle: hasSearch ? 'No agreements match your search' : 'No agreements yet',
    emptyDescription: hasSearch
      ? 'Try a different search term.'
      : 'Create the first commercial agreement to start corporate onboarding.',
    emptyAction: hasSearch ? undefined : { label: 'Create agreement', onClick: () => {} },
  }
}
