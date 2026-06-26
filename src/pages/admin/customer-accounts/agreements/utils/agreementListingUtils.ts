import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import { formatAgreementDate } from './agreementFormUtils'
import {
  agreementStatusLabel,
  agreementTypeLabel,
  billingTypeLabel,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

export interface AgreementAdvancedFilterState {
  agreementType: string
  billingType: string
  workflowType: string
  status: string
  companyId: string
  entityName: string
  dateFrom: string
  dateTo: string
}

export const INITIAL_AGREEMENT_ADVANCED_FILTERS: AgreementAdvancedFilterState = {
  agreementType: 'all',
  billingType: 'all',
  workflowType: 'all',
  status: 'all',
  companyId: 'all',
  entityName: '',
  dateFrom: '',
  dateTo: '',
}

export function matchesAgreementSearch(record: CommercialAgreement, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    record.agreementId.toLowerCase().includes(q) ||
    record.companyName.toLowerCase().includes(q) ||
    record.id.toLowerCase().includes(q) ||
    agreementTypeLabel[record.agreementType].toLowerCase().includes(q) ||
    workflowTypeLabel[record.workflowType].toLowerCase().includes(q) ||
    record.entities.some(
      (e) =>
        e.entityName.toLowerCase().includes(q) ||
        e.gstNumber.toLowerCase().includes(q) ||
        e.contactPerson.toLowerCase().includes(q),
    )
  )
}

export function matchesAgreementAdvancedFilters(
  record: CommercialAgreement,
  filters: AgreementAdvancedFilterState,
): boolean {
  if (filters.agreementType !== 'all' && record.agreementType !== filters.agreementType) return false
  if (filters.billingType !== 'all' && record.billingType !== filters.billingType) return false
  if (filters.workflowType !== 'all' && record.workflowType !== filters.workflowType) return false
  if (filters.status !== 'all' && record.status !== filters.status) return false
  if (filters.companyId !== 'all' && record.companyId !== filters.companyId) return false
  if (filters.entityName.trim()) {
    const entityQ = filters.entityName.trim().toLowerCase()
    if (!record.entities.some((e) => e.entityName.toLowerCase().includes(entityQ))) return false
  }
  if (filters.dateFrom && record.updatedAt.slice(0, 10) < filters.dateFrom) return false
  if (filters.dateTo && record.updatedAt.slice(0, 10) > filters.dateTo) return false
  return true
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
    case 'totalEntities':
      return String(record.entities.length)
    case 'creditLimit':
      return record.billingConfig.creditLimit
        ? `₹${record.billingConfig.creditLimit.toLocaleString('en-IN')}`
        : '—'
    case 'advanceRule':
      return deriveAdvanceRuleSummary(record.billingType, record.billingConfig)
    case 'startDate':
      return formatAgreementDate(record.startDate)
    case 'endDate':
      return formatAgreementDate(record.endDate)
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
    'Billing Type',
    'Workflow',
    'Total Entities',
    'Credit Limit',
    'Advance Rule',
    'Agreement start date',
    'Agreement expiry date',
    'Status',
    'Last Updated',
  ]
  const rows = records.map((r) =>
    [
      r.agreementId,
      r.companyName,
      billingTypeLabel[r.billingType],
      workflowTypeLabel[r.workflowType],
      r.entities.length,
      r.billingConfig.creditLimit,
      deriveAdvanceRuleSummary(r.billingType, r.billingConfig),
      formatAgreementDate(r.startDate),
      formatAgreementDate(r.endDate),
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
    meta: `${workflowTypeLabel[r.workflowType]} · ${billingTypeLabel[r.billingType]} · Expires ${formatAgreementDate(r.endDate)}`,
  }))
}

export function getAgreementEmptyState(hasSearch: boolean) {
  return {
    emptyTitle: hasSearch ? 'No agreements match your search' : 'No agreements yet',
    emptyDescription: hasSearch
      ? 'Try a different search term or clear filters.'
      : 'Create the first commercial agreement to start corporate onboarding.',
    emptyAction: hasSearch ? undefined : { label: 'Create agreement', onClick: () => {} },
  }
}

export function hasActiveAgreementFilters(filters: AgreementAdvancedFilterState): boolean {
  return (
    filters.agreementType !== 'all' ||
    filters.billingType !== 'all' ||
    filters.workflowType !== 'all' ||
    filters.status !== 'all' ||
    filters.companyId !== 'all' ||
    Boolean(filters.entityName.trim()) ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo)
  )
}
