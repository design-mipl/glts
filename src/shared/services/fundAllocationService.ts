import { deriveOperationalPassengerRows } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { APPLICATION_CUSTOMER_SEGMENTS } from '@/shared/config/applicationCustomerSegmentConfig'
import { SEED_FUND_ALLOCATION_OVERLAYS } from '@/shared/data/mockFundAllocation'
import { resolveCreditCardLabel } from '@/shared/utils/creditCardMasterOptions'
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
import { getMasterActor } from '@/shared/utils/masterActor'
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
    creditCardId: '',
    allocatedAt: '',
    allocatedBy: '',
    allocationNotes: '',
    lastUpdated: nowIso(),
  }
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

function parseAppointmentDate(row: OperationalPassengerRow): string {
  const application = findApplicationById(row.gltsApplicationId)
  if (!application) return ''
  if ('appointmentDate' in application && application.appointmentDate) {
    return application.appointmentDate
  }
  return application.submissionDate ?? ''
}

function findApplicationById(applicationId: string): ApplicationListingRow | undefined {
  return (
    mockSingleApplications.find(app => app.id === applicationId) ??
    mockBulkBatches.find(app => app.id === applicationId)
  )
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
    submissionDate: row.submissionDate,
    submissionStatus: row.submissionStatus,
    customerSegment: row.customerSegment,
    appointmentDate: parseAppointmentDate(row),
    allocationStatus: overlay.allocationStatus,
    totalAmount: overlay.totalAmount,
    allocatedAmount: overlay.allocatedAmount,
    selectedServices: overlay.selectedServices.map(line => ({ ...line })),
    creditCardId: overlay.creditCardId,
    creditCardName: resolveCreditCardLabel(overlay.creditCardId),
    allocatedAt: overlay.allocatedAt,
    allocatedBy: overlay.allocatedBy,
    allocationNotes: overlay.allocationNotes,
    suggestedAllocationAmount: suggestedAmount,
    lastUpdated: overlay.lastUpdated,
  }
}

function listVfsPendingOperationalRows(): OperationalPassengerRow[] {
  const pendingAppIds = vfsSubmissionPendingApplicationIds()

  return APPLICATION_CUSTOMER_SEGMENTS.flatMap(segment =>
    deriveOperationalPassengerRows(segment, new Map()),
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
      overlay.creditCardId = input.creditCardId
      overlay.allocatedAt = nowIso()
      overlay.allocatedBy = getMasterActor()
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
