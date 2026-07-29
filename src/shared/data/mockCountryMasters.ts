import { buildDefaultPassportIssueLocations } from '@/shared/data/passportIssueLocationDefaults'
import {
  checklistToJurisdictionDocuments,
  defaultJurisdictionsForVisa,
  singleJurisdictionForVisa,
} from '@/shared/data/countryJurisdictionDefaults'
import {
  chinaMarineGTypeDelhiJurisdiction,
  chinaMarineGTypeMumbaiJurisdiction,
  chinaMarineMTypeDelhiJurisdiction,
  japanMarineCrewVisaJurisdictions,
} from '@/shared/data/countryMarineMockConfig'
import { getAllCountries } from '@/shared/services/visaService'
import {
  defaultRulesForSegment,
  ensureAllSegments,
  emptySegment,
  normalizeCountrySegments,
  enrichVisaOfferingsApproxCost,
  syncVisaOfferingsFromSegments,
} from '@/shared/data/countryMasterDefaults'
import type { VisaCategory } from '@/shared/types/visa'
import type {
  CountryDocumentChecklistItem,
  CountryMaster,
  CountrySegmentConfig,
  CountryVisaJurisdiction,
  CountryVisaType,
  CountryVfsServiceRate,
  ProcessingType,
} from '@/shared/types/countryMaster'
import { cloneDefaultVfsServiceRates } from '@/shared/data/countryVfsServiceRateDefaults'
import { shouldShowJurisdictionNodes } from '@/shared/utils/jurisdictionRequirementPreview'
import { normalizeGltsScopeRichText } from '@/shared/utils/richTextUtils'

/** B2B customer account ↔ country mapping (admin-configured; mock). */
export const ACCOUNT_MAPPED_COUNTRY_IDS = ['13', '15'] as const

const stdCommonDocuments: CountryDocumentChecklistItem[] = [
  { documentId: 'passport', mandatory: true, sortOrder: 0 },
  { documentId: 'photo', mandatory: true, sortOrder: 1 },
]

const stdApplicationDocuments: CountryDocumentChecklistItem[] = [
  { documentId: 'bank', mandatory: true, sortOrder: 0 },
  { documentId: 'travel-ticket', mandatory: true, sortOrder: 1 },
  { documentId: 'insurance', mandatory: true, sortOrder: 2 },
]

const crewApplicationDocuments: CountryDocumentChecklistItem[] = [
  { documentId: 'cdc', mandatory: true, sortOrder: 0 },
  { documentId: 'vessel-letter', mandatory: true, sortOrder: 1 },
  { documentId: 'travel-ticket', mandatory: true, sortOrder: 2 },
  { documentId: 'insurance', mandatory: true, sortOrder: 3 },
]

function visaType(
  partial: Omit<CountryVisaType, 'applicationDocuments' | 'status' | 'prioritySupport' | 'jurisdictions'> & {
    applicationDocuments?: CountryDocumentChecklistItem[]
    jurisdictions?: CountryVisaJurisdiction[]
    status?: CountryVisaType['status']
    prioritySupport?: boolean
  },
): CountryVisaType {
  const applicationDocuments = partial.applicationDocuments ?? stdApplicationDocuments
  return {
    prioritySupport: false,
    status: 'active',
    jurisdictions: partial.jurisdictions ?? [],
    applicationDocuments,
    ...partial,
  }
}

function eVisaGltsScopeBullets(lines: string[]): string {
  const items = lines
    .map((line) =>
      line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
    )
    .map((line) => `<li>${line}</li>`)
    .join('')
  return `<ul>${items}</ul>`
}

const DEFAULT_E_VISA_GLTS_SCOPE_LINES = [
  'Online application preparation and document validation',
  'e-Visa portal submission on behalf of applicant',
  'Payment coordination and receipt management',
  'Status tracking and approval notification',
] as const

