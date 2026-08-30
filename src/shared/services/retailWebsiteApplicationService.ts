import type { RetailFlowDraft, RetailPaymentMethod } from '@/pages/website/pages/RetailApplyFlowPage/types'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import type {
  RetailCustomerPaymentMethod,
  RetailCustomerPaymentSnapshot,
} from '@/shared/types/retailCustomerPayment'
import {
  mockSingleApplications,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { createGltsApplicationId } from '@/pages/customer/features/applications/utils/gltsReferenceIds'

const PHYSICAL_COLLECTION_FEE_PLACEHOLDER = 499
const INSURANCE_PLACEHOLDER = 504

function mapPaymentMethod(method?: RetailPaymentMethod): RetailCustomerPaymentMethod | undefined {
  if (!method) return undefined
  if (method === 'upi' || method === 'card' || method === 'netbanking') return method
  return 'other'
}

/**
 * Build a customer-payment snapshot from the website retail payment step.
 */
export function buildCustomerPaymentFromRetailDraft(
  journey: RetailJourney,
  draft: RetailFlowDraft,
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
  const paidAt = new Date().toISOString()
  const referenceNumber = `WEB-${Date.now().toString(36).toUpperCase()}`

  const tierLabels = draft.processingTier
    ? draft.processingTier.charAt(0).toUpperCase() + draft.processingTier.slice(1)
    : undefined

  return {
    status: 'paid',
    method: mapPaymentMethod(draft.paymentMethod),
    paidAt,
    currency: 'INR',
    lineItems,
    totalAmount,
    referenceNumber,
    processingTierLabel: tierLabels,
    travellerCount,
  }
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
  const applicants = draft.applicants?.length
    ? draft.applicants
    : [{ id: 'self', label: 'You', details: draft.traveller }]
  const primary = applicants[0]
  const now = new Date().toISOString().slice(0, 10)
  const id = createGltsApplicationId()

  const row: SingleApplicationRow = {
    id,
    recordType: 'single',
    applicantName: primary?.details?.fullName?.trim() || primary?.label || 'Retail applicant',
    passportNumber: primary?.details?.passportNumber?.trim() || '—',
    country: journey.country.name,
    countryFlag: journey.country.flag,
    visaType: journey.visaType.name,
    jurisdiction: draft.jurisdictionName || undefined,
    travelDate: draft.travelDate || now,
    submissionDate: now,
    createdAt: now,
    lastUpdated: now,
    processingStage: 'Ready for submission',
    operationalStatus: 'Verification Pending',
    status: 'Verification Pending',
    statusTone: 'review',
    createdByEmail: primary?.details?.email?.trim() || 'website@glts.com',
    createdByRole: 'booker',
    customerSegment: 'retail',
    customerPayment: payment,
    paymentComplete: false,
    processingStageDates: {
      ready: new Date().toISOString(),
      submitted: new Date().toISOString(),
    },
  }

  mockSingleApplications.unshift(row)
  return { id }
}
