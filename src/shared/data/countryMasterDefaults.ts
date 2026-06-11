import { documentMasterService } from '@/shared/services/documentMasterService'
import type {
  BusinessSegment,
  CountryDocumentChecklistItem,
  CountryDocumentMapping,
  CountryJurisdictionDocumentRule,
  CountryProcessingRules,
  CountrySegmentConfig,
  CountryVisaOffering,
  CountryVisaType,
  WorkflowProfile,
} from '@/shared/types/countryMaster'

const COMMON_DOCUMENT_IDS = new Set(['passport', 'photo'])

type LegacyChecklistItem = CountryDocumentChecklistItem & {
  name?: string
  ocrEnabled?: boolean
  validationRule?: string
  remarks?: string
  description?: string
  formatNotes?: string
  hasSample?: boolean
}

type LegacyVisaType = CountryVisaType & { checklist?: LegacyChecklistItem[] }
type LegacySegment = CountrySegmentConfig & {
  commonDocuments?: CountryDocumentChecklistItem[]
  visaTypes?: LegacyVisaType[]
}

function slimChecklistItem(item: LegacyChecklistItem, sortOrder: number): CountryDocumentChecklistItem {
  return {
    documentId: item.documentId,
    mandatory: item.mandatory,
    sortOrder: item.sortOrder ?? sortOrder,
    description: item.description,
  }
}

function splitLegacyChecklist(items: LegacyChecklistItem[]): {
  common: CountryDocumentChecklistItem[]
  application: CountryDocumentChecklistItem[]
} {
  const common: CountryDocumentChecklistItem[] = []
  const application: CountryDocumentChecklistItem[] = []
  items.forEach((item, index) => {
    const slim = slimChecklistItem(item, index)
    if (COMMON_DOCUMENT_IDS.has(item.documentId)) {
      common.push(slim)
    } else {
      application.push(slim)
    }
  })
  return { common, application }
}

/** Normalizes legacy `checklist` arrays into common + application document lists. */
export function normalizeCountrySegments(segments: LegacySegment[]): CountrySegmentConfig[] {
  return segments.map((seg) => {
    const visaTypes = (seg.visaTypes ?? []).map((vt) => {
      const legacyVt = vt as LegacyVisaType
      const legacyList = legacyVt.checklist ?? legacyVt.applicationDocuments ?? []
      const hasExplicitApplication = legacyVt.applicationDocuments != null
      const { application: splitApplication } = splitLegacyChecklist(
        legacyList as LegacyChecklistItem[],
      )
      return {
        ...vt,
        jurisdictions: vt.jurisdictions ?? [],
        applicationDocuments: hasExplicitApplication
          ? legacyVt.applicationDocuments!.map((item, i) =>
              slimChecklistItem(item as LegacyChecklistItem, i),
            )
          : splitApplication.map((item, i) => ({ ...item, sortOrder: i })),
      }
    })

    let commonDocuments = seg.commonDocuments?.map((item, i) =>
      slimChecklistItem(item as LegacyChecklistItem, i),
    )
    if (!commonDocuments?.length) {
      const fromFirstVisa = (seg.visaTypes?.[0] as LegacyVisaType | undefined)?.checklist
      if (fromFirstVisa?.length) {
        commonDocuments = splitLegacyChecklist(fromFirstVisa).common
      }
    }

    return {
      ...seg,
      commonDocuments: commonDocuments ?? [],
      visaTypes,
    }
  })
}

export const DEFAULT_PROCESSING_RULES: CountryProcessingRules = {
  submissionMode: 'embassy_direct',
  normalProcessingDays: '10–15 business days',
  expressProcessingDays: '5–7 business days',
  appointmentRequired: false,
  fundsHandlingMode: 'customer_pays',
  ocrPolicyEnabled: true,
  workflowProfile: 'standard',
  slaTargetDays: 12,
  escalationThresholdDays: 10,
  biometricRequired: false,
  interviewRequired: false,
  physicalPassportRequired: true,
}

export function defaultRulesForSegment(segment: BusinessSegment): CountryProcessingRules {
  if (segment === 'marine') {
    return {
      ...DEFAULT_PROCESSING_RULES,
      submissionMode: 'agent_channel',
      workflowProfile: 'crew',
      appointmentRequired: true,
      appointmentProvider: 'VFS Marine desk',
      appointmentLeadTimeDays: 3,
      agentChannelNotes: 'Shipping company must arrange LOI before filing.',
    }
  }
  if (segment === 'corporate') {
    return {
      ...DEFAULT_PROCESSING_RULES,
      submissionMode: 'vfs',
      fundsHandlingMode: 'glts_float',
      fundsNotes: 'Corporate float account — reconcile monthly.',
    }
  }
  if (segment === 'b2bAgents') {
    return {
      ...DEFAULT_PROCESSING_RULES,
      submissionMode: 'agent_submission',
      fundsHandlingMode: 'agent_float',
      agentChannelNotes: 'Agent must hold valid GLTS partner credentials before filing.',
    }
  }
  return { ...DEFAULT_PROCESSING_RULES }
}

