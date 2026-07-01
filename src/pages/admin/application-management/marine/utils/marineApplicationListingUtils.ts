import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import { resolveApplicationCreatorLabel } from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import { getListingCellValue } from '@/pages/customer/features/applications/utils/applicationListingUtils'
import { mapApplicationRowsToGridItems } from '@/pages/customer/features/applications/utils/applicationListingGrid'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isMarineApplicationInQueueTab,
  type MarineApplicationListingTab,
} from '../config/marineApplicationListingTabs'

export type { MarineApplicationListingTab } from '../config/marineApplicationListingTabs'

export function filterMarineRowsByTab(
  rows: MarineApplicationRow[],
  tab: MarineApplicationListingTab,
): MarineApplicationRow[] {
  if (tab === 'all') {
    return rows
  }
  return rows.filter(row => isMarineApplicationInQueueTab(row, tab))
}

export function matchesMarineApplicationSearch(row: MarineApplicationRow, query: string): boolean {
  const s = query.trim().toLowerCase()
  if (!s) return true
  if (row.id.toLowerCase().includes(s)) return true
  if (resolveApplicationCompanyName(row).toLowerCase().includes(s)) return true
  if (resolveApplicationCreatorLabel(row.createdByEmail).toLowerCase().includes(s)) return true
  if (row.jurisdiction?.toLowerCase().includes(s)) return true
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
  if (key === 'countryVisa') {
    return `${row.country} · ${row.visaType}`
  }
  if (key === 'applicationType') {
    return getListingCellValue(row as ApplicationListingRow, 'applicationType')
  }
  return getListingCellValue(row as ApplicationListingRow, key)
}

export function computeMarineListingKpis(rows: MarineApplicationRow[]) {
  const verificationPending = rows.filter(row =>
    isMarineApplicationInQueueTab(row, 'verification_pending'),
  ).length
  const pendingCorrections = rows.filter(row => row.operationalStatus === 'Correction Required').length
  const dispatched = rows.filter(row => isMarineApplicationInQueueTab(row, 'dispatched')).length

  return {
    total: rows.length,
    verificationPending,
    pendingCorrections,
    dispatched,
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
    case 'draft':
      return {
        emptyTitle: 'No draft applications',
        emptyDescription:
          'Applications saved as drafts in the customer portal appear here before submission to GLTS.',
      }
    case 'verification_pending':
      return {
        emptyTitle: 'No applications pending verification',
        emptyDescription:
          'Submitted applications awaiting document verification, checklist validation, and operations review appear here.',
      }
    case 'online_submission_pending':
      return {
        emptyTitle: 'No applications pending online submission',
        emptyDescription:
          'Verified applications awaiting form preparation, internal QC, and embassy portal submission appear here.',
      }
    case 'vfs_submission_pending':
      return {
        emptyTitle: 'No applications pending VFS submission',
        emptyDescription:
          'Applications with completed online submission awaiting physical VFS or embassy submission appear here.',
      }
    case 'collection_pending':
      return {
        emptyTitle: 'No applications pending collection',
        emptyDescription:
          'Applications submitted to the embassy or VFS awaiting passport or document collection appear here.',
      }
    case 'collected':
      return {
        emptyTitle: 'No collected applications',
        emptyDescription:
          'Passports or documents collected from the embassy or VFS and pending dispatch appear here.',
      }
    case 'dispatched':
      return {
        emptyTitle: 'No dispatched applications',
        emptyDescription:
          'Applications with passports or documents dispatched or handed over to the customer appear here.',
      }
    default:
      return {
        emptyTitle: 'No applications',
        emptyDescription: 'Marine applications from the customer portal appear here across all operational stages.',
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
    'Jurisdiction',
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
      row.jurisdiction ?? '—',
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