/** e-Visa visa type with jurisdiction disabled — documents and GLTS scope live on the visa type. */
function eVisaType(
  partial: Omit<
    CountryVisaType,
    | 'applicationDocuments'
    | 'status'
    | 'prioritySupport'
    | 'jurisdictions'
    | 'visaMode'
    | 'jurisdictionEnabled'
    | 'documents'
    | 'gltsScope'
  > & {
    countryName: string
    gltsScopeLines?: string[]
    applicationDocuments?: CountryDocumentChecklistItem[]
    status?: CountryVisaType['status']
    prioritySupport?: boolean
  },
): CountryVisaType {
  const applicationDocuments = partial.applicationDocuments ?? stdApplicationDocuments
  const { countryName: _countryName, gltsScopeLines, ...rest } = partial
  return visaType({
    ...rest,
    applicationDocuments,
    visaMode: 'e_visa',
    jurisdictionEnabled: false,
    jurisdictions: [],
    documents: checklistToJurisdictionDocuments(applicationDocuments),
    gltsScope: eVisaGltsScopeBullets(gltsScopeLines ?? [...DEFAULT_E_VISA_GLTS_SCOPE_LINES]),
  })
}

function segment(
  partial: Omit<CountrySegmentConfig, 'processingRules' | 'commonDocuments'> & {
    processingRules?: CountrySegmentConfig['processingRules']
    commonDocuments?: CountryDocumentChecklistItem[]
  },
): CountrySegmentConfig {
  return {
    processingRules: partial.processingRules ?? defaultRulesForSegment(partial.segment),
    commonDocuments: partial.commonDocuments ?? stdCommonDocuments,
    ...partial,
  }
}

const CHINA_NAME = 'China'

