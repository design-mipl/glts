import type { EmptyStateProps } from '@/design-system/UIComponents'
import { getApplicationCustomerSegmentLabel } from '@/shared/config/applicationCustomerSegmentConfig'
import type {
  FundAllocationListingTab,
  FundAllocationPassengerRow,
  FundAllocationQueueFilters,
} from '@/shared/types/fundAllocation'
import { customerSegmentDisplayLabel } from '../config/fundAllocationStatusConfig'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export const EMPTY_FUND_ALLOCATION_FILTERS: FundAllocationQueueFilters = {
  customerSegment: '',
  country: '',
  visaType: '',
  jurisdiction: '',
  dateFrom: '',
  dateTo: '',
  search: '',
}

export function parseFundAllocationFilterDate(value: string): Date | null {
  if (!value.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatFundAllocationFilterDate(date: Date | null): string {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseRowSubmissionDate(value: string): Date | null {
  if (!value.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isSubmissionDateInRange(row: FundAllocationPassengerRow, dateFrom: string, dateTo: string): boolean {
  if (!dateFrom && !dateTo) return true
  const rowDate = parseRowSubmissionDate(row.submissionDate)
  if (!rowDate) return false

  const from = parseFundAllocationFilterDate(dateFrom)
  const to = parseFundAllocationFilterDate(dateTo)
  if (from && rowDate < from) return false
  if (to) {
    const endOfDay = new Date(to)
    endOfDay.setHours(23, 59, 59, 999)
    if (rowDate > endOfDay) return false
  }
  return true
}

export function getFundAllocationCountryKey(row: FundAllocationPassengerRow): string {
  return row.countryId ?? row.country
}

export function sanitizeFundAllocationSelection(
  allRows: FundAllocationPassengerRow[],
  selectedIds: string[],
  previousIds: string[],
): { ids: string[]; rejected: boolean } {
  if (selectedIds.length === 0) return { ids: [], rejected: false }

  const rowById = new Map(allRows.map(row => [row.id, row]))
  const anchorId = previousIds[0] ?? selectedIds[0]
  const anchor = rowById.get(anchorId)
  if (!anchor) return { ids: selectedIds, rejected: false }

  const anchorKey = getFundAllocationCountryKey(anchor)
  const sanitized = selectedIds.filter(id => {
    const row = rowById.get(id)
    return row ? getFundAllocationCountryKey(row) === anchorKey : false
  })

  return { ids: sanitized, rejected: sanitized.length !== selectedIds.length }
}

export function filterRowsByListingTab(
  rows: FundAllocationPassengerRow[],
  tab: FundAllocationListingTab,
): FundAllocationPassengerRow[] {
  return rows.filter(row => row.allocationStatus === tab)
}

export function applyFundAllocationFilters(
  rows: FundAllocationPassengerRow[],
  filters: FundAllocationQueueFilters,
): FundAllocationPassengerRow[] {
  return rows.filter(row => {
    if (filters.customerSegment && row.customerSegment !== filters.customerSegment) return false
    if (filters.country && row.country !== filters.country) return false
    if (filters.visaType && row.visaType !== filters.visaType) return false
    if (filters.jurisdiction && row.jurisdiction !== filters.jurisdiction) return false
    if (!isSubmissionDateInRange(row, filters.dateFrom, filters.dateTo)) return false
    if (filters.search && !matchesFundAllocationSearch(row, filters.search)) return false
    return true
  })
}

export function matchesFundAllocationSearch(row: FundAllocationPassengerRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return [
    row.passengerName,
    row.gltsApplicationId,
    row.gltsApplicantId,
    row.companyName,
    row.country,
    row.visaType,
    row.jurisdiction,
    row.passportNo,
    customerSegmentDisplayLabel(row.customerSegment),
    getApplicationCustomerSegmentLabel(row.customerSegment),
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function getFundAllocationCellValue(row: FundAllocationPassengerRow, key: string): string {
  switch (key) {
    case 'passenger':
    case 'passengerName':
      return row.passengerName
    case 'customerType':
    case 'customerSegment':
      return customerSegmentDisplayLabel(row.customerSegment)
    case 'application':
      return `${row.country} ${row.visaType} ${row.gltsApplicationId} ${row.companyName}`.trim()
    case 'applicationId':
      return row.gltsApplicationId
    case 'companyName':
      return row.companyName
    case 'countryVisa':
      return `${row.country} ${row.visaType}`.trim()
    case 'country':
      return row.country
    case 'jurisdiction':
      return row.jurisdiction
    case 'travelDate':
      return row.travelDate
    case 'submissionDate':
      return row.submissionDate
    case 'onlineSubmissionDate':
      return row.onlineSubmissionDate
    case 'vfsSubmissionDate':
      return row.vfsSubmissionDate
    case 'tentativeCollectionDate':
      return row.tentativeCollectionDate
    case 'collectionDate':
      return row.collectionDate
    case 'submissionStatus':
      return row.submissionStatus
    case 'allocationStatus':
      return row.allocationStatus
    case 'allocatedAmount':
      return row.allocatedAmount > 0 ? formatInr(row.allocatedAmount) : '—'
    case 'suggestedAmount':
      return row.suggestedAllocationAmount > 0 ? formatInr(row.suggestedAllocationAmount) : '—'
    case 'totalAmount':
      return row.totalAmount > 0 ? formatInr(row.totalAmount) : '—'
    case 'allocatedBy':
      return row.allocatedBy || '—'
    case 'allocatedTo':
      return row.allocatedTo || '—'
    case 'cardName':
      return row.cardName || '—'
    case 'lastUpdated':
      return row.lastUpdated
    default:
      return ''
  }
}

export function getFundAllocationFilterOptions(rows: FundAllocationPassengerRow[]) {
  const countries = new Set<string>()
  const visaTypes = new Set<string>()
  const jurisdictions = new Set<string>()

  for (const row of rows) {
    if (row.country) countries.add(row.country)
    if (row.visaType) visaTypes.add(row.visaType)
    if (row.jurisdiction && row.jurisdiction !== '—') jurisdictions.add(row.jurisdiction)
  }

  return {
    countries: Array.from(countries).sort(),
    visaTypes: Array.from(visaTypes).sort(),
    jurisdictions: Array.from(jurisdictions).sort(),
  }
}

export function getFundAllocationTabEmptyState(tab: FundAllocationListingTab): EmptyStateProps {
  const map: Record<FundAllocationListingTab, EmptyStateProps> = {
    pending_allocation: {
      title: 'No passengers pending fund allocation',
      description:
        'Passengers from Embassy/VFS Submission Pending applications appear here for finance fund release.',
    },
    allocated: {
      title: 'No allocated passengers',
      description: 'Passengers with released VFS submission funds will appear in this tab.',
    },
  }
  return map[tab]
}

export function computeFundAllocationKpis(rows: FundAllocationPassengerRow[]) {
  const pending = rows.filter(row => row.allocationStatus === 'pending_allocation')
  const allocated = rows.filter(row => row.allocationStatus === 'allocated')

  return {
    totalPassengers: rows.length,
    pendingAllocation: pending.length,
    allocatedPassengers: allocated.length,
    pendingAmount: pending.reduce((sum, row) => sum + row.suggestedAllocationAmount, 0),
    allocatedAmount: allocated.reduce((sum, row) => sum + row.allocatedAmount, 0),
  }
}

export function downloadFundAllocationCsv(rows: FundAllocationPassengerRow[]) {
  const headers = [
    'Passenger Name',
    'Customer Type',
    'Application ID',
    'GLTS Applicant ID',
    'Company Name',
    'Visa Country',
    'Visa Type',
    'Jurisdiction',
    'Travel Date',
    'Online Submission Date',
    'VFS Submission Date',
    'Tentative Collection Date',
    'Collection Date',
    'Submission Status',
    'Allocation Status',
    'Catalog Total',
    'Total Value',
    'Allocated Amount',
    'Payment Card',
    'Allocated By',
    'Allocated To',
    'Last Updated',
  ]

  const lines = rows.map(row =>
    [
      row.passengerName,
      customerSegmentDisplayLabel(row.customerSegment),
      row.gltsApplicationId,
      row.gltsApplicantId,
      row.companyName,
      row.country,
      row.visaType,
      row.jurisdiction,
      row.travelDate,
      row.onlineSubmissionDate,
      row.vfsSubmissionDate,
      row.tentativeCollectionDate,
      row.collectionDate,
      row.submissionStatus,
      row.allocationStatus,
      row.suggestedAllocationAmount,
      row.totalAmount,
      row.allocatedAmount,
      row.cardName,
      row.allocatedBy,
      row.allocatedTo,
      row.lastUpdated,
    ]
      .map(value => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  )

  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `fund-allocation-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

