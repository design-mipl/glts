import {
  formatBulkApplicantListingLabel,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  getApplicationTypeLabel,
  getOperationalStatusLabel,
  resolveApplicationBillingEntity,
  resolveApplicationVessel,
} from '@/shared/utils/invoiceBillingEngine'

export function parseBillableFilterDate(value: string): Date | null {
  if (!value.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatBillableFilterDate(date: Date | null): string {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const SEGMENT_LABELS: Record<string, string> = {
  marine: 'Marine',
  corporate: 'Corporate',
  b2bAgents: 'B2B',
  b2b: 'B2B',
  retail: 'Retail',
}

export function getBillableCustomerSegmentLabel(row: ApplicationListingRow): string {
  return SEGMENT_LABELS[row.customerSegment] ?? row.customerSegment
}

/** Display label for Pax name column (single name, or primary × count for bulk). */
export function getBillablePaxNameLabel(row: ApplicationListingRow): string {
  if (row.recordType === 'bulk') {
    return formatBulkApplicantListingLabel(row as BulkBatchRow)
  }
  return (row as SingleApplicationRow).applicantName
}

export function getBillableCountryVisaLabel(row: ApplicationListingRow): string {
  return `${row.country} · ${row.visaType}`
}

export function getBillableApplicationCellValue(row: ApplicationListingRow, columnKey: string): string {
  switch (columnKey) {
    case 'gltsReference':
      return row.recordType === 'bulk' ? row.id : row.id
    case 'applicationType':
      return getApplicationTypeLabel(row)
    case 'companyName':
      return row.companyName ?? '—'
    case 'applicantName':
    case 'applicantCount':
      return getBillablePaxNameLabel(row)
    case 'customerSegment':
      return getBillableCustomerSegmentLabel(row)
    case 'countryVisa':
      return getBillableCountryVisaLabel(row)
    case 'submissionDate':
    case 'appointmentDate':
      return row.submissionDate?.trim() || '—'
    case 'billingEntity':
      return resolveApplicationBillingEntity(row)
    case 'vessel':
      return resolveApplicationVessel(row)
    case 'status':
      return getOperationalStatusLabel(row)
    default:
      return ''
  }
}

export function splitBillableSelection(selectedIds: string[], rows: ApplicationListingRow[]) {
  const rowMap = new Map(rows.map(r => [r.id, r]))
  const applicationIds: string[] = []
  const batchIds: string[] = []
  for (const id of selectedIds) {
    const row = rowMap.get(id)
    if (!row) continue
    if (row.recordType === 'bulk') batchIds.push(id)
    else applicationIds.push(id)
  }
  return { applicationIds, batchIds }
}
