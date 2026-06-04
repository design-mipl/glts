import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  getApplicantName,
  getApplicationTypeLabel,
  getAppointmentDate,
  getOperationalStatusLabel,
  resolveApplicationBillingEntity,
  resolveApplicationVessel,
} from '@/shared/utils/invoiceBillingEngine'
import { getBulkBatchApplicantCount } from './invoiceFeeCompositionUtils'

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

export function getBillableApplicantCrewLabel(row: ApplicationListingRow): string {
  const appRow = row as SingleApplicationRow | BulkBatchRow
  if (row.recordType === 'bulk') {
    return `${getBulkBatchApplicantCount(row as BulkBatchRow)} applicants`
  }
  return getApplicantName(appRow)
}

export function getBillablePassportOrBatchLabel(row: ApplicationListingRow): string {
  if (row.recordType === 'bulk') {
    const bulk = row as BulkBatchRow
    const total = getBulkBatchApplicantCount(bulk)
    return `${bulk.verifiedApplicants}/${total} verified`
  }
  return (row as SingleApplicationRow).passportNumber
}

export function getBillableCountryVisaLabel(row: ApplicationListingRow): string {
  return `${row.country} · ${row.visaType}`
}

export function getBillableApplicationCellValue(row: ApplicationListingRow, columnKey: string): string {
  const appRow = row as SingleApplicationRow | BulkBatchRow
  switch (columnKey) {
    case 'gltsReference':
      return row.recordType === 'bulk' ? row.id : row.id
    case 'applicationType':
      return getApplicationTypeLabel(row)
    case 'companyName':
      return row.companyName ?? '—'
    case 'applicantCount':
      return getBillableApplicantCrewLabel(row)
    case 'passportOrBatch':
      return getBillablePassportOrBatchLabel(row)
    case 'customerSegment':
      return getBillableCustomerSegmentLabel(row)
    case 'countryVisa':
      return getBillableCountryVisaLabel(row)
    case 'processingStage':
      return row.processingStage ?? ''
    case 'appointmentDate':
      return getAppointmentDate(appRow)
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
