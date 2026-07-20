import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { APPLICATION_CUSTOMER_SEGMENTS } from '@/shared/config/applicationCustomerSegmentConfig'
import { SEED_FUND_ALLOCATION_OVERLAYS } from '@/shared/data/mockFundAllocation'
import { applicationFormAssistService } from '@/shared/services/applicationFormAssistService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'
import { resolveCardLabel } from '@/shared/utils/cardMasterOptions'
import { resolveFundAllocationOfferingContext } from '@/shared/utils/fundAllocationOfferingUtils'
import type {
  FundAllocationActionInput,
  FundAllocationOverlay,
  FundAllocationPassengerRow,
  FundAllocationRequestInput,
  FundAllocationStatus,
} from '@/shared/types/fundAllocation'
import { getFundTransferTypeLabel } from '@/shared/types/fundAllocation'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import {
  isApplicationSubmitted,
  isApplicationVfsSubmissionPending,
} from '@/shared/utils/applicationProcessingQueueUtils'
import {
  generateAllocationBatchId,
  groupPassengersIntoAllocationBatches,
} from '@/shared/utils/fundAllocationBatchUtils'
import {
  resolveVfsPickerServices,
  sumVfsPickerServiceAmounts,
} from '@/shared/utils/vfsServicePickerUtils'

function nowIso() {
  return new Date().toISOString()
}

function cloneOverlay(overlay: FundAllocationOverlay): FundAllocationOverlay {
  return {
    ...overlay,
    selectedServices: overlay.selectedServices.map(line => ({ ...line })),
    fundTransfer: overlay.fundTransfer ? { ...overlay.fundTransfer } : undefined,
  }
}

let overlayStore = new Map<string, FundAllocationOverlay>(
  Object.entries(SEED_FUND_ALLOCATION_OVERLAYS).map(([id, overlay]) => [id, cloneOverlay(overlay)]),
)

function defaultOverlay(): FundAllocationOverlay {
  return {
    allocationStatus: 'pending_allocation',
    allocationBatchId: '',
    fundRequested: false,
    requestedAt: '',
    totalAmount: 0,
    allocatedAmount: 0,
    selectedServices: [],
    cardId: '',
    allocatedAt: '',
    allocationNotes: '',
    lastUpdated: nowIso(),
  }
}

/** Latest assigner from Assignment & Priority assignment history. */
function resolveAllocatedBy(row: OperationalPassengerRow): string {
  return row.assignmentHistory[0]?.assignedBy?.trim() || ''
}

/** Current assignee from Assignment & Priority Management. */
function resolveAllocatedTo(row: OperationalPassengerRow): string {
  if (row.assigneeType === 'vendor') {
    return [row.assignedVendor, row.assignedUser].filter(Boolean).join(' · ')
  }
  if (row.assigneeType === 'passenger') {
    return row.assignedUser ? `Passenger · ${row.assignedUser}` : ''
  }
  return [row.assignedUser, row.assignedTeam].filter(Boolean).join(' · ')
}

function suggestAllocationAmount(
  country: string,
  visaType: string,
  jurisdiction: string,
): number {
  const offeringContext = resolveFundAllocationOfferingContext(country, visaType, jurisdiction)
  const services = resolveVfsPickerServices({
    country,
    visaType,
    ...offeringContext,
  })
  return sumVfsPickerServiceAmounts(services)
}

function findApplicationById(applicationId: string): ApplicationListingRow | undefined {
  return (
    mockSingleApplications.find(app => app.id === applicationId) ??
    mockBulkBatches.find(app => app.id === applicationId)
  )
}

function resolveTravelerRowId(row: OperationalPassengerRow): string {
  const detail = marineApplicationAdminService.getDetail(row.gltsApplicationId)
  const queueRows = detail.uploadQueueRows.filter(r => r.status !== 'processing')
  const byApplicant = queueRows.find(r => r.gltsApplicantId === row.gltsApplicantId)
  if (byApplicant) return byApplicant.id
  const bySequence = queueRows.find(r => r.sequenceNo === row.sequenceNo)
  if (bySequence) return bySequence.id
  return `q${row.sequenceNo}`
}

