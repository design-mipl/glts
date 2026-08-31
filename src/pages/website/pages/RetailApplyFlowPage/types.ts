import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import type { ExtractedField } from '@/pages/customer/features/applications/data/applicationFlowData'

export type RetailPhaseId =
  | 'destination'
  | 'purpose'
  | 'traveller'
  | 'sponsor'
  | 'documents'
  | 'collection'
  | 'extras'
  | 'review'
  | 'pay'

export type RetailStepId =
  | 'destination'
  | 'visa'
  | 'traveller'
  | 'travelProfile'
  | 'sponsor'
  | 'sponsorDocs'
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

/**
 * Per-traveller sponsor (B10).
 * Binary: Individual (self-funded) or Someone else + profile + bank statement.
 */
export type RetailTravellerSponsor =
  | { mode: 'individual' }
  | {
      mode: 'someone_else'
      name: string
      relationship: string
      /**
       * @deprecated Phone/email are no longer collected for sponsors (client decision) and
       * neither are sponsor bank details. Kept optional so sessionStorage drafts written by
       * an earlier build still parse — nothing reads it any more.
       */
      contact?: string
      /** True after Build sponsor profile modal is completed. */
      profileComplete?: boolean
    }

/**
 * @deprecated Application-level sponsor — migrated to `applicants[].sponsor` in normalizeDraft.
 * Kept so sessionStorage drafts don’t crash mid-read.
 */
export type RetailSponsorSelection =
  | { mode: 'traveller'; applicantId: string }
  | { mode: 'self_paying' }
  | { mode: 'someone_else'; name: string }

/** Document upload id for sponsor bank statement (keyed via checklistUploadKey). */
export const SPONSOR_BANK_STATEMENT_DOC_ID = 'sponsor_bank_statement' as const

/** Traveller's own bank statement on the essential-documents step. */
export const TRAVELLER_BANK_STATEMENT_DOC_ID = 'bank_statement' as const

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
  /** Who's paying for this traveller's trip (B10 — per traveller). */
  sponsor?: RetailTravellerSponsor
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

export type RetailProcessingTier = 'standard' | 'priority' | 'concierge'

export type RetailPaymentMethod = 'upi' | 'card' | 'netbanking'

export interface RetailExtraSelection {
  choice: ExtraServiceChoice
  serviceId?: string
  /** Own policy/ticket file, captured directly on this step when `choice` is `self_provided`. */
  document?: RetailCapturedImage
}

export interface RetailFlowDraft {
  /** GLTS listing id once the apply session is persisted as a draft. */
  applicationId?: string
  countryId: string
  visaOfferingId: string
  jurisdictionId?: string
  /** Display name for resolved application centre (e.g. Delhi). */
  jurisdictionName?: string
  /** Passport issuing state — used to resolve jurisdiction (customer create flow). */
  issuedPassportState?: string
  /** Place of residence (>6 months) — preferred over passport state for jurisdiction. */
  placeOfResidence?: string
  /** Start of the intended trip (ISO YYYY-MM-DD) — selected with application city. */
  travelDate?: string
  /** End of the intended trip (ISO YYYY-MM-DD). Travel is a range, not a single day. */
  travelDateEnd?: string
  /** Step the applicant was last viewing — lets a page refresh resume in place, not just restore field values. */
  lastStepId?: RetailStepId
  answers: Record<string, string>
  /** @deprecated Prefer `applicants[0].details` — kept in sync for review/payment helpers. */
  traveller: RetailTravellerDetails
  /** Multi-traveller parties — starts with one card. */
  applicants: RetailApplicantParty[]
  eligibilityAnswerId?: string
  eligibilityStatus?: 'eligible' | 'ineligible'
  /**
   * @deprecated Prefer `applicants[].sponsor` (per-traveller).
   * Still read once during draft normalize for in-progress sessionStorage drafts.
   */
  sponsor?: RetailSponsorSelection
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
  processingTier?: RetailProcessingTier
  paymentMethod?: RetailPaymentMethod
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
