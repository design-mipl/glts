import { buildDefaultPassportIssueLocations } from '@/shared/data/passportIssueLocationDefaults'
import { getAllCountries } from '@/shared/services/visaService'
import {
  defaultRulesForSegment,
  ensureAllSegments,
  normalizeCountrySegments,
  syncVisaOfferingsFromSegments,
} from '@/shared/data/countryMasterDefaults'
import type {
  CountryDocumentChecklistItem,
  CountryMaster,
  CountrySegmentConfig,
  CountryVisaType,
} from '@/shared/types/countryMaster'

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
  partial: Omit<CountryVisaType, 'applicationDocuments' | 'status' | 'prioritySupport'> & {
    applicationDocuments?: CountryDocumentChecklistItem[]
    status?: CountryVisaType['status']
    prioritySupport?: boolean
  },
): CountryVisaType {
  return {
    prioritySupport: false,
    status: 'active',
    applicationDocuments: partial.applicationDocuments ?? stdApplicationDocuments,
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

const SEGMENTS_BY_COUNTRY: Record<string, CountrySegmentConfig[]> = {
  '1': [
    segment({
      segment: 'retail',
      enabled: true,
      visaTypes: [
        visaType({
          id: 'schengen-tourist',
          name: 'Tourist Visa',
          visaCategory: 'Tourism',
          processingTime: '12–18 business days',
          entryType: 'Multiple entry · 90 days',
          validity: '90 days',
          stayDuration: '90 days per entry',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
        }),
        visaType({
          id: 'schengen-business',
          name: 'Business Visa',
          visaCategory: 'Business',
          processingTime: '10–15 business days',
          entryType: 'Single / multiple entry',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
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
          processingTime: '8–12 business days',
          entryType: 'Single entry',
          validity: '30 days',
          stayDuration: '30 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
        }),
        visaType({
          id: 'cn-business-retail',
          name: 'Business Visa',
          visaCategory: 'Business',
          processingTime: '10–14 business days',
          entryType: 'Single / multiple',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
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
          processingTime: '10–14 business days',
          entryType: 'Crew visa',
          validity: '90 days',
          stayDuration: 'Crew rotation',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'crew_joining',
          purposeLabel: 'Crew joining',
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
      }),
    ],
  }),
  segment({ segment: 'corporate', enabled: false, visaTypes: [] }),
  segment({ segment: 'marine', enabled: false, visaTypes: [] }),
  segment({ segment: 'b2bAgents', enabled: false, visaTypes: [] }),
]

function buildMasterFromCountry(c: ReturnType<typeof getAllCountries>[0]): CountryMaster {
  const segments = ensureAllSegments(
    normalizeCountrySegments(SEGMENTS_BY_COUNTRY[c.id] ?? DEFAULT_SEGMENTS),
  )
  const now = new Date().toISOString()
  const visaOfferings = syncVisaOfferingsFromSegments(segments)

  return {
    id: c.id,
    code: c.code,
    name: c.name,
    flag: c.flags,
    region: c.region,
    status: 'active',
    processingType: c.id === '3' ? 'e_visa' : c.id === '13' ? 'embassy' : 'vfs',
    embassyNotes: c.id === '13' ? 'China consulate — confirm LOI validity before upload.' : undefined,
    internalNotes: '',
    cities: c.cities,
    heroPhotoId: c.heroPhotoId,
    processingTime: c.processingTime,
    price: c.price,
    rating: c.rating,
    trending: c.trending,
    trendingPercent: c.trendingPercent,
    visaCategory: c.visaCategory,
    validity: c.validity,
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

function buildMasters(): CountryMaster[] {
  return getAllCountries().map(buildMasterFromCountry)
}

let cache: CountryMaster[] | null = null

export function getMockCountryMasters(): CountryMaster[] {
  if (!cache) cache = buildMasters()
  return cache
}

export function resetMockCountryMastersCache(): void {
  cache = null
}

export function setMockCountryMastersStore(rows: CountryMaster[]): void {
  cache = rows
}