function resolveMatchingOperationalCase(row: OperationalPassengerRow) {
  const passport = row.passportNo.replace(/\s/g, '').toUpperCase()
  return operationalCaseHandlingService.listByApplicationId(row.gltsApplicationId).find(caseRow => {
    if (caseRow.gltsApplicantId && caseRow.gltsApplicantId === row.gltsApplicantId) return true
    return caseRow.passportNumber.replace(/\s/g, '').toUpperCase() === passport
  })
}

/**
 * Portal date sources:
 * - Application Management: Online Submission, VFS Submission, Tentative Collection
 * - Ground Operations: Submission Date (= VFS Submission Date), Collection Date (actual)
 */
function resolvePortalDates(row: OperationalPassengerRow) {
  const application = findApplicationById(row.gltsApplicationId)
  const assist = applicationFormAssistService.getRecord(
    row.gltsApplicationId,
    resolveTravelerRowId(row),
  ).submission
  const opsCase = resolveMatchingOperationalCase(row)

  const onlineSubmissionDate =
    assist.submissionDate.trim() ||
    application?.submissionDate?.trim() ||
    row.submissionDate.trim() ||
    ''

  const vfsSubmissionDate =
    assist.vfsSubmissionDate.trim() ||
    opsCase?.submissionDate?.trim() ||
    ''

  const tentativeCollectionDate =
    assist.tentativeCollectionDate.trim() ||
    application?.tentativeCollectionDate?.trim() ||
    ''

  const collectionDate = opsCase?.collectionDate?.trim() || ''

  return {
    onlineSubmissionDate,
    vfsSubmissionDate,
    tentativeCollectionDate,
    collectionDate,
    /** Listing / date-filter value prefers VFS date when present. */
    submissionDate: vfsSubmissionDate || onlineSubmissionDate,
  }
}

function vfsSubmissionPendingApplicationIds(): Set<string> {
  const ids = new Set<string>()
  for (const app of [...mockSingleApplications, ...mockBulkBatches]) {
    if (isApplicationSubmitted(app) && isApplicationVfsSubmissionPending(app)) {
      ids.add(app.id)
    }
  }
  return ids
}

function toFundAllocationRow(row: OperationalPassengerRow): FundAllocationPassengerRow {
  const offeringContext = resolveFundAllocationOfferingContext(row.country, row.visaType, row.jurisdiction)
  const suggestedAmount = suggestAllocationAmount(row.country, row.visaType, row.jurisdiction)
  const overlay = overlayStore.get(row.id) ?? defaultOverlay()
  const dates = resolvePortalDates(row)

  return {
    id: row.id,
    gltsApplicantId: row.gltsApplicantId,
    gltsApplicationId: row.gltsApplicationId,
    sequenceNo: row.sequenceNo,
    passengerName: row.passengerName,
    passportNo: row.passportNo,
    companyName: row.companyName,
    country: row.country,
    countryFlag: row.countryFlag,
    visaType: row.visaType,
    jurisdiction: row.jurisdiction,
    countryId: offeringContext.countryId,
    visaOfferingId: offeringContext.visaOfferingId,
    jurisdictionId: offeringContext.jurisdictionId,
    travelDate: row.travelDate,
    onlineSubmissionDate: dates.onlineSubmissionDate,
    vfsSubmissionDate: dates.vfsSubmissionDate,
    tentativeCollectionDate: dates.tentativeCollectionDate,
    collectionDate: dates.collectionDate,
    submissionDate: dates.submissionDate,
    submissionStatus: row.submissionStatus,
    customerSegment: row.customerSegment,
    allocationStatus: overlay.allocationStatus,
    allocationBatchId: overlay.allocationBatchId?.trim() || '',
    fundRequested: overlay.fundRequested,
    requestedAt: overlay.requestedAt,
    totalAmount: overlay.totalAmount,
    allocatedAmount: overlay.allocatedAmount,
    selectedServices: overlay.selectedServices.map(line => ({ ...line })),
    cardId: overlay.cardId,
    cardName: resolveCardLabel(overlay.cardId),
    fundTransfer: overlay.fundTransfer ? { ...overlay.fundTransfer } : undefined,
    allocatedAt: overlay.allocatedAt,
    allocatedBy: resolveAllocatedBy(row),
    allocatedTo: resolveAllocatedTo(row),
    assignedTeam: row.assignedTeam?.trim() || '',
    assignedUser: row.assignedUser?.trim() || '',
    allocationNotes: overlay.allocationNotes,
    suggestedAllocationAmount: suggestedAmount,
    lastUpdated: overlay.lastUpdated,
  }
}

