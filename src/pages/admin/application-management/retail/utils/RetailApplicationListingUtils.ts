import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  formatBulkApplicantListingLabel,
  resolveBulkApplicantNames,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName, resolveApplicationDesignation } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import { resolveApplicationBillingEntity } from '@/pages/customer/features/applications/utils/applicationReferenceUtils'
import { resolveApplicationCreatorLabel } from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import { getListingCellValue } from '@/pages/customer/features/applications/utils/applicationListingUtils'
import { mapApplicationRowsToGridItems } from '@/pages/customer/features/applications/utils/applicationListingGrid'
import type { MarineApplicationRow as RetailApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  resolveApplicationConsultantName,
  resolveApplicationPriorityLabel,
} from '../../shared/utils/applicationConsultantUtils'
import {
  isRetailApplicationInQueueTab,
  type RetailApplicationListingTab,
} from '../config/RetailApplicationListingTabs'

export type { RetailApplicationListingTab } from '../config/RetailApplicationListingTabs'

export function filterRetailRowsByTab(
  rows: RetailApplicationRow[],
  tab: RetailApplicationListingTab,
): RetailApplicationRow[] {
  if (tab === 'all') {
    return rows
  }
  return rows.filter(row => isRetailApplicationInQueueTab(row, tab))
}

export function matchesRetailApplicationSearch(row: RetailApplicationRow, query: string): boolean {
  const s = query.trim().toLowerCase()
  if (!s) return true
  if (row.id.toLowerCase().includes(s)) return true
  if (resolveApplicationCompanyName(row).toLowerCase().includes(s)) return true
  const designation = resolveApplicationDesignation(row).toLowerCase()
  if (designation !== '—' && designation.includes(s)) return true
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

export function getRetailApplicationCellValue(row: RetailApplicationRow, key: string): string {
  if (key === 'countryVisa') {
    return `${row.country} · ${row.visaType}`
  }
  if (key === 'applicationType') {
    return getListingCellValue(row as ApplicationListingRow, 'applicationType')
  }
  if (key === 'consultant') {
    return resolveApplicationConsultantName(row)
  }
  if (key === 'priority') {
    return resolveApplicationPriorityLabel(row)
  }
  return getListingCellValue(row as ApplicationListingRow, key)
}

export function computeRetailListingKpis(rows: RetailApplicationRow[]) {
  const verificationPending = rows.filter(row =>
    isRetailApplicationInQueueTab(row, 'verification_pending'),
  ).length
  const pendingCorrections = rows.filter(
    row =>
      row.operationalStatus === 'Correction Required' ||
      row.operationalStatus === 'Document Rejected' ||
      row.operationalStatus === 'Ops · Correction Required' ||
      row.operationalStatus === 'Ops · Document Missing' ||
      row.operationalStatus === 'Docs · Correction Required' ||
      row.operationalStatus === 'Docs · Document Missing / Blocked',
  ).length
  const dispatched = rows.filter(row => isRetailApplicationInQueueTab(row, 'dispatched')).length

  return {
    total: rows.length,
    verificationPending,
    pendingCorrections,
    dispatched,
  }
}

export interface RetailApplicationEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getRetailApplicationEmptyState(
  tab: RetailApplicationListingTab,
  onCreate?: () => void,
): RetailApplicationEmptyState {
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
          'After Ops verifies, applications appear here for Docs form QC (and also under Pending Payment).',
      }
    case 'pending_payment':
      return {
        emptyTitle: 'No applications pending payment',
        emptyDescription:
          'After Ops verifies, applications appear here so Ops or Docs can record payment (also under Submission Pending).',
      }
    case 'vfs_submission_pending':
      return {
        emptyTitle: 'No applications pending Embassy/VFS submission',
        emptyDescription:
          'Applications move here after the form is completely submitted.',
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
        emptyDescription: 'Retail applications from the website and customer portal appear here across all operational stages.',
        emptyAction: onCreate ? { label: 'Create application', onClick: onCreate } : undefined,
      }
  }
}

export function mapRetailApplicationRowsToGridItems(rows: RetailApplicationRow[]) {
  return mapApplicationRowsToGridItems(rows as ApplicationListingRow[])
}

export function exportRetailApplicationsToCsv(rows: RetailApplicationRow[]): string {
  const headers = [
    'Creation date',
    'GLTS reference',
    'Type',
    'Pax name',
    'Designation',
    'Company name',
    'Billing entity',
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
    const createdBy = getRetailApplicationCellValue(row, 'createdBy')
    return [
      row.createdAt,
      row.id,
      type,
      applicant,
      resolveApplicationDesignation(row),
      companyName,
      resolveApplicationBillingEntity(row),
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

export function downloadRetailApplicationCsv(rows: RetailApplicationRow[]) {
  const csv = exportRetailApplicationsToCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `retail-applications-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function getAllRetailListingRows(
  singles: SingleApplicationRow[],
  bulks: BulkBatchRow[],
): RetailApplicationRow[] {
  return [...singles, ...bulks]
}
