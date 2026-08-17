import { ACCOUNT_MAPPED_COUNTRY_IDS, getMockCountryMasters } from '@/shared/data/mockCountryMasters'
import {
  checklistToDocumentMappings,
  resolveOfferingDocumentChecklistItems,
} from '@/shared/data/countryMasterDefaults'
import { getDefaultQcChecklistTemplate, applyQcChecklistKindMetadata } from '@/shared/data/countryQcChecklistDefaults'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { Country } from '@/shared/types/visa'
import type {
  BusinessSegment,
  CountryJurisdictionDocumentRule,
  CountryMaster,
  CountryVisaType,
  CountryVisaJurisdiction,
  CountryVisaOffering,
  CountrySegmentConfig,
  CountryQcChecklistKind,
  CountryQcChecklistTemplate,
  CountryVfsServiceRate,
  VisaApplicationWindow,
  DocumentWorkspaceItem,
  PassportIssueLocation,
  PortalChecklistItem,
  RequirementPreviewCard,
} from '@/shared/types/countryMaster'
import {
  countryHasBookableConfiguration,
  resolvePortalFastMinutes,
  resolvePortalProcessingLabel,
  resolvePortalProcessingTime,
  resolvePortalStartingPrice,
  resolvePortalValidityLabel,
  resolvePortalVisaCategory,
  type PortalCountryDisplayOptions,
} from '@/shared/utils/portalCountryDisplay'
import {
  buildRequirementPreviewCardsFromJurisdiction,
  buildRequirementPreviewCardsFromVisaType,
  enrichRequirementDocumentRow,
  getApplicableStatesForVisaType,
  resolveJurisdictionForState,
  resolveJurisdictionMappingState,
  shouldShowJurisdictionNodes,
  visaTypeRequiresJurisdictionSelection,
} from '@/shared/utils/jurisdictionRequirementPreview'
import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import {
  evaluateTravelDateFeasibility,
  parseProcessingWorkingDays,
  type TravelDateFeasibilityResult,
  type TravelFeasibilityConfig,
} from '@/shared/utils/travelDateFeasibility'

export type { CountryMaster, CountryVisaOffering } from '@/shared/types/countryMaster'
export { ACCOUNT_MAPPED_COUNTRY_IDS } from '@/shared/data/mockCountryMasters'

export interface ListCountryMastersOptions {
  activeOnly?: boolean
  accountMappedOnly?: boolean
  /** When set, only countries with an enabled segment and active visa types are returned. */
  segment?: BusinessSegment
  /**
   * Card display only — maps country master fields using this segment without filtering the list.
   * Use on country selection when all destinations are shown but visa types are segment-scoped.
   */
  portalDisplaySegment?: BusinessSegment
  query?: string
}

export function listCountryMasters(options: ListCountryMastersOptions = {}): CountryMaster[] {
  const { activeOnly = true, accountMappedOnly = false, segment, query } = options
  let rows = getMockCountryMasters()

  if (activeOnly) rows = rows.filter((c) => c.status === 'active')
  if (accountMappedOnly) {
    const allowed = new Set<string>(ACCOUNT_MAPPED_COUNTRY_IDS)
    rows = rows.filter(c => allowed.has(c.id))
  }
  if (segment) {
    rows = rows.filter((country) => countryHasBookableConfiguration(country, segment))
  } else {
    rows = rows.filter((country) => countryHasBookableConfiguration(country))
  }

  const q = query?.trim().toLowerCase()
  if (q) {
    rows = rows.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.cities.toLowerCase().includes(q),
    )
  }

  return rows
}

export function getCountryMasterById(countryId: string): CountryMaster | undefined {
  return getMockCountryMasters().find(c => c.id === countryId)
}

export function getCountryMasterByName(countryName: string): CountryMaster | undefined {
  const normalized = countryName.trim().toLowerCase()
  if (!normalized) return undefined
  return getMockCountryMasters().find(c => c.name.trim().toLowerCase() === normalized)
}

export function resolveOfferingIdsByLabels(
  countryLabel: string,
  visaTypeLabel: string,
  segment?: BusinessSegment,
): { countryId: string; visaOfferingId: string } | undefined {
  const master = getCountryMasterByName(countryLabel)
  if (!master || !visaTypeLabel?.trim()) return undefined

  const normalizedVisa = visaTypeLabel.trim().toLowerCase()
  const segments = segment
    ? master.segments.filter((entry) => entry.segment === segment)
    : master.segments

  for (const segmentEntry of segments) {
    const visaType = segmentEntry.visaTypes.find(
      (entry) =>
        entry.name.trim().toLowerCase() === normalizedVisa ||
        entry.id.trim().toLowerCase() === normalizedVisa,
    )
    if (visaType) {
      return { countryId: master.id, visaOfferingId: visaType.id }
    }
  }

  return undefined
}

