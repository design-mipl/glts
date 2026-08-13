import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  formatBulkApplicantListingLabel,
  resolveBulkApplicantNames,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName, resolveApplicationVesselName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import {
  resolveApplicationBillingEntity,
  resolveApplicationCompassNo,
  resolveApplicationJoiningPort,
  resolveApplicationPoCidNo,
} from '@/pages/customer/features/applications/utils/applicationReferenceUtils'
import { resolveApplicationCreatorLabel } from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import { getListingCellValue } from '@/pages/customer/features/applications/utils/applicationListingUtils'
import { mapApplicationRowsToGridItems } from '@/pages/customer/features/applications/utils/applicationListingGrid'
import type { MarineApplicationRow as CorporateApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isCorporateApplicationInQueueTab,
  type CorporateApplicationListingTab,
} from '../config/CorporateApplicationListingTabs'

export type { CorporateApplicationListingTab } from '../config/CorporateApplicationListingTabs'

export function filterCorporateRowsByTab(
  rows: CorporateApplicationRow[],
  tab: CorporateApplicationListingTab,
): CorporateApplicationRow[] {
  if (tab === 'all') {
    return rows
  }
  return rows.filter(row => isCorporateApplicationInQueueTab(row, tab))
}

export function matchesCorporateApplicationSearch(row: CorporateApplicationRow, query: string): boolean {
  const s = query.trim().toLowerCase()
  if (!s) return true
  if (row.id.toLowerCase().includes(s)) return true
  if (resolveApplicationCompanyName(row).toLowerCase().includes(s)) return true
  if (resolveApplicationVesselName(row).toLowerCase().includes(s)) return true
  if (row.poReference?.toLowerCase().includes(s)) return true
  if (resolveApplicationPoCidNo(row).toLowerCase().includes(s)) return true
  if (resolveApplicationCompassNo(row).toLowerCase().includes(s)) return true
  if (resolveApplicationJoiningPort(row).toLowerCase().includes(s)) return true
  if (resolveApplicationBillingEntity(row).toLowerCase().includes(s)) return true
  if (resolveApplicationCreatorLabel(row.createdByEmail).toLowerCase().includes(s)) return true
  if (row.jurisdiction?.toLowerCase().includes(s)) return true
  if (isBulkRow(row)) {
    const paxLabel = formatBulkApplicantListingLabel(row).toLowerCase()
    const paxNames = resolveBulkApplicantNames(row).join(' ').toLowerCase()
    return (
      paxLabel.includes(s) ||
      paxNames.includes(s) ||
      row.country.toLowerCase().includes(s) ||
      row.visaType.toLowerCase().includes(s)
    )
  }
  return (
    row.applicantName.toLowerCase().includes(s) ||
    row.passportNumber.toLowerCase().includes(s) ||
    row.country.toLowerCase().includes(s) ||
    row.visaType.toLowerCase().includes(s)
  )
}

export function getCorporateApplicationCellValue(row: CorporateApplicationRow, key: string): string {
  if (key === 'countryVisa') {
    return `${row.country} · ${row.visaType}`
  }
  if (key === 'applicationType') {
    return getListingCellValue(row as ApplicationListingRow, 'applicationType')
  }
  return getListingCellValue(row as ApplicationListingRow, key)
}

export function computeCorporateListingKpis(rows: CorporateApplicationRow[]) {
  const verificationPending = rows.filter(row =>
    isCorporateApplicationInQueueTab(row, 'verification_pending'),
  ).length
  const pendingCorrections = rows.filter(
    row =>
      row.operationalStatus === 'Correction Required' ||
      row.operationalStatus === 'Document Rejected',
  ).length
  const dispatched = rows.filter(row => isCorporateApplicationInQueueTab(row, 'dispatched')).length

  return {
    total: rows.length,
    verificationPending,
    pendingCorrections,
    dispatched,
  }
}

export interface CorporateApplicationEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getCorporateApplicationEmptyState(
  tab: CorporateApplicationListingTab,
  onCreate?: () => void,
): CorporateApplicationEmptyState {
  switch (tab) {
    case 'draft':
      return {
        emptyTitle: 'No draft applications',
        emptyDescription: 'Draft application created in the Customer Portal.',
      }
    case 'verification_pending':
      return {
        emptyTitle: 'No applications pending verification',
        emptyDescription: 'Document verification and Operations verification pending.',
      }
    case 'online_submission_pending':
      return {
        emptyTitle: 'No applications pending submission',
        emptyDescription:
          'Form submission and QC completed; application is ready for Embassy/VFS submission.',
      }
    case 'pending_payment':
      return {
        emptyTitle: 'No applications pending payment',
        emptyDescription:
          'Applications awaiting embassy, VFS, or portal payment before submission continues appear here.',
      }
    case 'vfs_submission_pending':
      return {
        emptyTitle: 'No applications pending Embassy/VFS submission',
        emptyDescription:
          'Online submission completed, but Embassy/VFS submission is pending.',
      }
    case 'collection_pending':
      return {
        emptyTitle: 'No applications pending collection',
        emptyDescription: 'Awaiting passport/document collection after submission.',
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
        emptyDescription: 'Corporate applications from the customer portal appear here across all operational stages.',
        emptyAction: onCreate ? { label: 'Create application', onClick: onCreate } : undefined,
      }
  }
}

export function mapCorporateApplicationRowsToGridItems(rows: CorporateApplicationRow[]) {
  return mapApplicationRowsToGridItems(rows as ApplicationListingRow[])
}

export function exportCorporateApplicationsToCsv(rows: CorporateApplicationRow[]): string {
  const headers = [
    'Creation date',
    'GLTS reference',
    'Type',
    'Pax name',
    'Company name',
    'Vessel',
    'Billing entity',
    'PO / CID no.',
    'Compass No.',
    'Joining port',
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
    const applicant = isBulkRow(row) ? formatBulkApplicantListingLabel(row) : row.applicantName
    const companyName = resolveApplicationCompanyName(row)
    const vesselName = resolveApplicationVesselName(row)
    const createdBy = getCorporateApplicationCellValue(row, 'createdBy')
    return [
      row.createdAt,
      row.id,
      type,
      applicant,
      companyName,
      vesselName,
      resolveApplicationBillingEntity(row),
      resolveApplicationPoCidNo(row),
      resolveApplicationCompassNo(row),
      resolveApplicationJoiningPort(row),
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

export function downloadCorporateApplicationCsv(rows: CorporateApplicationRow[]) {
  const csv = exportCorporateApplicationsToCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Corporate-applications-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function getAllCorporateListingRows(
  singles: SingleApplicationRow[],
  bulks: BulkBatchRow[],
): CorporateApplicationRow[] {
  return [...singles, ...bulks]
}