const SEGMENTS_BY_COUNTRY: Record<string, CountrySegmentConfig[]> = {
  '2': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-to-offline',
      visaTypes: [
        visaType({
          id: 'default-tourist',
          name: 'Tourist Visa',
          visaCategory: 'Tourism',
          processingTime: '7–14 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', 'Default', stdApplicationDocuments),
          ],
        }),
        eVisaType({
          id: 'jp-evisa-tourist',
          name: 'e-Visa · Tourist',
          visaCategory: 'Tourism',
          pricing: 3200,
          processingTime: '3–5 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: '90 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Japan',
          gltsScopeLines: [
            'Online e-Visa application completion and submission',
            'Passport and photo validation against Japan e-Visa portal rules',
            'Travel itinerary review and document checklist guidance',
            'Approval tracking and e-Visa delivery to applicant',
          ],
        }),
        eVisaType({
          id: 'jp-evisa-business',
          name: 'e-Visa · Business',
          visaCategory: 'Business',
          pricing: 3800,
          processingTime: '4–6 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Japan',
          gltsScopeLines: [
            'Business e-Visa application preparation and portal filing',
            'Invitation letter and corporate document review',
            'Compliance check before online submission',
            'Status updates and approval notification',
          ],
        }),
      ],
    }),
    segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
    segment({
      segment: 'marine',
      enabled: true,
      workflowId: 'workflow-online-to-offline',
      visaTypes: [
        visaType({
          id: 'jp-crew-visa',
          name: 'Crew Visa',
          visaCategory: 'Crew',
          processingTime: '10–14 business days',
          entryType: 'Crew visa',
          validity: '90 days',
          stayDuration: 'Crew rotation',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'crew_joining',
          purposeLabel: 'Crew joining',
          jurisdictions: japanMarineCrewVisaJurisdictions(),
        }),
      ],
    }),
    segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
  ],
  '14': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-appointment-offline',
      visaTypes: [
        visaType({
          id: 'schengen-tourist',
          name: 'Tourist Visa',
          visaCategory: 'Tourism',
          pricing: 12400,
          processingTime: '12–18 business days',
          entryType: 'Multiple entry · 90 days',
          validity: '90 days',
          stayDuration: '90 days per entry',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', 'France', stdApplicationDocuments),
            singleJurisdictionForVisa('mumbai', 'Mumbai', 'France', stdApplicationDocuments),
          ],
        }),
        visaType({
          id: 'schengen-business',
          name: 'Business Visa',
          visaCategory: 'Business',
          pricing: 14200,
          processingTime: '10–15 business days',
          entryType: 'Single / multiple entry',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', 'France', stdApplicationDocuments),
          ],
        }),
      ],
    }),
    segment({
      segment: 'marine',
      enabled: true,
      workflowId: 'workflow-online-appointment-offline',
      visaTypes: [
        visaType({
          id: 'schengen-crew',
          name: 'Marine Crew Visa',
          visaCategory: 'Crew',
          processingTime: '8–12 business days',
          entryType: 'Crew manifest · Type C',
          validity: '90 days',
          stayDuration: 'Crew rotation',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'crew_joining',
          purposeLabel: 'Crew joining',
          jurisdictions: [
            singleJurisdictionForVisa('mumbai', 'Mumbai', 'France', crewApplicationDocuments),
          ],
        }),
      ],
    }),
    segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
    segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
  ],
  '13': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-to-offline',
      visaTypes: [
        visaType({
          id: 'cn-tourist',
          name: 'Tourist Visa',
          visaCategory: 'Tourism',
          pricing: 5200,
          processingTime: '8–12 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          jurisdictions: defaultJurisdictionsForVisa('Tourist Visa', CHINA_NAME, stdApplicationDocuments),
        }),
        visaType({
          id: 'cn-business-retail',
          name: 'Business Visa',
          visaCategory: 'Business',
          pricing: 6800,
          processingTime: '10–14 business days',
          entryType: 'Single / multiple',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', CHINA_NAME, stdApplicationDocuments),
          ],
        }),
      ],
    }),
    segment({
      segment: 'corporate',
      enabled: true,
      workflowId: 'workflow-online-to-offline',
      visaTypes: [
        visaType({
          id: 'cn-business-corp',
          name: 'Business Visa',
          visaCategory: 'Business',
          processingTime: '10–14 business days',
          entryType: 'Multiple entry',
          validity: '1 year',
          stayDuration: '90 days per visit',
          purposeId: 'business_meeting',
          purposeLabel: 'Corporate travel',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', CHINA_NAME, stdApplicationDocuments),
          ],
        }),
        visaType({
          id: 'cn-work',
          name: 'Work Visa',
          visaCategory: 'Work',
          processingTime: '15–20 business days',
          entryType: 'Long stay',
          validity: '1 year',
          stayDuration: 'Employment contract',
          purposeId: 'employment',
          purposeLabel: 'Employment',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', CHINA_NAME, stdApplicationDocuments),
          ],
        }),
      ],
    }),
    segment({
      segment: 'marine',
      enabled: true,
      workflowId: 'workflow-online-approval-required',
      visaTypes: [
        visaType({
          id: 'cn-m-type',
          name: 'M Type Visa',
          visaCategory: 'Crew',
          processingTime: '15 working days',
          entryType: 'Crew visa',
          validity: '90 days',
          stayDuration: 'Crew rotation',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'crew_joining',
          purposeLabel: 'Crew joining',
          jurisdictions: [chinaMarineMTypeDelhiJurisdiction()],
        }),
        visaType({
          id: 'cn-g-type',
          name: 'G Type Visa',
          visaCategory: 'Transit crew',
          processingTime: '5–8 business days',
          entryType: 'Transit',
          validity: '72 hours',
          stayDuration: 'Transit connection',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'transit',
          purposeLabel: 'Transit',
          jurisdictions: [
            chinaMarineGTypeDelhiJurisdiction(),
            chinaMarineGTypeMumbaiJurisdiction(),
          ],
        }),
      ],
    }),
    segment({
      segment: 'b2bAgents',
      enabled: true,
      workflowId: 'workflow-online-to-offline',
      visaTypes: [
        visaType({
          id: 'cn-agent-tourist',
          name: 'Agent Tourist Visa',
          visaCategory: 'Tourism',
          processingTime: '8–12 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Agent retail filing',
          jurisdictions: [
            singleJurisdictionForVisa('delhi', 'Delhi', CHINA_NAME, stdApplicationDocuments),
          ],
        }),
        visaType({
          id: 'cn-agent-business',
          name: 'Agent Business Visa',
          visaCategory: 'Business',
          processingTime: '10–14 business days',
          entryType: 'Single / multiple',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Agent corporate filing',
          jurisdictions: [
            singleJurisdictionForVisa('mumbai', 'Mumbai', CHINA_NAME, stdApplicationDocuments),
          ],
        }),
      ],
    }),
  ],
  '6': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-only',
      visaTypes: [
        eVisaType({
          id: 'sg-evisa-tourist',
          name: 'Tourist e-Visa',
          visaCategory: 'Tourism',
          pricing: 2100,
          processingTime: '2–4 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Singapore',
        }),
        eVisaType({
          id: 'sg-evisa-business',
          name: 'Business e-Visa',
          visaCategory: 'Business',
          pricing: 2600,
          processingTime: '3–5 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Singapore',
        }),
      ],
    }),
    segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
    segment({ segment: 'marine', enabled: false, visaTypes: [] }),
    segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
  ],
  '10': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-only',
      visaTypes: [
        eVisaType({
          id: 'ke-eta-tourist',
          name: 'eTA · Tourist',
          visaCategory: 'Tourism',
          pricing: 3500,
          processingTime: '1–2 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: '90 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Kenya',
          gltsScopeLines: [
            'Kenya eTA application filing and document upload',
            'Passport validity and photo compliance check',
            'Payment coordination for government eTA fee',
            'eTA approval tracking and delivery',
          ],
        }),
        eVisaType({
          id: 'ke-eta-business',
          name: 'eTA · Business',
          visaCategory: 'Business',
          pricing: 4200,
          processingTime: '2–3 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Kenya',
        }),
      ],
    }),
    segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
    segment({ segment: 'marine', enabled: false, visaTypes: [] }),
    segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
  ],
  '15': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-only',
      visaTypes: [
        eVisaType({
          id: 'au-evisa-visitor',
          name: 'Visitor e-Visa',
          visaCategory: 'Tourism',
          pricing: 6400,
          processingTime: '5–8 business days',
          entryType: 'Multiple entry',
          validity: '12 months',
          stayDuration: '90 days per visit',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Australia',
          gltsScopeLines: [
            'Australia visitor e-Visa application preparation',
            'Financial proof and travel history document review',
            'Immigration portal submission and fee payment',
            'e-Visa grant notification and document delivery',
          ],
        }),
        eVisaType({
          id: 'au-evisa-business',
          name: 'Business Visitor e-Visa',
          visaCategory: 'Business',
          pricing: 7200,
          processingTime: '6–10 business days',
          entryType: 'Single / multiple entry',
          validity: '12 months',
          stayDuration: '90 days per visit',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Australia',
        }),
      ],
    }),
    segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
    segment({ segment: 'marine', enabled: false, visaTypes: [] }),
    segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
  ],
  '16': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-only',
      visaTypes: [
        eVisaType({
          id: 'tw-evisa-tourist',
          name: 'e-Visa · Tourist',
          visaCategory: 'Tourism',
          pricing: 4100,
          processingTime: '4–7 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Taiwan',
        }),
        eVisaType({
          id: 'tw-evisa-business',
          name: 'e-Visa · Business',
          visaCategory: 'Business',
          pricing: 4800,
          processingTime: '5–8 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Taiwan',
        }),
      ],
    }),
    segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
    segment({ segment: 'marine', enabled: false, visaTypes: [] }),
    segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
  ],
}

