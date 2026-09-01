/**
 * Retail application flow — composition layer over existing masters.
 *
 * This is intentionally thin: it does not introduce a new source of truth for documents,
 * pricing, or jurisdictions. It composes `countryMasterService`, `jurisdictionRequirementPreview`,
 * `embassyVfsFeeMasterService`, `serviceMasterService`, and `documentMasterService` — plus
 * Requirement Master packs mapped on Country Master (`requirementPackId`) and the fallback
 * `retailJourneyRules` — into the shape the retail UI steps consume.
 */

import {
  getCountryMasterById,
  getRequirementPreviewCards,
  getSegmentForOffering,
  getVisaOfferingById,
  getVisaTypeForOffering,
  offeringRequiresJurisdictionSelection,
  getApplicableStatesForOffering,
  getOfferingDocumentRules,
  resolveOfferingVfsServiceRates,
  patchStateFromVisaOffering,
} from '@/shared/services/countryMasterService'
import {
  filterRetailChecklistDocuments,
  resolveRetailOriginalDocumentIds,
} from '@/shared/utils/retailDocumentFlowUtils'
import { documentMasterService } from '@/shared/services/documentMasterService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import { embassyVfsFeeMasterService } from '@/shared/services/embassyVfsFeeMasterService'
import {
  getRetailJourneyRules,
  offeringHasEligibilityGate,
  type ConditionalQuestionDefinition,
  type EligibilityRuleDefinition,
} from '@/shared/data/retailJourneyRules'
import type {
  CountryMaster,
  CountryVfsServiceRate,
  CountryVisaJurisdiction,
  CountryVisaOffering,
  CountryVisaType,
  RequirementPreviewCard,
} from '@/shared/types/countryMaster'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { resolveRequirementPackConditionalQuestions } from '@/shared/utils/countryRequirementPackUtils'

export interface RetailChecklistDocument {
  documentId: string
  name: string
  description?: string
  mandatory: boolean
  originalDocument: boolean
  /** True when this document was added by a conditional-question answer, not the base checklist. */
  conditional?: boolean
  acceptedFormats?: string[]
}

export interface RetailAnswers {
  /** questionId -> selected optionId, e.g. { employmentStatus: 'employed' } */
  [questionId: string]: string
}

export interface RetailPricingLineItem {
  id: string
  label: string
  amount: number
  gstIncluded: boolean
}

export interface RetailPricing {
  visaFee: RetailPricingLineItem[]
  vfsServiceRates: CountryVfsServiceRate[]
  total: number
}

export interface RetailJourney {
  country: CountryMaster
  visaType: CountryVisaType
  offering: CountryVisaOffering
  requiresJurisdictionSelection: boolean
  applicableStates: string[]
  hasEligibilityGate: boolean
  eligibility: EligibilityRuleDefinition[]
  conditionalQuestions: ConditionalQuestionDefinition[]
  requirementPreviewCards: RequirementPreviewCard[]
  documents: RetailChecklistDocument[]
  allowsPhysicalOriginalDocuments: boolean
  originalDocumentIds: string[]
  pricing: RetailPricing
  insuranceServices: ServiceMaster[]
  flightTicketServices: ServiceMaster[]
}

export interface ResolveRetailJourneyInput {
  countryId: string
  visaOfferingId: string
  jurisdictionId?: string
  answers?: RetailAnswers
}

function toChecklistDocument(documentId: string, mandatory: boolean, originalDocument: boolean, conditional = false): RetailChecklistDocument {
  const master = documentMasterService.getById(documentId)
  return {
    documentId,
    name: master?.documentType ?? documentId,
    description: master?.description,
    mandatory,
    originalDocument,
    conditional,
  }
}

function resolveConditionalDocuments(
  questions: ConditionalQuestionDefinition[],
  answers: RetailAnswers,
): RetailChecklistDocument[] {
  const seen = new Set<string>()
  const docs: RetailChecklistDocument[] = []

  for (const question of questions) {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) continue
    const option = question.options.find((entry) => entry.id === selectedOptionId)
    if (!option?.extraDocumentIds?.length) continue

    for (const documentId of option.extraDocumentIds) {
      if (seen.has(documentId)) continue
      seen.add(documentId)
      docs.push(toChecklistDocument(documentId, true, false, true))
    }
  }

  return docs
}

/**
 * Master fallback catalogues seed alternate pricing tiers under the same service name
 * (e.g. standard vs premium "Visa Fees" rows). A customer bill should charge the base
 * tier once, not every configured tier — collapse to the cheapest row per service name.
 */
function dedupeVfsServiceRatesByName(rates: CountryVfsServiceRate[]): CountryVfsServiceRate[] {
  const cheapestByName = new Map<string, CountryVfsServiceRate>()
  for (const rate of rates) {
    const existing = cheapestByName.get(rate.serviceName)
    if (!existing || rate.amount < existing.amount) {
      cheapestByName.set(rate.serviceName, rate)
    }
  }
  return [...cheapestByName.values()].sort((a, b) => a.sortOrder - b.sortOrder)
}

function normalizeServiceName(name: string): string {
  return name.trim().toLowerCase()
}