export function getCountryMasterByCode(countryCode: string): CountryMaster | undefined {
  const normalized = countryCode.trim().toUpperCase()
  if (!normalized) return undefined
  return getMockCountryMasters().find(c => c.code.trim().toUpperCase() === normalized)
}

export function resolveApplicationTrackingUrl(input: {
  countryId?: string
  countryName?: string
  countryCode?: string
}): string | undefined {
  const master =
    (input.countryId ? getCountryMasterById(input.countryId) : undefined) ??
    (input.countryName ? getCountryMasterByName(input.countryName) : undefined) ??
    (input.countryCode ? getCountryMasterByCode(input.countryCode) : undefined)

  const url = master?.applicationTrackingUrl?.trim()
  return url || undefined
}

export function getPassportIssueLocations(countryId: string): PassportIssueLocation[] {
  const master = getCountryMasterById(countryId)
  if (!master?.passportIssueLocations?.length) return []
  return master.passportIssueLocations.filter((loc) => loc.active !== false)
}

export function resolvePassportJurisdiction(
  countryId: string,
  locationId: string,
): string | undefined {
  return getPassportIssueLocations(countryId).find((loc) => loc.id === locationId)?.jurisdiction
}

export function getPassportIssueLocationLabel(
  countryId: string,
  locationId: string,
): string | undefined {
  return getPassportIssueLocations(countryId).find((loc) => loc.id === locationId)?.label
}

export function getVisaOfferings(
  countryId: string,
  activeOnly = true,
  segment?: BusinessSegment,
): CountryVisaOffering[] {
  const master = getCountryMasterById(countryId)
  if (!master) return []
  let offerings = master.visaOfferings
  if (segment) offerings = offerings.filter((offering) => offering.segment === segment)
  return activeOnly ? offerings.filter((offering) => offering.active) : offerings
}

export function getVisaOfferingById(
  countryId: string,
  offeringId: string,
): CountryVisaOffering | undefined {
  return getVisaOfferings(countryId, false).find(o => o.id === offeringId)
}

/** Map country master to legacy `Country` shape for existing portal cards. */
export function countryMasterToPortalCountry(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): Country {
  return {
    id: master.id,
    name: master.name,
    code: master.code,
    region: master.region,
    visaTypes: [],
    processingTime: resolvePortalProcessingTime(master, options),
    price: resolvePortalStartingPrice(master, options),
    rating: master.rating,
    flags: master.flag,
    trending: master.trending,
    trendingPercent: master.trendingPercent,
    visaCategory: resolvePortalVisaCategory(master),
    validity: resolvePortalValidityLabel(master, options),
    documentsNeeded: [],
    heroPhotoId: master.heroPhotoId,
    fastMinutes: resolvePortalFastMinutes(master),
    cities: master.cities,
    portalProcessingLabel: resolvePortalProcessingLabel(master),
  }
}

export function listPortalCountries(options: ListCountryMastersOptions = {}): Country[] {
  const { segment, portalDisplaySegment, ...listOptions } = options
  const displaySegment = portalDisplaySegment ?? segment
  return listCountryMasters(listOptions).map((master) =>
    countryMasterToPortalCountry(master, { segment: displaySegment }),
  )
}

export function patchStateFromVisaOffering(offering: CountryVisaOffering): {
  visaOfferingId: string
  visaType: string
  visaTypeLabel: string
  purpose: string
  purposeLabel: string
  entryType: string
} {
  return {
    visaOfferingId: offering.id,
    visaType: offering.visaTypeId,
    visaTypeLabel: offering.visaTypeLabel,
    purpose: offering.purposeId,
    purposeLabel: offering.purposeLabel,
    entryType: offering.entryType,
  }
}

export function getVisaTypeForOffering(
  countryId: string,
  offeringId: string,
): CountryVisaType | undefined {
  const master = getCountryMasterById(countryId)
  if (!master) return undefined
  for (const segment of master.segments) {
    const visaType = segment.visaTypes.find((entry) => entry.id === offeringId)
    if (visaType) return visaType
  }
  return undefined
}