const DEFAULT_SEGMENTS: CountrySegmentConfig[] = [
  segment({
    segment: 'retail',
    enabled: true,
    workflowId: 'workflow-online-to-offline',
    visaTypes: [
      visaType({
        id: 'default-tourist',
        name: 'Tourist Visa',
        visaCategory: 'Tourism',
        processingTime: '7–14 business days',
        entryType: 'Single entry',
        validity: '30 days',
        stayDuration: '30 days',
        purposeId: 'tourism',
        purposeLabel: 'Tourism',
        jurisdictions: [
          singleJurisdictionForVisa('delhi', 'Delhi', 'Default', stdApplicationDocuments),
        ],
      }),
    ],
  }),
  segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
  segment({ segment: 'marine', enabled: false, visaTypes: [] }),
  segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
]

function buildDraftCountry(): CountryMaster {
  const now = new Date().toISOString()
  const segments = ensureAllSegments([
    segment({
      segment: 'retail',
      enabled: true,
      visaTypes: [
        visaType({
          id: 'draft-tourist',
          name: 'Tourist Visa',
          visaCategory: 'Tourism',
          processingTime: '10–15 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          jurisdictions: [],
        }),
      ],
    }),
    segment({ segment: 'marine', enabled: true, visaTypes: [] }),
    emptySegment('corporate', false),
    emptySegment('b2bAgents', false),
  ])

  return {
    id: 'CNT-DRAFT',
    code: 'DRF',
    name: 'Draft Destination',
    flag: '🏳️',
    region: 'Asia',
    status: 'draft',
    processingType: 'embassy',
    embassyNotes: '',
    internalNotes: 'Incomplete configuration — review before publish.',
    cities: 'TBD',
    heroPhotoId: 'default',
    processingTime: 'TBD',
    price: 0,
    rating: 0,
    trending: false,
    trendingPercent: 0,
    visaCategory: 'Tourism',
    validity: '30 days',
    passportIssueLocations: buildDefaultPassportIssueLocations('Draft Destination'),
    segments,
    visaOfferings: enrichVisaOfferingsApproxCost(syncVisaOfferingsFromSegments(segments), 0),
    createdAt: now,
    updatedAt: now,
    activities: [
      {
        id: 'act-draft-seed',
        timestamp: now,
        actor: 'Admin User',
        action: 'Country created',
        detail: 'Saved as draft',
      },
    ],
  }
}

