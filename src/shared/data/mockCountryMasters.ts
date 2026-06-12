import { buildDefaultPassportIssueLocations } from '@/shared/data/passportIssueLocationDefaults'
import {
  defaultJurisdictionsForVisa,
  singleJurisdictionForVisa,
} from '@/shared/data/countryJurisdictionDefaults'
import {
  chinaMarineGTypeDelhiJurisdiction,
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
  ProcessingType,
} from '@/shared/types/countryMaster'
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
    segment({
      segment: 'marine',
      enabled: true,
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
  '1': [
    segment({
      segment: 'retail',
      enabled: true,
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
            singleJurisdictionForVisa('delhi', 'Delhi', 'Schengen', stdApplicationDocuments),
            singleJurisdictionForVisa('mumbai', 'Mumbai', 'Schengen', stdApplicationDocuments),
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
            singleJurisdictionForVisa('delhi', 'Delhi', 'Schengen', stdApplicationDocuments),
          ],
        }),
      ],
    }),
    segment({
      segment: 'marine',
      enabled: true,
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
            singleJurisdictionForVisa('mumbai', 'Mumbai', 'Schengen', crewApplicationDocuments),
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
          jurisdictions: [chinaMarineGTypeDelhiJurisdiction()],
        }),
      ],
    }),
    segment({
      segment: 'b2bAgents',
      enabled: true,
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
}

const DEFAULT_SEGMENTS: CountrySegmentConfig[] = [
  segment({
    segment: 'retail',
    enabled: true,
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

function normalizeMasterGltsScopes(master: CountryMaster): CountryMaster {
  return {
    ...master,
    segments: master.segments.map((segment) => ({
      ...segment,
      visaTypes: segment.visaTypes.map((visaType) => ({
        ...visaType,
        jurisdictions: visaType.jurisdictions.map(normalizeJurisdictionGltsScope),
      })),
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
