import type { EmptyStateProps } from '@/design-system/UIComponents'
import { getApplicationCustomerSegmentLabel } from '@/shared/config/applicationCustomerSegmentConfig'
import type {
  FundAllocationListingTab,
  FundAllocationPassengerRow,
  FundAllocationQueueFilters,
} from '@/shared/types/fundAllocation'
import { getFundTransferTypeLabel } from '@/shared/types/fundAllocation'
import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'
import { CLAIM_SHEET_STATUS_LABEL } from '@/shared/types/groundOpsClaimSheet'
import { groupPassengersIntoAllocationBatches } from '@/shared/utils/fundAllocationBatchUtils'
import { customerSegmentDisplayLabel } from '../config/fundAllocationStatusConfig'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export const EMPTY_FUND_ALLOCATION_FILTERS: FundAllocationQueueFilters = {
  customerSegment: '',
  country: '',
  visaType: '',
  jurisdiction: '',
  assignedTeam: '',
  assignedUser: '',
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

export function isSubmissionDateInRange(row: FundAllocationPassengerRow, dateFrom: string, dateTo: string): boolean {
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

export function getFundAllocationAssigneeKey(row: FundAllocationPassengerRow): string {
  return row.assignedUser.trim().toLowerCase() || '__unassigned__'
}

export type FundAllocationSelectionRejectReason = 'country' | 'assignee' | null

export function sanitizeFundAllocationSelection(
  allRows: FundAllocationPassengerRow[],
  selectedIds: string[],
  previousIds: string[],
): { ids: string[]; rejected: boolean; reason: FundAllocationSelectionRejectReason } {
  if (selectedIds.length === 0) return { ids: [], rejected: false, reason: null }

  const rowById = new Map(allRows.map(row => [row.id, row]))
  const anchorId = previousIds[0] ?? selectedIds[0]
  const anchor = rowById.get(anchorId)
  if (!anchor) return { ids: selectedIds, rejected: false, reason: null }

  const anchorCountry = getFundAllocationCountryKey(anchor)
  const sameCountry = selectedIds.filter(id => {
    const row = rowById.get(id)
    return row ? getFundAllocationCountryKey(row) === anchorCountry : false
  })
  if (sameCountry.length !== selectedIds.length) {
    return { ids: sameCountry, rejected: true, reason: 'country' }
  }

  const anchorAssignee = getFundAllocationAssigneeKey(anchor)
  const sameAssignee = sameCountry.filter(id => {
    const row = rowById.get(id)
    return row ? getFundAllocationAssigneeKey(row) === anchorAssignee : false
  })
  if (sameAssignee.length !== sameCountry.length) {
    return { ids: sameAssignee, rejected: true, reason: 'assignee' }
  }

  return { ids: sameAssignee, rejected: false, reason: null }
}

export function filterRowsByListingTab(
  rows: FundAllocationPassengerRow[],
  tab: FundAllocationListingTab,
): FundAllocationPassengerRow[] {
  if (tab === 'claim_sheets') return []
  if (tab === 'pending_allocation') {
    return rows.filter(
      row => row.allocationStatus === 'pending_allocation' && row.fundRequested && row.totalAmount > 0,
    )
  }
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
    if (filters.assignedTeam && row.assignedTeam !== filters.assignedTeam) return false
    if (filters.assignedUser && row.assignedUser !== filters.assignedUser) return false
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
    row.assignedTeam,
    row.assignedUser,
    row.allocatedTo,
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
    case 'assignedTeam':
      return row.assignedTeam || '—'
    case 'assignedUser':
      return row.assignedUser || '—'
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
  const teams = new Set<string>()
  const usersByKey = new Map<string, { value: string; label: string; team: string }>()

  for (const row of rows) {
    if (row.country) countries.add(row.country)
    if (row.visaType) visaTypes.add(row.visaType)
    if (row.jurisdiction && row.jurisdiction !== '—') jurisdictions.add(row.jurisdiction)
    if (row.assignedTeam) teams.add(row.assignedTeam)
    if (row.assignedUser) {
      const key = `${row.assignedTeam}::${row.assignedUser}`
      if (!usersByKey.has(key)) {
        usersByKey.set(key, {
          value: row.assignedUser,
          label: row.assignedUser,
          team: row.assignedTeam,
        })
      }
    }
  }

  return {
    countries: Array.from(countries).sort(),
    visaTypes: Array.from(visaTypes).sort(),
    jurisdictions: Array.from(jurisdictions).sort(),
    teams: Array.from(teams).sort(),
    users: Array.from(usersByKey.values()).sort((a, b) => a.label.localeCompare(b.label)),
  }
}

export function getFundAllocationTabEmptyState(tab: FundAllocationListingTab): EmptyStateProps {
  const map: Record<FundAllocationListingTab, EmptyStateProps> = {
    pending_allocation: {
      title: 'No fund requests pending allocation',
      description:
        'Passengers appear here after Assignment & Priority requests funds with selected services.',
    },
    allocated: {
      title: 'No allocated fund releases',
      description: 'Completed fund allocations appear here as one listing per release (single or bulk).',
    },
    claim_sheets: {
      title: 'No claim sheets',
      description: 'Claim sheets submitted from Operations Desk will appear here for Finance review.',
    },
  }
  return map[tab]
}

export function computeFundAllocationKpis(rows: FundAllocationPassengerRow[]) {
  const pending = rows.filter(
    row => row.allocationStatus === 'pending_allocation' && row.fundRequested && row.totalAmount > 0,
  )
  const allocated = rows.filter(row => row.allocationStatus === 'allocated')
  const allocatedBatches = groupPassengersIntoAllocationBatches(allocated)

  return {
    totalPassengers: rows.length,
    pendingAllocation: pending.length,
    allocatedPassengers: allocatedBatches.length,
    pendingAmount: pending.reduce((sum, row) => sum + row.totalAmount, 0),
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
    'Assigned Team',
    'Assigned User',
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
    'Fund Transfer',
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
      row.assignedTeam,
      row.assignedUser,
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
      row.fundTransfer?.transferType
        ? getFundTransferTypeLabel(row.fundTransfer.transferType)
        : row.cardName,
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

export function applyFundAllocationClaimSheetSearch(
  sheets: GroundOpsClaimSheet[],
  search: string,
): GroundOpsClaimSheet[] {
  const query = search.trim().toLowerCase()
  if (!query) return sheets
  return sheets.filter(sheet => {
    const haystack = [
      sheet.claimNumber,
      sheet.generatedBy,
      sheet.team,
      sheet.status,
      CLAIM_SHEET_STATUS_LABEL[sheet.status],
      ...sheet.cases.map(c => `${c.passengerName} ${c.operationalId} ${c.applicationId} ${c.companyName}`),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
}

export function getFundAllocationClaimSheetCellValue(row: GroundOpsClaimSheet, key: string): string {
  switch (key) {
    case 'claimNumber':
      return row.claimNumber
    case 'generatedBy':
      return row.generatedBy
    case 'team':
      return row.team || '—'
    case 'status':
      return CLAIM_SHEET_STATUS_LABEL[row.status]
    case 'caseCount':
      return String(row.cases.length)
    case 'allocatedAmount':
      return formatInr(row.kpis.allocatedAmount)
    case 'totalWithdrawn':
      return formatInr(row.kpis.totalWithdrawn)
    case 'availableInBank':
      return formatInr(row.kpis.availableInBank)
    case 'inHandCash':
      return formatInr(row.kpis.inHandCash)
    case 'expensesIncurred':
      return formatInr(row.kpis.expensesIncurred)
    case 'settlementAmount':
      return row.kpis.settlementAmount > 0
        ? `+${formatInr(row.kpis.settlementAmount)}`
        : formatInr(row.kpis.settlementAmount)
    case 'generatedAt':
      return row.generatedAt
    default:
      return ''
  }
}

export function downloadFundAllocationClaimSheetsCsv(sheets: GroundOpsClaimSheet[]) {
  const headers = [
    'Claim Number',
    'Generated By',
    'Team',
    'Status',
    'Cases',
    'Allocated Amount',
    'Total Withdrawn',
    'Available In Bank',
    'In Hand Cash',
    'Expenses Incurred',
    'Settlement Amount',
    'Generated At',
  ]

  const lines = sheets.map(sheet =>
    [
      sheet.claimNumber,
      sheet.generatedBy,
      sheet.team,
      CLAIM_SHEET_STATUS_LABEL[sheet.status],
      sheet.cases.length,
      sheet.kpis.allocatedAmount,
      sheet.kpis.totalWithdrawn,
      sheet.kpis.availableInBank,
      sheet.kpis.inHandCash,
      sheet.kpis.expensesIncurred,
      sheet.kpis.settlementAmount,
      sheet.generatedAt,
    ]
      .map(value => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  )

  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `claim-sheets-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