function mapVisaCategoryToProcessingType(category: VisaCategory): ProcessingType {
  if (category === 'e-Visa' || category === 'Visa on arrival') return 'e_visa'
  if (category === 'No Visa Required') return 'hybrid'
  return 'vfs'
}

function primaryRetailVisaType(segments: CountrySegmentConfig[]) {
  const retail = segments.find((entry) => entry.segment === 'retail' && entry.enabled)
  return retail?.visaTypes.find((visaType) => visaType.status === 'active')
}

function buildMasterFromCountry(c: ReturnType<typeof getAllCountries>[0]): CountryMaster {
  const segments = ensureAllSegments(
    normalizeCountrySegments(SEGMENTS_BY_COUNTRY[c.id] ?? DEFAULT_SEGMENTS),
  )
  const now = new Date().toISOString()
  const visaOfferings = enrichVisaOfferingsApproxCost(syncVisaOfferingsFromSegments(segments), c.price)
  const retailVisa = primaryRetailVisaType(segments)

  return {
    id: c.id,
    code: c.code,
    name: c.name,
    flag: c.flags,
    region: c.region,
    status: 'active',
    ...(c.id === '13'
      ? {
          visaApplicationWindow: { unit: 'days' as const, value: 30 },
          travelDateRiskThresholds: {
            escalationBufferDays: 5,
            safeBufferDays: 10,
          },
          applicationTrackingUrl: 'https://visa.vfsglobal.com/ind/en/chn/track-application',
        }
      : {}),
    processingType:
      c.id === '13' ? 'embassy' : mapVisaCategoryToProcessingType(c.visaCategory),
    embassyNotes: c.id === '13' ? 'China consulate — confirm LOI validity before upload.' : undefined,
    internalNotes: '',
    cities: c.cities,
    heroPhotoId: c.heroPhotoId,
    processingTime: retailVisa?.processingTime ?? c.processingTime,
    price: retailVisa?.pricing ?? c.price,
    rating: c.rating,
    trending: c.trending,
    trendingPercent: c.trendingPercent,
    visaCategory: retailVisa?.visaCategory ?? c.visaCategory,
    validity: retailVisa?.validity ?? c.validity,
    fastMinutes: c.fastMinutes,
    passportIssueLocations: buildDefaultPassportIssueLocations(c.name),
    segments,
    visaOfferings,
    createdAt: now,
    updatedAt: now,
    activities: [
      {
        id: `act-${c.id}-seed`,
        timestamp: now,
        actor: 'System',
        action: 'Country configuration initialized',
        detail: 'Seeded from visa service catalog',
      },
    ],
  }
}

