import type {
  FundAllocationBatchRow,
  FundAllocationPassengerRow,
  FundAllocationQueueFilters,
} from '@/shared/types/fundAllocation'
import { getApplicationCustomerSegmentLabel } from '@/shared/config/applicationCustomerSegmentConfig'
import { formatInr } from '@/shared/utils/invoiceCalculations'

function parseFundAllocationFilterDate(value: string): Date | null {
  if (!value.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isSubmissionDateInRange(row: FundAllocationPassengerRow, dateFrom: string, dateTo: string): boolean {
  if (!dateFrom && !dateTo) return true
  const rowDateRaw = row.submissionDate?.trim()
  if (!rowDateRaw) return false
  const rowDate = new Date(rowDateRaw)
  if (Number.isNaN(rowDate.getTime())) return false

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

export function generateAllocationBatchId(): string {
  return `alloc-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function resolvePassengerAllocationBatchId(row: FundAllocationPassengerRow): string {
  if (row.allocationBatchId?.trim()) return row.allocationBatchId.trim()

  const paymentReference = row.fundTransfer?.paymentReference?.trim()
  const allocatedAt = row.allocatedAt?.trim()
  if (paymentReference && allocatedAt) return `${paymentReference}|${allocatedAt}`

  return row.id
}

function formatPassengerBatchLabel(passengers: FundAllocationPassengerRow[]): string {
  if (passengers.length === 0) return '—'
  if (passengers.length === 1) return passengers[0].passengerName
  return `${passengers[0].passengerName} +${passengers.length - 1}`
}

function uniqueJoined(values: string[]): string {
  const unique = [...new Set(values.map(value => value.trim()).filter(Boolean))]
  if (unique.length === 0) return '—'
  if (unique.length === 1) return unique[0]
  return unique.join(' · ')
}

export function groupPassengersIntoAllocationBatches(
  rows: FundAllocationPassengerRow[],
): FundAllocationBatchRow[] {
  const groups = new Map<string, FundAllocationPassengerRow[]>()

  for (const row of rows) {
    const batchId = resolvePassengerAllocationBatchId(row)
    const existing = groups.get(batchId) ?? []
    existing.push(row)
    groups.set(batchId, existing)
  }

  return Array.from(groups.entries())
    .map(([batchId, passengers]) => {
      const sorted = [...passengers].sort((a, b) => {
        if (a.sequenceNo !== b.sequenceNo) return a.sequenceNo - b.sequenceNo
        return a.passengerName.localeCompare(b.passengerName)
      })
      const first = sorted[0]

      return {
        id: batchId,
        allocationBatchId: batchId,
        passengers: sorted,
        passengerCount: sorted.length,
        passengerLabel: formatPassengerBatchLabel(sorted),
        requestedTotal: sorted.reduce((sum, passenger) => sum + passenger.totalAmount, 0),
        allocatedAmount: sorted.reduce((sum, passenger) => sum + passenger.allocatedAmount, 0),
        allocatedAt: first.allocatedAt,
        allocatedBy: first.allocatedBy,
        allocatedTo: uniqueJoined(sorted.map(passenger => passenger.allocatedTo)),
        assignedTeam: first.assignedTeam,
        assignedUser: first.assignedUser,
        country: first.country,
        visaType: first.visaType,
        jurisdiction: first.jurisdiction,
        companyName: uniqueJoined(sorted.map(passenger => passenger.companyName)),
        gltsApplicationId: uniqueJoined(sorted.map(passenger => passenger.gltsApplicationId)),
        customerSegment: first.customerSegment,
        fundTransfer: first.fundTransfer ? { ...first.fundTransfer } : undefined,
        allocationNotes: first.fundTransfer?.paymentRemark || first.allocationNotes,
      }
    })
    .sort((a, b) => {
      const aAt = a.allocatedAt || ''
      const bAt = b.allocatedAt || ''
      if (aAt !== bAt) return bAt.localeCompare(aAt)
      return a.passengerLabel.localeCompare(b.passengerLabel)
    })
}

export function matchesFundAllocationBatchSearch(
  batch: FundAllocationBatchRow,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const batchHaystack = [
    batch.passengerLabel,
    batch.allocationBatchId,
    batch.gltsApplicationId,
    batch.companyName,
    batch.country,
    batch.visaType,
    batch.jurisdiction,
    batch.assignedTeam,
    batch.assignedUser,
    batch.allocatedTo,
    batch.allocatedBy,
    batch.allocationNotes,
    batch.fundTransfer?.paymentReference,
    getApplicationCustomerSegmentLabel(batch.customerSegment),
    ...batch.passengers.flatMap(passenger => [
      passenger.passengerName,
      passenger.gltsApplicantId,
      passenger.passportNo,
      ...passenger.selectedServices.map(service => service.serviceName),
    ]),
  ]
    .join(' ')
    .toLowerCase()

  return batchHaystack.includes(q)
}

export function applyFundAllocationBatchFilters(
  batches: FundAllocationBatchRow[],
  filters: FundAllocationQueueFilters,
): FundAllocationBatchRow[] {
  return batches.filter(batch =>
    batch.passengers.some(passenger => {
      if (filters.customerSegment && passenger.customerSegment !== filters.customerSegment) return false
      if (filters.country && passenger.country !== filters.country) return false
      if (filters.visaType && passenger.visaType !== filters.visaType) return false
      if (filters.jurisdiction && passenger.jurisdiction !== filters.jurisdiction) return false
      if (filters.assignedTeam && passenger.assignedTeam !== filters.assignedTeam) return false
      if (filters.assignedUser && passenger.assignedUser !== filters.assignedUser) return false
      return true
    }),
  ).filter(batch => {
    if (filters.dateFrom || filters.dateTo) {
      const matchesDate = batch.passengers.some(passenger =>
        isSubmissionDateInRange(passenger, filters.dateFrom, filters.dateTo),
      )
      if (!matchesDate) return false
    }
    if (filters.search && !matchesFundAllocationBatchSearch(batch, filters.search)) return false
    return true
  })
}

export function getFundAllocationBatchCellValue(batch: FundAllocationBatchRow, key: string): string {
  switch (key) {
    case 'passengers':
    case 'passengerLabel':
      return batch.passengerLabel
    case 'passengerCount':
      return String(batch.passengerCount)
    case 'customerType':
    case 'customerSegment':
      return getApplicationCustomerSegmentLabel(batch.customerSegment)
    case 'application':
      return `${batch.country} ${batch.visaType} ${batch.gltsApplicationId} ${batch.companyName}`.trim()
    case 'applicationId':
      return batch.gltsApplicationId
    case 'companyName':
      return batch.companyName
    case 'country':
      return batch.country
    case 'visaType':
      return batch.visaType
    case 'jurisdiction':
      return batch.jurisdiction
    case 'assignedTeam':
      return batch.assignedTeam || '—'
    case 'assignedUser':
      return batch.assignedUser || '—'
    case 'requestedTotal':
    case 'totalAmount':
      return batch.requestedTotal > 0 ? formatInr(batch.requestedTotal) : '—'
    case 'allocatedAmount':
      return batch.allocatedAmount > 0 ? formatInr(batch.allocatedAmount) : '—'
    case 'allocatedAt':
      return batch.allocatedAt
    case 'allocatedBy':
      return batch.allocatedBy || '—'
    case 'allocatedTo':
      return batch.allocatedTo || '—'
    case 'allocationNotes':
      return batch.allocationNotes || '—'
    default:
      return ''
  }
}