export function getSegmentForOffering(
  countryId: string,
  offeringId: string,
): CountrySegmentConfig | undefined {
  const master = getCountryMasterById(countryId)
  if (!master) return undefined
  return master.segments.find((segment) =>
    segment.visaTypes.some((visaType) => visaType.id === offeringId),
  )
}

/** Physical originals apply only when embassy/VFS jurisdiction workflow is active. */
export function offeringAllowsPhysicalOriginalDocuments(
  countryId: string,
  offeringId: string,
): boolean {
  return shouldShowJurisdictionNodes(getVisaTypeForOffering(countryId, offeringId))
}

export function getJurisdictionForOffering(
  countryId: string,
  offeringId: string,
  jurisdictionId: string,
): CountryVisaJurisdiction | undefined {
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  return visaType?.jurisdictions?.find((jurisdiction) => jurisdiction.id === jurisdictionId)
}

export function getApplicableStatesForOffering(countryId: string, offeringId: string): string[] {
  return getApplicableStatesForVisaType(getVisaTypeForOffering(countryId, offeringId))
}

export function resolveJurisdictionForOfferingState(
  countryId: string,
  offeringId: string,
  stateName: string,
): CountryVisaJurisdiction | undefined {
  return resolveJurisdictionForState(getVisaTypeForOffering(countryId, offeringId), stateName)
}

export function resolveJurisdictionForOffering(
  countryId: string,
  offeringId: string,
  options: {
    placeOfResidence?: string
    issuedPassportState?: string
  },
): CountryVisaJurisdiction | undefined {
  const stateName = resolveJurisdictionMappingState(
    options.placeOfResidence,
    options.issuedPassportState,
  )
  if (!stateName) return undefined
  return resolveJurisdictionForOfferingState(countryId, offeringId, stateName)
}

export function resolveJurisdictionIdByLabel(
  countryId: string,
  offeringId: string,
  jurisdictionLabel?: string,
): string | undefined {
  if (!jurisdictionLabel?.trim()) return undefined
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  if (!visaType) return undefined

  const normalized = jurisdictionLabel.trim().toLowerCase()
  const match = (visaType.jurisdictions ?? [])
    .filter((jurisdiction) => jurisdiction.status === 'active')
    .find(
      (jurisdiction) =>
        jurisdiction.name.trim().toLowerCase() === normalized ||
        jurisdiction.id.trim().toLowerCase() === normalized,
    )

  return match?.id
}

export function resolveOfferingJurisdictionId(
  countryId: string,
  offeringId: string,
  options?: {
    jurisdictionLabel?: string
    placeOfResidence?: string
    issuedPassportState?: string
  },
): string | undefined {
  const byLabel = resolveJurisdictionIdByLabel(countryId, offeringId, options?.jurisdictionLabel)
  if (byLabel) return byLabel

  const byState = resolveJurisdictionForOffering(countryId, offeringId, {
    placeOfResidence: options?.placeOfResidence,
    issuedPassportState: options?.issuedPassportState,
  })
  return byState?.id
}

export function offeringRequiresJurisdictionSelection(
  countryId: string,
  offeringId: string,
): boolean {
  return visaTypeRequiresJurisdictionSelection(getVisaTypeForOffering(countryId, offeringId))
}

export function getVisaApplicationWindow(countryId: string): VisaApplicationWindow | undefined {
  return getCountryMasterById(countryId)?.visaApplicationWindow
}

export function getEmbassyProcessingWorkingDays(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): number | null {
  if (jurisdictionId) {
    const jurisdiction = getJurisdictionForOffering(countryId, offeringId, jurisdictionId)
    const fromJurisdiction = parseProcessingWorkingDays(jurisdiction?.processingTime ?? '')
    if (fromJurisdiction != null) return fromJurisdiction
  }

  const visaType = getVisaTypeForOffering(countryId, offeringId)
  return parseProcessingWorkingDays(visaType?.processingTime ?? '')
}

export function getTravelFeasibilityConfig(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): TravelFeasibilityConfig {
  const master = getCountryMasterById(countryId)
  return {
    requiredWorkingDays: getEmbassyProcessingWorkingDays(countryId, offeringId, jurisdictionId),
    thresholds: master?.travelDateRiskThresholds ?? DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
    applicationWindow: master?.visaApplicationWindow,
  }
}

export function getTravelDateFeasibilityForOffering(
  countryId: string,
  offeringId: string,
  travelDateIso: string,
  jurisdictionId?: string,
  applicationDate: Date = new Date(),
): TravelDateFeasibilityResult {
  return evaluateTravelDateFeasibility({
    applicationDate,
    travelDateIso,
    config: getTravelFeasibilityConfig(countryId, offeringId, jurisdictionId),
  })
}