function findOperationalPassengerRow(id: string): OperationalPassengerRow | undefined {
  for (const segment of APPLICATION_CUSTOMER_SEGMENTS) {
    const row = operationalPassengerAssignmentService.getById(id, segment)
    if (row) return row
  }
  return undefined
}

function syncOverlayToGroundOps(passengerId: string, overlay: FundAllocationOverlay) {
  const passenger = findOperationalPassengerRow(passengerId)
  if (!passenger) return

  const opsCase = resolveMatchingOperationalCase(passenger)
  if (!opsCase) return

  const fundTransferLabel = overlay.fundTransfer?.transferType
    ? overlay.fundTransfer.transferType === 'card' && overlay.fundTransfer.assignedCardId
      ? `${getFundTransferTypeLabel(overlay.fundTransfer.transferType)} · ${resolveCardLabel(overlay.fundTransfer.assignedCardId)}`
      : getFundTransferTypeLabel(overlay.fundTransfer.transferType)
    : resolveCardLabel(overlay.cardId)

  operationalCaseHandlingService.syncFundAllocation(opsCase.id, {
    status: overlay.allocationStatus,
    fundRequested: overlay.fundRequested,
    totalAmount: overlay.totalAmount,
    allocatedAmount: overlay.allocatedAmount,
    cardId: overlay.cardId,
    fundTransferLabel: fundTransferLabel !== '—' ? fundTransferLabel : undefined,
    serviceNames: overlay.selectedServices.map(line => line.serviceName),
    requestedAt: overlay.requestedAt,
    allocatedAt: overlay.allocatedAt,
    notes: overlay.allocationNotes,
    allocatedTo: resolveAllocatedTo(passenger),
  })
}

function listFundAllocationOperationalRows(): OperationalPassengerRow[] {
  const pendingAppIds = vfsSubmissionPendingApplicationIds()
  const seen = new Map<string, OperationalPassengerRow>()

  for (const segment of APPLICATION_CUSTOMER_SEGMENTS) {
    for (const row of operationalPassengerAssignmentService.list(segment)) {
      const overlay = overlayStore.get(row.id)
      const eligible =
        pendingAppIds.has(row.gltsApplicationId) ||
        overlay?.fundRequested === true ||
        overlay?.allocationStatus === 'allocated'
      if (eligible) seen.set(row.id, row)
    }
  }

  return Array.from(seen.values())
}

function buildFundAllocationRowForId(id: string): FundAllocationPassengerRow | undefined {
  const row = findOperationalPassengerRow(id)
  if (!row) return undefined
  return toFundAllocationRow(row)
}

function ensureOverlay(id: string): FundAllocationOverlay {
  if (overlayStore.has(id)) return overlayStore.get(id)!
  const fresh = defaultOverlay()
  overlayStore.set(id, fresh)
  return fresh
}

function mutate(
  id: string,
  updater: (overlay: FundAllocationOverlay) => void,
): FundAllocationPassengerRow | undefined {
  const overlay = ensureOverlay(id)
  updater(overlay)
  overlay.lastUpdated = nowIso()
  overlayStore.set(id, overlay)
  return buildFundAllocationRowForId(id)
}

