import type {
  BusinessSegment,
  CountryDocumentChecklistItem,
  CountryDocumentMapping,
  CountryProcessingRules,
  CountrySegmentConfig,
  CountryVisaOffering,
  CountryVisaType,
  WorkflowProfile,
} from '@/shared/types/countryMaster'

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
  return { ...DEFAULT_PROCESSING_RULES }
}

export function checklistToDocumentMappings(
  checklist: CountryDocumentChecklistItem[],
): CountryDocumentMapping[] {
  return [...checklist]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      documentId: item.documentId,
      name: item.name,
      mandatory: item.mandatory,
      remarks: item.remarks,
      ocrSupported: item.ocrEnabled,
      description: item.description,
      formatNotes: item.formatNotes,
      hasSample: item.hasSample,
    }))
}

export function visaTypeToOffering(
  visaType: CountryVisaType,
  segment: BusinessSegment,
  workflowProfile: WorkflowProfile,
): CountryVisaOffering {
  const slug = visaType.name.toLowerCase().replace(/\s+/g, '_').slice(0, 32)
  return {
    id: visaType.id,
    visaTypeId: slug,
    visaTypeLabel: visaType.name,
    purposeId: visaType.purposeId ?? visaType.visaCategory.toLowerCase().replace(/\s+/g, '_'),
    purposeLabel: visaType.purposeLabel ?? visaType.visaCategory,
    processingTimeline: visaType.processingTime,
    entryType: visaType.entryType,
    requirementSummary:
      visaType.requirementSummary ??
      visaType.checklist
        .filter((c) => c.mandatory)
        .map((c) => c.name)
        .slice(0, 4)
        .join(', '),
    active: visaType.status === 'active',
    workflowProfile,
    documentMappings: checklistToDocumentMappings(visaType.checklist),
    segment,
  }
}

export function syncVisaOfferingsFromSegments(segments: CountrySegmentConfig[]): CountryVisaOffering[] {
  const offerings: CountryVisaOffering[] = []
  for (const seg of segments) {
    if (!seg.enabled) continue
    const profile = seg.processingRules.workflowProfile
    for (const vt of seg.visaTypes) {
      offerings.push(visaTypeToOffering(vt, seg.segment, profile))
    }
  }
  return offerings
}

export function emptySegment(segment: BusinessSegment, enabled = false): CountrySegmentConfig {
  return {
    segment,
    enabled,
    visaTypes: [],
    processingRules: defaultRulesForSegment(segment),
  }
}

export const ALL_SEGMENTS: BusinessSegment[] = ['retail', 'corporate', 'marine']