function enrichPreviewCards(cards: RequirementPreviewCard[]): RequirementPreviewCard[] {
  return cards.map((card) => ({
    ...card,
    documents: card.documents?.map((doc) => enrichRequirementDocumentRow(doc)),
  }))
}

export function getRequirementPreviewCards(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): RequirementPreviewCard[] {
  const visaType = getVisaTypeForOffering(countryId, offeringId)

  if (jurisdictionId) {
    const jurisdiction = getJurisdictionForOffering(countryId, offeringId, jurisdictionId)
    if (jurisdiction) {
      const cards = buildRequirementPreviewCardsFromJurisdiction(jurisdiction)
      if (cards.length) return cards
    }
  }

  if (visaType && shouldShowJurisdictionNodes(visaType)) {
    const fallback =
      visaType.jurisdictions?.find(
        (entry) => entry.status === 'active' && entry.documents.length > 0,
      ) ?? visaType.jurisdictions?.find((entry) => entry.status === 'active')
    if (fallback) {
      const cards = buildRequirementPreviewCardsFromJurisdiction(fallback)
      if (cards.length) return cards
    }
  }

  if (visaType) {
    const visaTypeCards = buildRequirementPreviewCardsFromVisaType(visaType)
    if (visaTypeCards.length) return visaTypeCards
  }

  const offering = getVisaOfferingById(countryId, offeringId)
  if (offering?.requirementPreviewCards?.length) {
    return enrichPreviewCards(offering.requirementPreviewCards)
  }

  return []
}

