import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import { resolveApplicationCreatorLabel } from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import { getListingCellValue } from '@/pages/customer/features/applications/utils/applicationListingUtils'
import { mapApplicationRowsToGridItems } from '@/pages/customer/features/applications/utils/applicationListingGrid'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'

export type MarineApplicationListingTab =
  | 'all'
  | 'submitted'
  | 'under_verification'
  | 'ready_for_submission'
  | 'embassy_processing'
  | 'passport_dispatch'
  | 'completed'

const UNDER_VERIFICATION_STATUSES = new Set([
  'Verification Pending',
  'Under Review',
  'Pending Documents',
  'Correction Required',
])

export function filterMarineRowsByTab(
  rows: MarineApplicationRow[],
  tab: MarineApplicationListingTab,
): MarineApplicationRow[] {
  switch (tab) {
    case 'submitted':
      return rows.filter(row => row.operationalStatus === 'Submitted')
    case 'under_verification':
      return rows.filter(
        row =>
          row.processingStage === 'Document verification' ||
          UNDER_VERIFICATION_STATUSES.has(row.operationalStatus),
      )
    case 'ready_for_submission':
      return rows.filter(row => row.processingStage === 'Embassy submission')
    case 'embassy_processing':
      return rows.filter(row => row.processingStage === 'Embassy processing')
    case 'passport_dispatch':
      return rows.filter(
        row =>
          row.processingStage === 'Passport dispatch' || row.operationalStatus === 'Passport Ready',
      )
    case 'completed':
      return rows.filter(row => row.operationalStatus === 'Completed')
    default:
      return rows
  }
}

export function matchesMarineApplicationSearch(row: MarineApplicationRow, query: string): boolean {
  const s = query.trim().toLowerCase()
  if (!s) return true
  if (row.id.toLowerCase().includes(s)) return true
  if (resolveApplicationCompanyName(row).toLowerCase().includes(s)) return true
  if (resolveApplicationCreatorLabel(row.createdByEmail).toLowerCase().includes(s)) return true
  if (isBulkRow(row)) {
    return row.country.toLowerCase().includes(s) || row.visaType.toLowerCase().includes(s)
  }
  return (
    row.applicantName.toLowerCase().includes(s) ||
    row.passportNumber.toLowerCase().includes(s) ||
    row.country.toLowerCase().includes(s) ||
    row.visaType.toLowerCase().includes(s)
  )
}

export function getMarineApplicationCellValue(row: MarineApplicationRow, key: string): string {
  return getListingCellValue(row as ApplicationListingRow, key)
}

export function computeMarineListingKpis(rows: MarineApplicationRow[]) {
  const underVerification = rows.filter(
    row =>
      row.processingStage === 'Document verification' ||
      UNDER_VERIFICATION_STATUSES.has(row.operationalStatus),
  ).length
  const pendingCorrections = rows.filter(row => row.operationalStatus === 'Correction Required').length
  const completed = rows.filter(
    row => row.operationalStatus === 'Completed' || row.operationalStatus === 'Passport Ready',
  ).length

  return {
    total: rows.length,
    underVerification,
    pendingCorrections,
    completed,
  }
}

export interface MarineApplicationEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getMarineApplicationEmptyState(
  tab: MarineApplicationListingTab,
  onCreate?: () => void,
): MarineApplicationEmptyState {
  switch (tab) {
    case 'submitted':
      return {
        emptyTitle: 'No submitted applications',
        emptyDescription: 'Applications appear here once customers submit from the portal.',
      }
    case 'under_verification':
      return {
        emptyTitle: 'No applications under verification',
        emptyDescription: 'Document verification and review-stage applications appear here.',
      }
    case 'ready_for_submission':
      return {
        emptyTitle: 'No applications ready for submission',
        emptyDescription: 'Applications cleared for embassy submission appear here.',
      }
    case 'embassy_processing':
      return {
        emptyTitle: 'No applications in embassy processing',
        emptyDescription: 'Applications at the embassy processing stage appear here.',
      }
    case 'passport_dispatch':
      return {
        emptyTitle: 'No applications in passport dispatch',
        emptyDescription: 'Passport dispatch and passport-ready applications appear here.',
      }
    case 'completed':
      return {
        emptyTitle: 'No completed applications',
        emptyDescription: 'Completed marine applications appear here.',
      }
    default:
      return {
        emptyTitle: 'No submitted applications',
        emptyDescription: 'Submitted marine applications from the customer portal appear here.',
        emptyAction: onCreate ? { label: 'Create application', onClick: onCreate } : undefined,
      }
  }
}

export function mapMarineApplicationRowsToGridItems(rows: MarineApplicationRow[]) {
  return mapApplicationRowsToGridItems(rows as ApplicationListingRow[])
}

export function exportMarineApplicationsToCsv(rows: MarineApplicationRow[]): string {
  const headers = [
    'GLTS reference',
    'Type',
    'Applicant',
    'Company name',
    'Country',
    'Visa type',
    'Travel date',
    'Created by',
    'Status',
    'Processing stage',
    'Last updated',
  ]

  const lines = rows.map(row => {
    const type = isBulkRow(row) ? 'Bulk' : 'Single'
    const applicant = isBulkRow(row) ? `${row.totalApplicants} travelers` : row.applicantName
    const companyName = resolveApplicationCompanyName(row)
    const createdBy = getMarineApplicationCellValue(row, 'createdBy')
    return [
      row.id,
      type,
      applicant,
      companyName,
      row.country,
      row.visaType,
      row.travelDate,
      createdBy,
      row.operationalStatus,
      row.processingStage,
      row.lastUpdated,
    ]
      .map(value => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  })

  return [headers.map(h => `"${h}"`).join(','), ...lines].join('\n')
}

export function downloadMarineApplicationCsv(rows: MarineApplicationRow[]) {
  const csv = exportMarineApplicationsToCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `marine-applications-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function getAllMarineListingRows(
  singles: SingleApplicationRow[],
  bulks: BulkBatchRow[],
): MarineApplicationRow[] {
  return [...singles, ...bulks]
}