function normalizeJurisdictionGltsScope(jurisdiction: CountryVisaJurisdiction): CountryVisaJurisdiction {
  if (!jurisdiction.gltsScope) return jurisdiction
  return {
    ...jurisdiction,
    gltsScope: normalizeGltsScopeRichText(jurisdiction.gltsScope),
  }
}

function normalizeVisaTypeGltsScope(visaType: CountryVisaType): CountryVisaType {
  return {
    ...visaType,
    gltsScope: visaType.gltsScope ? normalizeGltsScopeRichText(visaType.gltsScope) : visaType.gltsScope,
    jurisdictions: visaType.jurisdictions.map(normalizeJurisdictionGltsScope),
  }
}

function withDefaultConsulateVendor(rate: CountryVfsServiceRate): CountryVfsServiceRate {
  if (rate.vendorId) return rate
  return {
    ...rate,
    vendorId: 'vnd-001',
    vendorName: 'VFS Global India Pvt Ltd',
  }
}

function seedVfsServiceRatesIfMissing(visaType: CountryVisaType): CountryVisaType {
  const defaults = cloneDefaultVfsServiceRates()

  if (shouldShowJurisdictionNodes(visaType)) {
    return {
      ...visaType,
      jurisdictions: visaType.jurisdictions.map((jurisdiction) => {
        if (!jurisdiction.vfsServiceRates?.length) {
          return { ...jurisdiction, vfsServiceRates: cloneDefaultVfsServiceRates() }
        }
        return {
          ...jurisdiction,
          vfsServiceRates: jurisdiction.vfsServiceRates.map(withDefaultConsulateVendor),
        }
      }),
    }
  }

  if (visaType.vfsServiceRates?.length) {
    return {
      ...visaType,
      vfsServiceRates: visaType.vfsServiceRates.map(withDefaultConsulateVendor),
    }
  }

  return {
    ...visaType,
    vfsServiceRates: defaults,
  }
}

function normalizeVisaType(visaType: CountryVisaType, seedVfsRates: boolean): CountryVisaType {
  const withGlts = normalizeVisaTypeGltsScope(visaType)
  return seedVfsRates ? seedVfsServiceRatesIfMissing(withGlts) : withGlts
}

function normalizeMasterGltsScopes(master: CountryMaster): CountryMaster {
  const seedVfsRates = master.status !== 'draft'
  return {
    ...master,
    segments: master.segments.map((segment) => ({
      ...segment,
      visaTypes: segment.visaTypes.map((visaType) => normalizeVisaType(visaType, seedVfsRates)),
    })),
  }
}

function buildMasters(): CountryMaster[] {
  const masters = getAllCountries().map(buildMasterFromCountry)
  return [buildDraftCountry(), ...masters].map(normalizeMasterGltsScopes)
}

let cache: CountryMaster[] | null = null

export function getMockCountryMasters(): CountryMaster[] {
  if (!cache) {
    cache = buildMasters()
  } else {
    cache = cache.map(normalizeMasterGltsScopes)
  }
  return cache
}

export function resetMockCountryMastersCache(): void {
  cache = null
}

export function setMockCountryMastersStore(rows: CountryMaster[]): void {
  cache = rows.map(normalizeMasterGltsScopes)
}
