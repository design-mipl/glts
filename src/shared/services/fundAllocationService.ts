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
  FundAllocationStatus,
} from '@/shared/types/fundAllocation'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import {
  isApplicationSubmitted,
  isApplicationVfsSubmissionPending,
} from '@/shared/utils/applicationProcessingQueueUtils'
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
  }
}

let overlayStore = new Map<string, FundAllocationOverlay>(
  Object.entries(SEED_FUND_ALLOCATION_OVERLAYS).map(([id, overlay]) => [id, cloneOverlay(overlay)]),
)

function defaultOverlay(): FundAllocationOverlay {
  return {
    allocationStatus: 'pending_allocation',
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
    totalAmount: overlay.totalAmount,
    allocatedAmount: overlay.allocatedAmount,
    selectedServices: overlay.selectedServices.map(line => ({ ...line })),
    cardId: overlay.cardId,
    cardName: resolveCardLabel(overlay.cardId),
    allocatedAt: overlay.allocatedAt,
    allocatedBy: resolveAllocatedBy(row),
    allocatedTo: resolveAllocatedTo(row),
    allocationNotes: overlay.allocationNotes,
    suggestedAllocationAmount: suggestedAmount,
    lastUpdated: overlay.lastUpdated,
  }
}

function listVfsPendingOperationalRows(): OperationalPassengerRow[] {
  const pendingAppIds = vfsSubmissionPendingApplicationIds()

  return APPLICATION_CUSTOMER_SEGMENTS.flatMap(segment =>
    operationalPassengerAssignmentService.list(segment),
  ).filter(row => pendingAppIds.has(row.gltsApplicationId))
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
  return fundAllocationService.getById(id)
}

export const fundAllocationService = {
  list(): FundAllocationPassengerRow[] {
    return listVfsPendingOperationalRows()
      .map(toFundAllocationRow)
      .sort((a, b) => {
        const statusOrder: Record<FundAllocationStatus, number> = {
          pending_allocation: 0,
          allocated: 1,
        }
        const statusDiff = statusOrder[a.allocationStatus] - statusOrder[b.allocationStatus]
        if (statusDiff !== 0) return statusDiff
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
    return this.list().find(row => row.id === id)
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

  allocateFunds(id: string, input: FundAllocationActionInput): FundAllocationPassengerRow | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined

    return mutate(id, overlay => {
      overlay.allocationStatus = 'allocated'
      overlay.selectedServices = input.selectedServices.map(line => ({ ...line }))
      overlay.totalAmount = input.totalAmount
      overlay.allocatedAmount = input.allocatedAmount
      overlay.cardId = input.cardId
      overlay.allocatedAt = nowIso()
      overlay.allocationNotes = input.notes?.trim() ?? ''
    })
  },

  allocateFundsBulk(
    ids: string[],
    buildInput: (record: FundAllocationPassengerRow) => FundAllocationActionInput | null,
  ): FundAllocationPassengerRow[] {
    const results: FundAllocationPassengerRow[] = []
    for (const id of ids) {
      const record = this.getById(id)
      if (!record || record.allocationStatus !== 'pending_allocation') continue
      const input = buildInput(record)
      if (!input) continue
      const updated = this.allocateFunds(id, input)
      if (updated) results.push(updated)
    }
    return results
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