export const fundAllocationService = {
  list(): FundAllocationPassengerRow[] {
    return listFundAllocationOperationalRows()
      .map(toFundAllocationRow)
      .sort((a, b) => {
        const statusOrder: Record<FundAllocationStatus, number> = {
          pending_allocation: 0,
          allocated: 1,
        }
        const statusDiff = statusOrder[a.allocationStatus] - statusOrder[b.allocationStatus]
        if (statusDiff !== 0) return statusDiff
        if (a.fundRequested !== b.fundRequested) return a.fundRequested ? -1 : 1
        return a.passengerName.localeCompare(b.passengerName)
      })
  },

  /** All fund-allocation rows for an application (used by Expense Management sync). */
  listByApplicationId(applicationId: string): FundAllocationPassengerRow[] {
    return APPLICATION_CUSTOMER_SEGMENTS.flatMap(segment =>
      operationalPassengerAssignmentService.list(segment),
    )
      .filter(row => row.gltsApplicationId === applicationId)
      .map(toFundAllocationRow)
  },

  getById(id: string): FundAllocationPassengerRow | undefined {
    return buildFundAllocationRowForId(id)
  },

  listVfsServicesForPassenger(record: Pick<
    FundAllocationPassengerRow,
    'country' | 'visaType' | 'countryId' | 'visaOfferingId' | 'jurisdictionId'
  >) {
    return resolveVfsPickerServices({
      country: record.country,
      visaType: record.visaType,
      countryId: record.countryId,
      visaOfferingId: record.visaOfferingId,
      jurisdictionId: record.jurisdictionId,
    })
  },

  suggestAllocationAmount(country: string, visaType: string, jurisdiction: string): number {
    return suggestAllocationAmount(country, visaType, jurisdiction)
  },

  /**
   * Assignment & Priority: request funds for selected VFS services.
   * Leaves status as pending_allocation for Finance to allocate amount + fund transfer.
   */
  requestAllocation(
    id: string,
    input: FundAllocationRequestInput,
  ): FundAllocationPassengerRow | undefined {
    if (input.selectedServices.length === 0 || input.totalAmount <= 0) return undefined
    if (overlayStore.get(id)?.allocationStatus === 'allocated') return undefined

    const updated = mutate(id, overlay => {
      overlay.fundRequested = true
      overlay.requestedAt = nowIso()
      overlay.selectedServices = input.selectedServices.map(line => ({ ...line }))
      overlay.totalAmount = input.totalAmount
      overlay.allocatedAmount = 0
      overlay.allocationBatchId = ''
      overlay.cardId = ''
      overlay.fundTransfer = undefined
      overlay.allocatedAt = ''
      if (input.notes?.trim()) {
        overlay.allocationNotes = input.notes.trim()
      }
      overlay.allocationStatus = 'pending_allocation'
    })

    const overlay = overlayStore.get(id)
    if (overlay) syncOverlayToGroundOps(id, overlay)
    return updated
  },

  allocateFunds(
    id: string,
    input: FundAllocationActionInput,
    options?: { allocationBatchId?: string; allocatedAt?: string },
  ): FundAllocationPassengerRow | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined

    const allocationBatchId = options?.allocationBatchId?.trim() || generateAllocationBatchId()
    const allocatedAt = options?.allocatedAt?.trim() || nowIso()

    const updated = mutate(id, overlay => {
      overlay.allocationStatus = 'allocated'
      overlay.allocationBatchId = allocationBatchId
      overlay.fundRequested = true
      if (!overlay.requestedAt) overlay.requestedAt = nowIso()
      overlay.selectedServices = input.selectedServices.map(line => ({ ...line }))
      overlay.totalAmount = input.totalAmount
      overlay.allocatedAmount = input.allocatedAmount
      overlay.cardId =
        input.fundTransfer.transferType === 'card' ? input.fundTransfer.assignedCardId.trim() : ''
      overlay.fundTransfer = { ...input.fundTransfer }
      overlay.allocatedAt = allocatedAt
      overlay.allocationNotes =
        input.notes?.trim() || input.fundTransfer.paymentRemark?.trim() || ''
    })

    const overlay = overlayStore.get(id)
    if (overlay) syncOverlayToGroundOps(id, overlay)
    return updated
  },

  allocateFundsBulk(
    ids: string[],
    buildInput: (record: FundAllocationPassengerRow) => FundAllocationActionInput | null,
  ): FundAllocationPassengerRow[] {
    const allocationBatchId = generateAllocationBatchId()
    const allocatedAt = nowIso()
    const results: FundAllocationPassengerRow[] = []
    for (const id of ids) {
      const record = this.getById(id)
      if (!record || record.allocationStatus !== 'pending_allocation') continue
      const input = buildInput(record)
      if (!input) continue
      const updated = this.allocateFunds(id, input, { allocationBatchId, allocatedAt })
      if (updated) results.push(updated)
    }
    return results
  },

  listAllocatedBatches() {
    return groupPassengersIntoAllocationBatches(
      this.list().filter(row => row.allocationStatus === 'allocated'),
    )
  },

  resetStoreForDemo() {
    overlayStore = new Map(
      Object.entries(SEED_FUND_ALLOCATION_OVERLAYS).map(([entryId, overlay]) => [
        entryId,
        cloneOverlay(overlay),
      ]),
    )
  },
}

export type { FundAllocationPassengerRow }
