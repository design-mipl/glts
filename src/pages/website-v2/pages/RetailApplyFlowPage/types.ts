import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import type { ExtractedField } from '@/pages/customer/features/applications/data/applicationFlowData'

export type RetailPhaseId = 'purpose' | 'traveller' | 'documents' | 'extras' | 'pay'

export type RetailStepId =
  | 'visa'
  | 'traveller'
  | 'travelProfile'
  | 'eligibility'
  | 'photo'
  | 'passport'
  | 'confirm'
  | 'requirements'
  | 'jurisdiction'
  | `question:${string}`
  | 'checklist'
  | 'originalDocuments'
  | 'collectionMethod'
  | 'collectionDetails'
  | 'collectionConfirmation'
  | 'insurance'
  | 'flightTicket'
  | 'review'
  | 'payment'
  | 'success'

export interface RetailStepDefinition {
  id: RetailStepId
  phase: RetailPhaseId
  label: string
}

export interface RetailTravellerDetails {
  fullName: string
  passportNumber: string
  dateOfBirth: string
  nationality: string
  email: string
  phone: string
}

export const EMPTY_TRAVELLER_DETAILS: RetailTravellerDetails = {
  fullName: '',
  passportNumber: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  phone: '',
}

export interface RetailCapturedImage {
  dataUrl: string
  capturedAt: string
}

/** One applicant party in the retail apply (supports multi-traveller). */
export interface RetailApplicantParty {
  id: string
  label: string
  details: RetailTravellerDetails
  /** Set when Build profile questionnaire is completed for this traveller. */
  profileComplete?: boolean
  /** Answers collected inside Build profile (questions land here as they are added). */
  profileAnswers?: Record<string, string>
  photo?: RetailCapturedImage
  passport?: RetailCapturedImage
  /** Passport back / address page. */
  passportBack?: RetailCapturedImage
  passportFields?: ExtractedField[]
}

export function createRetailApplicantParty(
  index: number,
  details: RetailTravellerDetails = { ...EMPTY_TRAVELLER_DETAILS },
): RetailApplicantParty {
  return {
    id: `traveller-${index + 1}-${Date.now()}`,
    label: index === 0 ? 'You' : `Traveller ${index + 1}`,
    details: { ...details },
  }
}

export type ExtraServiceChoice = 'self_provided' | 'glts_arranged' | 'skip'

export interface RetailExtraSelection {
  choice: ExtraServiceChoice
  serviceId?: string
}

export interface RetailFlowDraft {
  countryId: string
  visaOfferingId: string
  jurisdictionId?: string
  /** Intended travel date (ISO YYYY-MM-DD) — selected with application city. */
  travelDate?: string
  /** Step the applicant was last viewing — lets a page refresh resume in place, not just restore field values. */
  lastStepId?: RetailStepId
  answers: Record<string, string>
  /** @deprecated Prefer `applicants[0].details` — kept in sync for review/payment helpers. */
  traveller: RetailTravellerDetails
  /** Multi-traveller parties — starts with one card. */
  applicants: RetailApplicantParty[]
  eligibilityAnswerId?: string
  eligibilityStatus?: 'eligible' | 'ineligible'
  /** @deprecated Prefer `applicants[0].photo` */
  photo?: RetailCapturedImage
  /** @deprecated Prefer `applicants[0].passport` */
  passport?: RetailCapturedImage
  /** @deprecated Prefer `applicants[0].passportBack` */
  passportBack?: RetailCapturedImage
  /** @deprecated Prefer `applicants[0].passportFields` */
  passportFields?: ExtractedField[]
  documentUploads: Record<string, RetailCapturedImage>
  collectionMethod?: OriginalDocumentCollectionMethod
  collectionDetails: Record<string, string>
  insurance: RetailExtraSelection
  flightTicket: RetailExtraSelection
  paymentComplete: boolean
}

export function emptyRetailFlowDraft(countryId: string, visaOfferingId: string): RetailFlowDraft {
  const primary = createRetailApplicantParty(0)
  return {
    countryId,
    visaOfferingId,
    answers: {},
    traveller: { ...EMPTY_TRAVELLER_DETAILS },
    applicants: [primary],
    documentUploads: {},
    collectionDetails: {},
    insurance: { choice: 'skip' },
    flightTicket: { choice: 'skip' },
    paymentComplete: false,
  }
}

/** Keep legacy single-traveller fields synced from applicants[0]. */
export function syncPrimaryApplicantMirror(draft: RetailFlowDraft): RetailFlowDraft {
  const primary = draft.applicants[0]
  if (!primary) return draft
  return {
    ...draft,
    traveller: { ...primary.details },
    photo: primary.photo,
    passport: primary.passport,
    passportBack: primary.passportBack,
    passportFields: primary.passportFields,
  }
}
