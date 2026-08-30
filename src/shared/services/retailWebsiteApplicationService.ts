import {
  emptyRetailFlowDraft,
  syncPrimaryApplicantMirror,
  type RetailApplicantParty,
  type RetailFlowDraft,
  type RetailPaymentMethod,
  type RetailStepId,
} from '@/pages/website/pages/RetailApplyFlowPage/types'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import type {
  RetailCustomerPaymentMethod,
  RetailCustomerPaymentSnapshot,
} from '@/shared/types/retailCustomerPayment'
import {
  mockSingleApplications,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { statusToneFromOperational } from '@/pages/customer/features/applications/components/listing/applicationStatus'
import { createGltsApplicationId } from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import type { CustomerPortalRole } from '@/shared/auth/session'
import { formatRetailApplyDropOffLabel } from '@/shared/utils/retailApplyDropOff'
import { getCountryMasterById } from '@/shared/services/countryMasterService'

const PHYSICAL_COLLECTION_FEE_PLACEHOLDER = 499
const INSURANCE_PLACEHOLDER = 504
const DRAFT_STORE_KEY = 'glts:retail-website-application-drafts'
const ACTIVE_DRAFT_KEY = 'glts:retail-apply-active-id'

type DraftStore = Record<string, RetailFlowDraft>

const memoryDrafts: DraftStore = {}

function mapPaymentMethod(method?: RetailPaymentMethod): RetailCustomerPaymentMethod | undefined {
  if (!method) return undefined
  if (method === 'upi' || method === 'card' || method === 'netbanking') return method
  return 'other'
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function readPersistedStore(): DraftStore {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as DraftStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writePersistedStore(store: DraftStore) {
  try {
    sessionStorage.setItem(DRAFT_STORE_KEY, JSON.stringify(store))
  } catch {
    // mock mode — ignore quota / private browsing
  }
}

function readAllDrafts(): DraftStore {
  return { ...readPersistedStore(), ...memoryDrafts }
}

function putDraft(draft: RetailFlowDraft) {
  if (!draft.applicationId) return
  memoryDrafts[draft.applicationId] = draft
  const next = { ...readPersistedStore(), [draft.applicationId]: draft }
  writePersistedStore(next)
}

export function getRetailWebsiteDraft(applicationId: string): RetailFlowDraft | undefined {
  return readAllDrafts()[applicationId]
}

export function getRetailWebsitePaymentLinkSentAt(applicationId: string): string | undefined {
  return mockSingleApplications.find(row => row.id === applicationId)?.retailApply?.paymentLinkSentAt
}

function findRetailListingRow(applicationId: string): SingleApplicationRow | undefined {
  return mockSingleApplications.find(row => row.id === applicationId)
}

function applicantListingName(draft: RetailFlowDraft): string {
  const names = (draft.applicants ?? [])
    .map(applicant => applicant.details?.fullName?.trim())
    .filter((name): name is string => Boolean(name))
  if (names.length === 0) {
    const fallback = draft.traveller?.fullName?.trim()
    return fallback || 'Retail applicant'
  }
  if (names.length === 1) return names[0]
  return `${names[0]} + ${names.length - 1}`
}

function primaryApplicant(draft: RetailFlowDraft): RetailApplicantParty | undefined {
  return draft.applicants?.[0]
}

function buildDropOffPatch(
  draft: RetailFlowDraft,
  dropOff?: {
    stepId?: RetailStepId
    stepLabel?: string
    stepIndex?: number
    totalSteps?: number
    paymentLinkSentAt?: string
  },
): NonNullable<SingleApplicationRow['retailApply']> {
  const existing = findRetailListingRow(draft.applicationId ?? '')?.retailApply
  const lastStepId = dropOff?.stepId ?? draft.lastStepId ?? existing?.lastStepId
  const lastStepLabel = dropOff?.stepLabel ?? existing?.lastStepLabel
  const lastStepIndex = dropOff?.stepIndex ?? existing?.lastStepIndex
  const totalSteps = dropOff?.totalSteps ?? existing?.totalSteps
  const paymentLinkSentAt = dropOff?.paymentLinkSentAt ?? existing?.paymentLinkSentAt
  return {
    countryId: draft.countryId,
    visaOfferingId: draft.visaOfferingId,
    lastStepId,
    lastStepLabel,
    lastStepIndex,
    totalSteps,
    paymentLinkSentAt,
  }
}

export function formatRetailWebsiteDropOff(row: SingleApplicationRow): string {
  if (row.operationalStatus !== 'Draft') return row.processingStage
  if (!row.retailApply) return row.processingStage || 'Draft'
  return formatRetailApplyDropOffLabel(row.retailApply)
}

function upsertListingDraftRow(
  draft: RetailFlowDraft,
  extras: {
    journey?: RetailJourney
    creatorEmail: string
    creatorRole: CustomerPortalRole
    dropOff?: Parameters<typeof buildDropOffPatch>[1]
    payment?: RetailCustomerPaymentSnapshot
    submitted?: boolean
  },
): SingleApplicationRow {
  const id = draft.applicationId || createGltsApplicationId()
  const now = todayIsoDate()
  const primary = primaryApplicant(draft)
  const retailApply = buildDropOffPatch({ ...draft, applicationId: id }, extras.dropOff)
  const processingStage = extras.submitted
    ? 'Ready for submission'
    : formatRetailApplyDropOffLabel(retailApply)
  const operationalStatus = extras.submitted ? 'Verification Pending' : 'Draft'
  const country =
    extras.journey?.country.name ??
    getCountryMasterById(draft.countryId)?.name ??
    findRetailListingRow(id)?.country ??
    (draft.countryId ? 'Pending' : 'Destination pending')
  const countryFlag =
    extras.journey?.country.flag ??
    getCountryMasterById(draft.countryId)?.flag ??
    findRetailListingRow(id)?.countryFlag
  const visaType =
    extras.journey?.visaType.name ?? findRetailListingRow(id)?.visaType ?? (draft.visaOfferingId ? 'Pending' : '—')

  const row: SingleApplicationRow = {
    id,
    recordType: 'single',
    applicantName: applicantListingName(draft),
    passportNumber: primary?.details?.passportNumber?.trim() || '—',
    country,
    countryFlag,
    visaType,
    jurisdiction: draft.jurisdictionName || undefined,
    travelDate: draft.travelDate || now,
    submissionDate: extras.submitted ? now : '',
    createdAt: findRetailListingRow(id)?.createdAt ?? now,
    lastUpdated: now,
    processingStage,
    operationalStatus,
    status: operationalStatus,
    statusTone: statusToneFromOperational(operationalStatus),
    createdByEmail: extras.creatorEmail,
    createdByRole: extras.creatorRole,
    customerSegment: 'retail',
    retailApply,
    ...(extras.payment ? { customerPayment: extras.payment } : {}),
    paymentComplete: extras.submitted ? false : findRetailListingRow(id)?.paymentComplete,
    ...(extras.submitted
      ? {
          processingStageDates: {
            ready: new Date().toISOString(),
            submitted: new Date().toISOString(),
          },
        }
      : {}),
  }

  const existingIndex = mockSingleApplications.findIndex(entry => entry.id === id)
  if (existingIndex >= 0) {
    mockSingleApplications[existingIndex] = {
      ...mockSingleApplications[existingIndex],
      ...row,
      createdAt: mockSingleApplications[existingIndex].createdAt,
      assignedTeamId: mockSingleApplications[existingIndex].assignedTeamId,
      assignedUserId: mockSingleApplications[existingIndex].assignedUserId,
      priority: mockSingleApplications[existingIndex].priority,
      isVip: mockSingleApplications[existingIndex].isVip,
    }
    return mockSingleApplications[existingIndex]
  }

  mockSingleApplications.unshift(row)
  return row
}

export interface EnsureRetailWebsiteDraftInput {
  countryId: string
  visaOfferingId: string
  applicationId?: string
  startFresh?: boolean
  creatorEmail: string
  creatorRole: CustomerPortalRole
}

export function beginNewRetailWebsiteApplication() {
  try {
    sessionStorage.removeItem(ACTIVE_DRAFT_KEY)
  } catch {
    // ignore
  }
}

/**
 * Delete an ongoing (Draft) website retail application and its local draft payload.
 * Purchased / submitted applications are not removable via this path.
 */
export function deleteRetailWebsiteApplicationDraft(applicationId: string): boolean {
  const listing = findRetailListingRow(applicationId)
  if (listing && listing.operationalStatus !== 'Draft') return false

  const listingIdx = mockSingleApplications.findIndex(row => row.id === applicationId)
  if (listingIdx >= 0) {
    if (mockSingleApplications[listingIdx].operationalStatus !== 'Draft') return false
    mockSingleApplications.splice(listingIdx, 1)
  }

  delete memoryDrafts[applicationId]
  const persisted = readPersistedStore()
  if (persisted[applicationId]) {
    delete persisted[applicationId]
    writePersistedStore(persisted)
  }

  try {
    if (sessionStorage.getItem(ACTIVE_DRAFT_KEY) === applicationId) {
      sessionStorage.removeItem(ACTIVE_DRAFT_KEY)
    }
  } catch {
    // ignore
  }

  return listingIdx >= 0 || Boolean(listing)
}

export function ensureRetailWebsiteApplicationDraft(
  input: EnsureRetailWebsiteDraftInput,
): { id: string; draft: RetailFlowDraft } {
  if (input.applicationId) {
    const existing = getRetailWebsiteDraft(input.applicationId)
    if (existing) {
      const draft = syncPrimaryApplicantMirror({ ...existing, applicationId: input.applicationId })
      putDraft(draft)
      try {
        sessionStorage.setItem(ACTIVE_DRAFT_KEY, input.applicationId)
      } catch {
        // ignore
      }
      return { id: input.applicationId, draft }
    }
    const listing = findRetailListingRow(input.applicationId)
    const countryId = listing?.retailApply?.countryId || input.countryId
    const visaOfferingId = listing?.retailApply?.visaOfferingId || input.visaOfferingId
    const draft = syncPrimaryApplicantMirror({
      ...emptyRetailFlowDraft(countryId, visaOfferingId),
      applicationId: input.applicationId,
      lastStepId: listing?.retailApply?.lastStepId as RetailStepId | undefined,
    })
    putDraft(draft)
    try {
      sessionStorage.setItem(ACTIVE_DRAFT_KEY, input.applicationId)
    } catch {
      // ignore
    }
    return { id: input.applicationId, draft }
  }

  try {
    const activeId = sessionStorage.getItem(ACTIVE_DRAFT_KEY)
    if (activeId) {
      const active = getRetailWebsiteDraft(activeId)
      const listing = findRetailListingRow(activeId)
      if (active && listing?.operationalStatus === 'Draft' && active.countryId === input.countryId) {
        return { id: activeId, draft: syncPrimaryApplicantMirror(active) }
      }
    }
  } catch {
    // ignore
  }

  const id = createGltsApplicationId()
  const initialStepId = input.countryId ? 'visa' : 'destination'
  const draft = syncPrimaryApplicantMirror({
    ...emptyRetailFlowDraft(input.countryId, input.visaOfferingId),
    applicationId: id,
    lastStepId: initialStepId,
  })
  putDraft(draft)
  upsertListingDraftRow(draft, {
    creatorEmail: input.creatorEmail,
    creatorRole: input.creatorRole,
    dropOff: {
      stepId: initialStepId,
      stepLabel: initialStepId === 'destination' ? 'Destination' : 'Visa type',
      stepIndex: 1,
      totalSteps: initialStepId === 'destination' ? 1 : 14,
    },
  })
  try {
    sessionStorage.setItem(ACTIVE_DRAFT_KEY, id)
  } catch {
    // ignore
  }
  return { id, draft }
}

export function persistRetailWebsiteDraftProgress(input: {
  applicationId: string
  draft: RetailFlowDraft
  journey?: RetailJourney
  stepId?: RetailStepId
  stepLabel?: string
  stepIndex?: number
  totalSteps?: number
  creatorEmail: string
  creatorRole: CustomerPortalRole
}): void {
  const listing = findRetailListingRow(input.applicationId)
  if (listing && listing.operationalStatus !== 'Draft') return

  const draft = syncPrimaryApplicantMirror({
    ...input.draft,
    applicationId: input.applicationId,
    lastStepId: input.stepId ?? input.draft.lastStepId,
  })
  putDraft(draft)
  upsertListingDraftRow(draft, {
    journey: input.journey,
    creatorEmail: listing?.createdByEmail || input.creatorEmail,
    creatorRole: listing?.createdByRole || input.creatorRole,
    dropOff: {
      stepId: input.stepId,
      stepLabel: input.stepLabel,
      stepIndex: input.stepIndex,
      totalSteps: input.totalSteps,
      paymentLinkSentAt: listing?.retailApply?.paymentLinkSentAt,
    },
    payment: listing?.customerPayment,
  })
}

function pricingSnapshot(
  journey: RetailJourney,
  draft: RetailFlowDraft,
  status: RetailCustomerPaymentSnapshot['status'],
): RetailCustomerPaymentSnapshot {
  const applicants = draft.applicants?.length
    ? draft.applicants
    : [{ id: 'self', label: 'You', details: draft.traveller }]
  const travellerCount = Math.max(1, applicants.length)

  const embassyFeeTotal = journey.pricing.visaFee.reduce((sum, item) => sum + item.amount, 0)
  const vfsFeeTotal = journey.pricing.vfsServiceRates
    .filter(rate => !rate.isUrgentCharge)
    .reduce((sum, rate) => sum + rate.amount, 0)
  const gltsServiceFee = 2499 + vfsFeeTotal
  const physicalCollectionFee =
    journey.allowsPhysicalOriginalDocuments && draft.collectionMethod
      ? PHYSICAL_COLLECTION_FEE_PLACEHOLDER
      : 0
  const insuranceSelected = draft.insurance.choice === 'glts_arranged'
  const insuranceUnit =
    journey.insuranceServices.find(s => s.id === draft.insurance.serviceId)?.defaultPrice ??
    INSURANCE_PLACEHOLDER
  const insuranceTotal = insuranceSelected ? insuranceUnit * travellerCount : 0

  const lineItems = [
    { id: 'visa-fees', label: 'Visa fees', amount: embassyFeeTotal },
    { id: 'service-fees', label: 'GLTS service fees', amount: gltsServiceFee },
  ]
  if (physicalCollectionFee > 0) {
    lineItems.push({ id: 'courier', label: 'Physical collection / courier', amount: physicalCollectionFee })
  }
  if (insuranceTotal > 0) {
    lineItems.push({ id: 'insurance', label: 'Travel insurance', amount: insuranceTotal })
  }

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const tierLabels = draft.processingTier
    ? draft.processingTier.charAt(0).toUpperCase() + draft.processingTier.slice(1)
    : undefined

  return {
    status,
    method: status === 'paid' ? mapPaymentMethod(draft.paymentMethod) : undefined,
    paidAt: status === 'paid' ? new Date().toISOString() : undefined,
    currency: 'INR',
    lineItems,
    totalAmount,
    referenceNumber:
      status === 'paid'
        ? `WEB-${Date.now().toString(36).toUpperCase()}`
        : `PAY-${(draft.applicationId ?? 'DRAFT').replace('GL-', '')}`,
    processingTierLabel: tierLabels,
    travellerCount,
  }
}

/**
 * Build a customer-payment snapshot from the website retail payment step.
 */
export function buildCustomerPaymentFromRetailDraft(
  journey: RetailJourney,
  draft: RetailFlowDraft,
): RetailCustomerPaymentSnapshot {
  return pricingSnapshot(journey, draft, 'paid')
}

export interface CreateRetailApplicationFromWebsiteInput {
  journey: RetailJourney
  draft: RetailFlowDraft
  payment: RetailCustomerPaymentSnapshot
}

/**
 * Persist a website retail checkout as a submitted retail application for Admin Application Management.
 */
export function createRetailApplicationFromWebsitePayment(
  input: CreateRetailApplicationFromWebsiteInput,
): { id: string } {
  const { journey, draft, payment } = input
  const id = draft.applicationId || createGltsApplicationId()
  const nextDraft = syncPrimaryApplicantMirror({
    ...draft,
    applicationId: id,
    paymentComplete: true,
    lastStepId: 'success',
  })
  putDraft(nextDraft)
  const primary = primaryApplicant(nextDraft)
  upsertListingDraftRow(nextDraft, {
    journey,
    creatorEmail: primary?.details?.email?.trim() || 'website@glts.com',
    creatorRole: 'booker',
    payment,
    submitted: true,
    dropOff: { stepId: 'success', stepLabel: 'Success', stepIndex: 14, totalSteps: 14 },
  })
  try {
    sessionStorage.removeItem(ACTIVE_DRAFT_KEY)
  } catch {
    // ignore
  }
  return { id }
}

export function sendRetailWebsitePaymentLink(input: {
  journey: RetailJourney
  draft: RetailFlowDraft
  creatorEmail: string
  creatorRole: CustomerPortalRole
}): { id: string; payment: RetailCustomerPaymentSnapshot } {
  const id = input.draft.applicationId || createGltsApplicationId()
  const draft = syncPrimaryApplicantMirror({
    ...input.draft,
    applicationId: id,
    lastStepId: 'payment',
  })
  const payment = pricingSnapshot(input.journey, draft, 'pending')
  putDraft(draft)
  upsertListingDraftRow(draft, {
    journey: input.journey,
    creatorEmail: input.creatorEmail,
    creatorRole: input.creatorRole,
    payment,
    dropOff: {
      stepId: 'payment',
      stepLabel: 'Payment',
      paymentLinkSentAt: new Date().toISOString(),
    },
  })
  const listing = findRetailListingRow(id)
  if (listing?.retailApply) {
    listing.processingStage = formatRetailApplyDropOffLabel(listing.retailApply)
  }
  return { id, payment }
}

function seedDraft(
  applicationId: string,
  countryId: string,
  visaOfferingId: string,
  details: {
    fullName: string
    passportNumber: string
    email: string
    phone: string
    lastStepId: RetailStepId
    travelDate?: string
    jurisdictionName?: string
  },
) {
  if (getRetailWebsiteDraft(applicationId)) return
  const party: RetailApplicantParty = {
    id: `${applicationId}-traveller-1`,
    label: 'You',
    details: {
      fullName: details.fullName,
      passportNumber: details.passportNumber,
      dateOfBirth: '1992-04-16',
      nationality: 'Indian',
      email: details.email,
      phone: details.phone,
    },
  }
  const draft = syncPrimaryApplicantMirror({
    ...emptyRetailFlowDraft(countryId, visaOfferingId),
    applicationId,
    lastStepId: details.lastStepId,
    travelDate: details.travelDate,
    jurisdictionName: details.jurisdictionName,
    traveller: party.details,
    applicants: [party],
  })
  putDraft(draft)
}

seedDraft('GL-820', '4', 'default-evisa-tourist', {
  fullName: 'Anita Desai',
  passportNumber: 'K5529103',
  email: 'anita.desai@email.com',
  phone: '+91 98765 43210',
  lastStepId: 'passport',
  travelDate: '2026-06-12',
  jurisdictionName: 'Delhi',
})
seedDraft('GL-851', '2', 'jp-evisa-tourist', {
  fullName: 'Rohan Mehta',
  passportNumber: 'M2291844',
  email: 'rohan.mehta@email.com',
  phone: '+91 98200 11422',
  lastStepId: 'travelProfile',
  travelDate: '2026-07-04',
})
seedDraft('GL-852', '14', 'schengen-tourist', {
  fullName: 'Neha Kapoor',
  passportNumber: 'N4419022',
  email: 'neha.kapoor@email.com',
  phone: '+91 90012 77881',
  lastStepId: 'payment',
  travelDate: '2026-08-18',
  jurisdictionName: 'Delhi',
})