export function getOfferingDocumentRules(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): CountryJurisdictionDocumentRule[] {
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  if (!visaType) return []

  let rules: CountryJurisdictionDocumentRule[] = []
  if (shouldShowJurisdictionNodes(visaType)) {
    const selected =
      (jurisdictionId
        ? visaType.jurisdictions?.find((j) => j.id === jurisdictionId && j.status === 'active')
        : undefined) ?? visaType.jurisdictions?.find((j) => j.status === 'active')
    rules = selected?.documents ?? []
  } else {
    rules = visaType.documents ?? []
  }

  return [...rules]
    .filter((rule) => rule.group !== 'optional')
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getCommonDocumentIds(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): Set<string> {
  return new Set(
    getOfferingDocumentRules(countryId, offeringId, jurisdictionId)
      .filter((rule) => rule.commonDocument)
      .map((rule) => rule.documentId),
  )
}

export function getCommonDocumentChecklistItems(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): Array<{ documentId: string; name: string; required: boolean }> {
  const seen = new Set<string>()
  const items: Array<{ documentId: string; name: string; required: boolean }> = []

  for (const rule of getOfferingDocumentRules(countryId, offeringId, jurisdictionId)) {
    if (!rule.commonDocument || seen.has(rule.documentId)) continue
    seen.add(rule.documentId)
    const master = documentMasterService.getById(rule.documentId)
    items.push({
      documentId: rule.documentId,
      name: master?.documentType ?? rule.documentId,
      required: rule.mandatory,
    })
  }

  return items
}

export function resolveJurisdictionIdByName(
  countryId: string,
  offeringId: string,
  jurisdictionName?: string,
): string | undefined {
  const normalized = jurisdictionName?.trim().toLowerCase()
  if (!normalized) return undefined
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  return visaType?.jurisdictions?.find(
    (jurisdiction) => jurisdiction.name.trim().toLowerCase() === normalized,
  )?.id
}

export function getDocumentWorkspaceItems(
  countryId: string,
  offeringId: string,
  processingType: 'normal' | 'express' = 'normal',
  jurisdictionId?: string,
): DocumentWorkspaceItem[] {
  const offering = getVisaOfferingById(countryId, offeringId)
  if (!offering) return []

  const visaType = getVisaTypeForOffering(countryId, offeringId)
  const segment = getSegmentForOffering(countryId, offeringId)
  const checklist = resolveOfferingDocumentChecklistItems(
    visaType,
    segment?.commonDocuments ?? [],
    jurisdictionId,
  )
  const commonIds = getCommonDocumentIds(countryId, offeringId, jurisdictionId)
  const documentMappings = checklistToDocumentMappings(checklist).filter(
    (doc) => !commonIds.has(doc.documentId),
  )

  const isCrew = offering.workflowProfile === 'crew'
  const isChina = countryId === '13'
  const isExpress = processingType === 'express'

  return documentMappings.map((doc, index) => {
    const base: DocumentWorkspaceItem = {
      id: doc.documentId,
      name: doc.name,
      required: doc.mandatory,
      description: doc.description ?? `${doc.name} as per country master checklist.`,
      originalDocument: doc.originalDocument ?? false,
      formatNotes: doc.formatNotes,
      remarks: doc.remarks,
      ocrSupported: doc.ocrSupported,
    }

    if (doc.documentId === 'passport') {
      return {
        ...base,
        status: 'Verified',
        extractedFields: [
          { label: 'Name', value: 'Priya Sharma' },
          { label: 'Passport No.', value: 'Z1234567' },
          { label: 'Nationality', value: 'IND' },
          { label: 'Date of Birth', value: '14 Mar 1988' },
          { label: 'Gender', value: 'F' },
          { label: 'Issue Date', value: '09 Jun 2021' },
          { label: 'Expiry Date', value: '15 Aug 2032' },
        ],
      }
    }

    if (doc.documentId === 'photo') {
      return { ...base, status: isExpress ? 'Uploaded' : 'Needs Review' }
    }

    if (doc.documentId === 'cdc') {
      return {
        ...base,
        status: 'Low Confidence',
        ocrMismatchAlert: 'CDC number mismatch with passport surname spelling.',
      }
    }

    if (doc.documentId === 'vessel-letter') {
      return {
        ...base,
        status: isExpress ? 'Needs Review' : 'Needs Clarification',
        remarks: isExpress ? undefined : 'Crew joining date missing in uploaded letter.',
      }
    }

    if (doc.documentId === 'bank') {
      return { ...base, status: isExpress ? 'Uploaded' : undefined }
    }

    if (doc.documentId === 'invitation' || index > 2) {
      return {
        ...base,
        status:
          isChina && !isExpress && !isCrew ? 'Needs Clarification' : ('Needs Review' as const),
        remarks:
          isChina && !isExpress && doc.documentId === 'invitation'
            ? 'Invitation format does not match China consulate template.'
            : undefined,
      }
    }

    return base
  })
}

export function getChecklistItemsForOffering(
  countryId: string,
  offeringId: string,
): PortalChecklistItem[] {
  const offering = getVisaOfferingById(countryId, offeringId)
  if (!offering) return []

  const statusCycle: PortalChecklistItem['status'][] = ['uploaded', 'uploaded', 'missing', 'pending', 'missing']

  return offering.documentMappings.map((doc, i) => ({
    id: doc.documentId,
    label: doc.name,
    required: doc.mandatory,
    status: statusCycle[i % statusCycle.length],
  }))
}

export function getPopularVisaLabels(countryId: string): string {
  return getVisaOfferings(countryId)
    .slice(0, 2)
    .map(o => o.visaTypeLabel)
    .join(' · ')
}

export function resolveOfferingQcChecklist(
  countryId: string,
  offeringId: string,
  kind: CountryQcChecklistKind,
  jurisdictionId?: string,
): CountryQcChecklistTemplate {
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  if (!visaType) return getDefaultQcChecklistTemplate(kind)

  let template: CountryQcChecklistTemplate | undefined

  if (shouldShowJurisdictionNodes(visaType)) {
    const jurisdiction =
      (jurisdictionId
        ? visaType.jurisdictions?.find((j) => j.id === jurisdictionId && j.status === 'active')
        : undefined) ??
      visaType.jurisdictions?.find((j) => j.status === 'active')
    template = kind === 'ops' ? jurisdiction?.opsQcChecklist : jurisdiction?.docsQcChecklist
  } else {
    template = kind === 'ops' ? visaType.opsQcChecklist : visaType.docsQcChecklist
  }

  const resolved = template ?? getDefaultQcChecklistTemplate(kind)
  return applyQcChecklistKindMetadata(kind, resolved)
}

export function resolveOfferingVfsServiceRates(
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): CountryVfsServiceRate[] {
  const visaType = getVisaTypeForOffering(countryId, offeringId)
  if (!visaType) return []

  let rates: CountryVfsServiceRate[] | undefined

  if (shouldShowJurisdictionNodes(visaType)) {
    const jurisdiction =
      (jurisdictionId
        ? visaType.jurisdictions?.find((j) => j.id === jurisdictionId && j.status === 'active')
        : undefined) ??
      visaType.jurisdictions?.find((j) => j.status === 'active')
    rates = jurisdiction?.vfsServiceRates
  } else {
    rates = visaType.vfsServiceRates
  }

  return [...(rates ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
}