export function ensureAllSegments(segments: CountrySegmentConfig[]): CountrySegmentConfig[] {
  const bySegment = new Map(segments.map((entry) => [entry.segment, entry]))
  return ALL_SEGMENTS.map((segment) => bySegment.get(segment) ?? emptySegment(segment, false))
}

export function checklistToDocumentMappings(
  checklist: CountryDocumentChecklistItem[],
): CountryDocumentMapping[] {
  return [...checklist]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => {
      const master = documentMasterService.getById(item.documentId)
      return {
        documentId: item.documentId,
        name: master?.documentType ?? item.documentId,
        mandatory: item.mandatory,
        description: item.description?.trim() || master?.description,
        ocrSupported: item.documentId === 'passport',
        hasSample: item.documentId === 'passport' || item.documentId === 'cdc',
      }
    })
}

function jurisdictionRulesToChecklist(
  rules: CountryJurisdictionDocumentRule[],
): CountryDocumentChecklistItem[] {
  return [...rules]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((rule, index) => ({
      documentId: rule.documentId,
      mandatory: rule.mandatory,
      sortOrder: index,
      description: rule.description,
    }))
}

export function resolveVisaApplicationDocuments(visaType: CountryVisaType): CountryDocumentChecklistItem[] {
  const primaryJurisdiction = visaType.jurisdictions?.[0]
  if (primaryJurisdiction?.documents?.length) {
    return jurisdictionRulesToChecklist(
      primaryJurisdiction.documents.filter((d) => d.group !== 'optional'),
    )
  }
  return visaType.applicationDocuments
}

export function mergeSegmentChecklist(
  commonDocuments: CountryDocumentChecklistItem[],
  applicationDocuments: CountryDocumentChecklistItem[],
): CountryDocumentChecklistItem[] {
  const reindex = (items: CountryDocumentChecklistItem[], offset: number) =>
    [...items]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item, index) => ({ ...item, sortOrder: offset + index }))
  const common = reindex(commonDocuments, 0)
  return [...common, ...reindex(applicationDocuments, common.length)]
}

export function visaTypeToOffering(
  visaType: CountryVisaType,
  segment: BusinessSegment,
  workflowProfile: WorkflowProfile,
  commonDocuments: CountryDocumentChecklistItem[] = [],
): CountryVisaOffering {
  const merged = mergeSegmentChecklist(
    commonDocuments,
    resolveVisaApplicationDocuments(visaType),
  )
  const slug = visaType.name.toLowerCase().replace(/\s+/g, '_').slice(0, 32)
  const mappings = checklistToDocumentMappings(merged)
  return {
    id: visaType.id,
    visaTypeId: slug,
    visaTypeLabel: visaType.name,
    purposeId: visaType.purposeId ?? visaType.visaCategory.toLowerCase().replace(/\s+/g, '_'),
    purposeLabel: visaType.purposeLabel ?? visaType.visaCategory,
    processingTimeline: visaType.processingTime,
    entryType: visaType.entryType,
    approxCost: visaType.pricing,
    requirementSummary:
      visaType.requirementSummary ??
      mappings
        .filter((c) => c.mandatory)
        .map((c) => c.name)
        .slice(0, 4)
        .join(', '),
    active: visaType.status === 'active',
    workflowProfile,
    documentMappings: mappings,
    segment,
  }
}

export function syncVisaOfferingsFromSegments(segments: CountrySegmentConfig[]): CountryVisaOffering[] {
  const offerings: CountryVisaOffering[] = []
  for (const seg of segments) {
    if (!seg.enabled) continue
    const profile = seg.processingRules.workflowProfile
    for (const vt of seg.visaTypes) {
      offerings.push(visaTypeToOffering(vt, seg.segment, profile, seg.commonDocuments))
    }
  }
  return offerings
}

export function enrichVisaOfferingsApproxCost(
  offerings: CountryVisaOffering[],
  countryPrice = 0,
): CountryVisaOffering[] {
  return offerings.map(offering => ({
    ...offering,
    approxCost:
      offering.approxCost != null && offering.approxCost > 0
        ? offering.approxCost
        : countryPrice > 0
          ? countryPrice
          : undefined,
  }))
}

export function emptySegment(segment: BusinessSegment, enabled = false): CountrySegmentConfig {
  return {
    segment,
    enabled,
    commonDocuments: [],
    visaTypes: [],
    processingRules: defaultRulesForSegment(segment),
  }
}

export const ALL_SEGMENTS: BusinessSegment[] = ['retail', 'corporate', 'marine', 'b2bAgents']

export const SEGMENT_LABELS: Record<BusinessSegment, string> = {
  retail: 'Retail',
  corporate: 'Corporate',
  marine: 'Marine',
  b2bAgents: 'B2B Agents',
}
