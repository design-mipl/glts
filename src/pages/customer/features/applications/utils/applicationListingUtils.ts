import type { BulkBatchRow, SingleApplicationRow } from '../data/applicationFlowData'
import type {
  ApplicationListingFilterState,
  ApplicationListingTab,
  ApplicationOperationalStatus,
  ApplicationSortPreset,
} from '../types/applicationListing.types'
import { SUBMITTED_OPERATIONAL_STATUSES } from '../types/applicationListing.types'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import { isBulkRow } from '../types/applicationListing.types'
import { getApplicationTypeLabel } from '../components/listing/applicationStatus'
import { resolveApplicationCreatorLabel, getApplicationCreatorOptions } from './applicationCreatorUtils'

export function getAllListingRows(singles: SingleApplicationRow[], bulks: BulkBatchRow[]): ApplicationListingRow[] {
  return [...singles, ...bulks]
}

export function filterByTab(rows: ApplicationListingRow[], tab: ApplicationListingTab): ApplicationListingRow[] {
  switch (tab) {
    case 'all':
      return rows.filter(r => r.operationalStatus !== 'Draft')
    case 'draft':
      return rows.filter(r => r.operationalStatus === 'Draft')
    case 'submitted':
      return rows.filter(r => SUBMITTED_OPERATIONAL_STATUSES.includes(r.operationalStatus))
    default:
      return rows
  }
}

export function computeListingKpis(singles: SingleApplicationRow[], bulks: BulkBatchRow[]) {
  const all = getAllListingRows(singles, bulks)
  const draftCount = all.filter(r => r.operationalStatus === 'Draft').length
  const pendingCorrections = all.filter(r => r.operationalStatus === 'Correction Required').length
  const underReview = all.filter(
    r => r.operationalStatus === 'Under Review' || r.operationalStatus === 'Verification Pending',
  ).length
  const completed = all.filter(r => r.operationalStatus === 'Completed' || r.operationalStatus === 'Passport Ready').length

  return {
    total: all.length,
    draft: draftCount,
    pendingCorrections,
    underReview,
    completed,
  }
}

export function matchesListingSearch(row: ApplicationListingRow, query: string): boolean {
  const s = query.trim().toLowerCase()
  if (!s) return true
  if (row.id.toLowerCase().includes(s)) return true
  if (getApplicationTypeLabel(row.recordType).toLowerCase().includes(s)) return true
  if (isBulkRow(row)) {
    return (
      row.companyName.toLowerCase().includes(s) ||
      row.country.toLowerCase().includes(s) ||
      row.visaType.toLowerCase().includes(s) ||
      row.status.toLowerCase().includes(s) ||
      row.createdByEmail.toLowerCase().includes(s) ||
      resolveApplicationCreatorLabel(row.createdByEmail).toLowerCase().includes(s)
    )
  }
  return (
    row.applicantName.toLowerCase().includes(s) ||
    row.passportNumber.toLowerCase().includes(s) ||
    (row.companyName?.toLowerCase().includes(s) ?? false) ||
    row.country.toLowerCase().includes(s) ||
    row.visaType.toLowerCase().includes(s) ||
    row.status.toLowerCase().includes(s) ||
    row.createdByEmail.toLowerCase().includes(s) ||
    resolveApplicationCreatorLabel(row.createdByEmail).toLowerCase().includes(s)
  )
}

export function applyAdvancedFilters(
  rows: ApplicationListingRow[],
  filters: ApplicationListingFilterState,
): ApplicationListingRow[] {
  return rows.filter(row => {
    if (filters.country && row.country !== filters.country) return false
    if (filters.visaType && row.visaType !== filters.visaType) return false
    if (filters.status && row.operationalStatus !== filters.status) return false
    if (filters.processingStage && row.processingStage !== filters.processingStage) return false
    if (filters.applicationType && row.recordType !== filters.applicationType) return false
    if (filters.createdBy && row.createdByEmail.toLowerCase() !== filters.createdBy.toLowerCase()) return false
    return true
  })
}

export function getListingCellValue(row: ApplicationListingRow, key: string): string {
  if (key === 'status') return row.status
  if (key === 'operationalStatus') return row.operationalStatus
  if (key === 'recordType' || key === 'applicationType') return getApplicationTypeLabel(row.recordType)
  if (key === 'processingStage') return row.processingStage
  if (key === 'createdBy') return resolveApplicationCreatorLabel(row.createdByEmail)
  if (key === 'createdByEmail') return row.createdByEmail
  if (key === 'travelerCount') {
    return isBulkRow(row) ? String(row.totalApplicants) : '1'
  }
  if (key === 'applicantName') {
    return isBulkRow(row) ? row.companyName : row.applicantName
  }
  if (isBulkRow(row)) {
    if (key === 'companyName') return row.companyName
    if (key === 'totalApplicants') return String(row.totalApplicants)
    if (key === 'verifiedApplicants') return String(row.verifiedApplicants)
    if (key === 'pendingCorrections') return String(row.pendingCorrections)
    if (key === 'country') return row.country
    if (key === 'submissionDate') return row.submissionDate || '—'
    if (key === 'lastUpdated') return row.lastUpdated
    return String(row[key as keyof BulkBatchRow] ?? '')
  }
  if (key === 'applicantName') return row.applicantName
  if (key === 'passportNumber') return row.passportNumber
  if (key === 'companyName') return row.companyName ?? '—'
  if (key === 'country') return row.country
  if (key === 'submissionDate') return row.submissionDate || '—'
  if (key === 'lastUpdated') return row.lastUpdated
  return String(row[key as keyof SingleApplicationRow] ?? '')
}

export function sortPresetToTableState(preset: ApplicationSortPreset): { sortKey: string; sortDirection: 'asc' | 'desc' } {
  switch (preset) {
    case 'travel_date':
      return { sortKey: 'travelDate', sortDirection: 'asc' }
    case 'status':
      return { sortKey: 'operationalStatus', sortDirection: 'asc' }
    case 'last_updated':
      return { sortKey: 'lastUpdated', sortDirection: 'desc' }
    case 'latest_created':
    default:
      return { sortKey: 'createdAt', sortDirection: 'desc' }
  }
}

export function getFilterOptions(singles: SingleApplicationRow[], bulks: BulkBatchRow[]) {
  const all = getAllListingRows(singles, bulks)
  const countries = [...new Set(all.map(r => r.country))].sort()
  const visaTypes = [...new Set(all.map(r => r.visaType))].sort()
  const statuses = [...new Set(all.map(r => r.operationalStatus))].sort() as ApplicationOperationalStatus[]
  const stages = [...new Set(all.map(r => r.processingStage))].sort()
  const createdByOptions = getApplicationCreatorOptions(all.map(r => r.createdByEmail))
  return { countries, visaTypes, statuses, stages, createdByOptions }
}