function resolvePricing(
  country: CountryMaster,
  visaType: CountryVisaType,
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): RetailPricing {
  const embassyCard = embassyVfsFeeMasterService.resolveRateCardForApplication(country.name, visaType.name)

  const visaFee: RetailPricingLineItem[] = embassyCard.services.length
    ? embassyCard.services
        .filter((service) => service.enabled)
        .map((service) => ({
          id: service.id,
          label: service.serviceName,
          amount: service.amount,
          gstIncluded: true,
        }))
    : [
        {
          id: 'base-visa-fee',
          label: `${visaType.name} — visa fee`,
          amount: visaType.pricing ?? country.price,
          gstIncluded: true,
        },
      ]

  // The embassy fee card and the VFS service rate catalogue are independent fallback
  // masters that can both apply when a country has no bespoke configuration. When they
  // do, they carry near-duplicate line items (e.g. "Visa fees" vs "Visa Fees") — keep the
  // embassy fee card's row as authoritative and drop any VFS rate that duplicates it by name.
  const visaFeeNames = new Set(visaFee.map((item) => normalizeServiceName(item.label)))
  const vfsServiceRates = dedupeVfsServiceRatesByName(
    resolveOfferingVfsServiceRates(countryId, offeringId, jurisdictionId),
  ).filter((rate) => !visaFeeNames.has(normalizeServiceName(rate.serviceName)))

  const vfsTotal = vfsServiceRates
    .filter((rate) => !rate.isUrgentCharge)
    .reduce((sum, rate) => sum + rate.amount, 0)
  const visaFeeTotal = visaFee.reduce((sum, item) => sum + item.amount, 0)

  return {
    visaFee,
    vfsServiceRates,
    total: visaFeeTotal + vfsTotal,
  }
}

const HOTEL_KEYWORDS = ['hotel', 'accommodation', 'stay booking']

function isHotelService(service: ServiceMaster): boolean {
  const haystack = `${service.serviceName} ${service.subcategory}`.toLowerCase()
  return HOTEL_KEYWORDS.some((keyword) => haystack.includes(keyword))
}

function resolveTravelSupportServices(keyword: string): ServiceMaster[] {
  return serviceMasterService
    .list({ status: 'active', category: 'Travel Support' })
    .filter((service) => !isHotelService(service))
    .filter((service) => `${service.serviceName} ${service.subcategory}`.toLowerCase().includes(keyword))
}

/**
 * Resolve everything a retail application-flow step needs for a given country + visa offering,
 * folding in conditional-question answers (employment status, sponsorship, …) collected so far.
 */
export function resolveRetailJourney(input: ResolveRetailJourneyInput): RetailJourney | undefined {
  const { countryId, visaOfferingId, jurisdictionId, answers = {} } = input

  const country = getCountryMasterById(countryId)
  const visaType = getVisaTypeForOffering(countryId, visaOfferingId)
  const offering = getVisaOfferingById(countryId, visaOfferingId)
  if (!country || !visaType || !offering) return undefined

  const retailSegment = getSegmentForOffering(countryId, visaOfferingId)
  const rules = getRetailJourneyRules(countryId, visaOfferingId)
  const selectedJurisdiction = jurisdictionId
    ? visaType.jurisdictions?.find((entry) => entry.id === jurisdictionId)
    : undefined
  const packQuestions = resolveRequirementPackConditionalQuestions({
    segment: retailSegment,
    visaType,
    jurisdiction: selectedJurisdiction,
  })
  const conditionalQuestions = packQuestions ?? rules.conditionalQuestions ?? []
  const requiresJurisdictionSelection = offeringRequiresJurisdictionSelection(countryId, visaOfferingId)
  const applicableStates = getApplicableStatesForOffering(countryId, visaOfferingId)

  const baseDocumentRules = getOfferingDocumentRules(countryId, visaOfferingId, jurisdictionId)
  const baseDocuments = baseDocumentRules.map((rule) =>
    toChecklistDocument(rule.documentId, rule.mandatory, rule.originalDocument),
  )
  const conditionalDocuments = resolveConditionalDocuments(conditionalQuestions, answers)

  const seenIds = new Set(baseDocuments.map((doc) => doc.documentId))
  const mergedDocuments = [
    ...baseDocuments,
    ...conditionalDocuments.filter((doc) => {
      if (seenIds.has(doc.documentId)) return false
      seenIds.add(doc.documentId)
      return true
    }),
  ]

  const documents = filterRetailChecklistDocuments(mergedDocuments)
  const originalDocumentIds = resolveRetailOriginalDocumentIds(documents)

  return {
    country,
    visaType,
    offering,
    requiresJurisdictionSelection,
    applicableStates,
    hasEligibilityGate: offeringHasEligibilityGate(countryId, visaOfferingId),
    eligibility: rules.eligibility ?? [],
    conditionalQuestions,
    requirementPreviewCards: getRequirementPreviewCards(countryId, visaOfferingId, jurisdictionId),
    documents,
    allowsPhysicalOriginalDocuments: originalDocumentIds.length > 0,
    originalDocumentIds,
    pricing: resolvePricing(country, visaType, countryId, visaOfferingId, jurisdictionId),
    insuranceServices: resolveTravelSupportServices('insurance'),
    flightTicketServices: resolveTravelSupportServices('ticket'),
  }
}

export function resolveJurisdictionOptions(countryId: string, offeringId: string): CountryVisaJurisdiction[] {
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  return (visaType?.jurisdictions ?? []).filter((jurisdiction) => jurisdiction.status === 'active')
}

export { patchStateFromVisaOffering }
