import { buildDefaultPassportIssueLocations } from '@/shared/data/passportIssueLocationDefaults'
import {
  checklistToJurisdictionDocuments,
  defaultJurisdictionsForVisa,
  singleJurisdictionForVisa,
} from '@/shared/data/countryJurisdictionDefaults'
import {
  chinaMarineMTypeDelhiJurisdiction,
  japanMarineCrewVisaJurisdictions,
} from '@/shared/data/countryMarineMockConfig'
import {
  b2bBusinessApplicationDocuments,
  b2bTouristApplicationDocuments,
  buildB2bBusinessEvisaDocuments,
  buildB2bBusinessJurisdictions,
  buildB2bTouristEvisaDocuments,
  buildB2bTouristJurisdictions,
  buildCorporateBusinessJurisdictions,
  buildCorporateEvisaDocuments,
  buildCorporateWorkJurisdictions,
  corporateApplicationDocuments,
  corporateWorkApplicationDocuments,
} from '@/shared/data/countryCorporateB2bMockConfig'
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
  { documentId: 'bank-balance-certificate', mandatory: true, sortOrder: 1 },
  { documentId: 'travel-ticket', mandatory: true, sortOrder: 2 },
  { documentId: 'insurance', mandatory: true, sortOrder: 3 },
]

const crewApplicationDocuments: CountryDocumentChecklistItem[] = [
  { documentId: 'cdc', mandatory: true, sortOrder: 0, originalDocument: true },
  { documentId: 'personal-details-form', mandatory: true, sortOrder: 1 },
  { documentId: 'stcw-certificate', mandatory: true, sortOrder: 2 },
  { documentId: 'vessel-letter', mandatory: true, sortOrder: 3 },
  { documentId: 'travel-ticket', mandatory: true, sortOrder: 4 },
  { documentId: 'insurance', mandatory: true, sortOrder: 5 },
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
    documents?: CountryVisaType['documents']
    status?: CountryVisaType['status']
    prioritySupport?: boolean
  },
): CountryVisaType {
  const applicationDocuments = partial.applicationDocuments ?? stdApplicationDocuments
  const { countryName: _countryName, gltsScopeLines, documents, ...rest } = partial
  return visaType({
    ...rest,
    applicationDocuments,
    visaMode: 'e_visa',
    jurisdictionEnabled: false,
    jurisdictions: [],
    documents: documents ?? checklistToJurisdictionDocuments(applicationDocuments),
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

/**
 * Generic corporate segment: one visa type with jurisdiction enabled (embassy/VFS
 * jurisdictions configured) and one e-visa type with jurisdiction disabled (documents
 * configured directly on the visa type).
 */
function corporateBusinessSegment(idPrefix: string, countryName: string): CountrySegmentConfig {
  return segment({
    segment: 'corporate',
    enabled: true,
    workflowId: 'workflow-online-to-offline',
    visaTypes: [
      visaType({
        id: `${idPrefix}-business-corp`,
        name: 'Business Visa',
        visaCategory: 'Business',
        processingTime: '10–14 business days',
        entryType: 'Multiple entry',
        validity: '1 year',
        stayDuration: '90 days per visit',
        purposeId: 'business_meeting',
        purposeLabel: 'Corporate travel',
        applicationDocuments: corporateApplicationDocuments,
        jurisdictionEnabled: true,
        jurisdictions: buildCorporateBusinessJurisdictions(countryName, idPrefix),
      }),
      eVisaType({
        id: `${idPrefix}-evisa-business-corp`,
        name: 'Business e-Visa',
        visaCategory: 'Business',
        processingTime: '4–6 business days',
        entryType: 'Single / multiple',
        validity: '90 days',
        stayDuration: 'As per invitation',
        purposeId: 'business_meeting',
        purposeLabel: 'Corporate travel',
        countryName,
        applicationDocuments: corporateApplicationDocuments,
        documents: buildCorporateEvisaDocuments(idPrefix),
        gltsScopeLines: [
          'Business e-Visa application preparation and portal filing',
          'Invitation letter and corporate document review',
          'Compliance check before online submission',
          'Status updates and approval notification',
        ],
      }),
    ],
  })
}

/**
 * Generic B2B agent segment: one visa type with jurisdiction enabled (embassy/VFS
 * jurisdictions configured) and one e-visa type with jurisdiction disabled (documents
 * configured directly on the visa type).
 */
function b2bAgentSegment(idPrefix: string, countryName: string): CountrySegmentConfig {
  return segment({
    segment: 'b2bAgents',
    enabled: true,
    workflowId: 'workflow-online-to-offline',
    visaTypes: [
      visaType({
        id: `${idPrefix}-agent-tourist`,
        name: 'Agent Tourist Visa',
        visaCategory: 'Tourism',
        processingTime: '8–12 business days',
        entryType: 'Single entry',
        validity: '30 days',
        stayDuration: '30 days',
        purposeId: 'tourism',
        purposeLabel: 'Agent retail filing',
        applicationDocuments: b2bTouristApplicationDocuments,
        jurisdictionEnabled: true,
        jurisdictions: buildB2bTouristJurisdictions(countryName, `${idPrefix}-tourist`),
      }),
      eVisaType({
        id: `${idPrefix}-agent-business`,
        name: 'Agent Business e-Visa',
        visaCategory: 'Business',
        processingTime: '4–6 business days',
        entryType: 'Single / multiple',
        validity: '90 days',
        stayDuration: 'As per invitation',
        purposeId: 'business_meeting',
        purposeLabel: 'Agent corporate filing',
        countryName,
        applicationDocuments: b2bBusinessApplicationDocuments,
        documents: buildB2bBusinessEvisaDocuments(`${idPrefix}-business`),
      }),
    ],
  })
}

/**
 * Generic marine segment applied uniformly across countries: two visa types —
 * one with jurisdiction enabled (embassy/VFS jurisdictions configured), one with
 * jurisdiction disabled (documents configured directly on the visa type).
 */
function marineSegment(idPrefix: string, countryName: string): CountrySegmentConfig {
  return segment({
    segment: 'marine',
    enabled: true,
    workflowId: 'workflow-online-to-offline',
    visaTypes: [
      visaType({
        id: `${idPrefix}-marine-crew`,
        name: 'Crew Visa',
        visaCategory: 'Crew',
        processingTime: '10–14 business days',
        entryType: 'Crew visa',
        validity: '90 days',
        stayDuration: 'Crew rotation',
        purposeId: 'crew_joining',
        purposeLabel: 'Crew joining',
        applicationDocuments: crewApplicationDocuments,
        jurisdictionEnabled: true,
        jurisdictions: defaultJurisdictionsForVisa('Crew Visa', countryName, crewApplicationDocuments),
      }),
      visaType({
        id: `${idPrefix}-marine-crew-transit`,
        name: 'Crew Transit Visa',
        visaCategory: 'Transit crew',
        processingTime: '5–8 business days',
        entryType: 'Transit',
        validity: '72 hours',
        stayDuration: 'Transit connection',
        purposeId: 'transit',
        purposeLabel: 'Transit',
        applicationDocuments: crewApplicationDocuments,
        jurisdictionEnabled: false,
        jurisdictions: [],
        documents: checklistToJurisdictionDocuments(crewApplicationDocuments, 'jurisdiction'),
      }),
    ],
  })
}

function corporateEvisaSegment(
  idPrefix: string,
  countryName: string,
  pricing = 3800,
): CountrySegmentConfig {
  return segment({
    segment: 'corporate',
    enabled: true,
    workflowId: 'workflow-online-only',
    visaTypes: [
      eVisaType({
        id: `${idPrefix}-evisa-business-corp`,
        name: 'Business e-Visa',
        visaCategory: 'Business',
        pricing,
        processingTime: '4–6 business days',
        entryType: 'Single / multiple',
        validity: '90 days',
        stayDuration: 'As per invitation',
        purposeId: 'business_meeting',
        purposeLabel: 'Corporate travel',
        countryName,
        applicationDocuments: corporateApplicationDocuments,
        documents: buildCorporateEvisaDocuments(idPrefix),
        gltsScopeLines: [
          'Business e-Visa application preparation and portal filing',
          'Invitation letter and corporate document review',
          'Compliance check before online submission',
          'Status updates and approval notification',
        ],
      }),
    ],
  })
}

function b2bEvisaSegment(
  idPrefix: string,
  countryName: string,
  touristPrice: number,
  businessPrice: number,
): CountrySegmentConfig {
  return segment({
    segment: 'b2bAgents',
    enabled: true,
    workflowId: 'workflow-online-only',
    visaTypes: [
      eVisaType({
        id: `${idPrefix}-evisa-tourist-agent`,
        name: 'Agent Tourist e-Visa',
        visaCategory: 'Tourism',
        pricing: touristPrice,
        processingTime: '3–5 business days',
        entryType: 'Single entry',
        validity: '90 days',
        stayDuration: '30 days',
        purposeId: 'tourism',
        purposeLabel: 'Agent retail filing',
        countryName,
        applicationDocuments: b2bTouristApplicationDocuments,
        documents: buildB2bTouristEvisaDocuments(`${idPrefix}-tourist`),
      }),
      eVisaType({
        id: `${idPrefix}-evisa-business-agent`,
        name: 'Agent Business e-Visa',
        visaCategory: 'Business',
        pricing: businessPrice,
        processingTime: '4–6 business days',
        entryType: 'Single / multiple',
        validity: '90 days',
        stayDuration: 'As per invitation',
        purposeId: 'business_meeting',
        purposeLabel: 'Agent corporate filing',
        countryName,
        applicationDocuments: b2bBusinessApplicationDocuments,
        documents: buildB2bBusinessEvisaDocuments(`${idPrefix}-business`),
      }),
    ],
  })
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
    corporateEvisaSegment('jp', 'Japan', 3800),
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
          jurisdictionEnabled: true,
          jurisdictions: japanMarineCrewVisaJurisdictions(),
        }),
        visaType({
          id: 'jp-crew-transit',
          name: 'Crew Transit Visa',
          visaCategory: 'Transit crew',
          processingTime: '5–8 business days',
          entryType: 'Transit',
          validity: '72 hours',
          stayDuration: 'Transit connection',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'transit',
          purposeLabel: 'Transit',
          jurisdictionEnabled: false,
          jurisdictions: [],
          documents: checklistToJurisdictionDocuments(crewApplicationDocuments, 'jurisdiction'),
        }),
      ],
    }),
    b2bEvisaSegment('jp', 'Japan', 3200, 3800),
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
          jurisdictionEnabled: true,
          jurisdictions: [
            singleJurisdictionForVisa('mumbai', 'Mumbai', 'France', crewApplicationDocuments),
          ],
        }),
        visaType({
          id: 'schengen-crew-transit',
          name: 'Crew Transit Visa',
          visaCategory: 'Transit crew',
          processingTime: '5–8 business days',
          entryType: 'Transit',
          validity: '72 hours',
          stayDuration: 'Transit connection',
          applicationDocuments: crewApplicationDocuments,
          purposeId: 'transit',
          purposeLabel: 'Transit',
          jurisdictionEnabled: false,
          jurisdictions: [],
          documents: checklistToJurisdictionDocuments(crewApplicationDocuments, 'jurisdiction'),
        }),
      ],
    }),
    corporateBusinessSegment('fr', 'France'),
    b2bAgentSegment('fr', 'France'),
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
          applicationDocuments: corporateApplicationDocuments,
          jurisdictionEnabled: true,
          jurisdictions: buildCorporateBusinessJurisdictions(CHINA_NAME, 'cn-corp'),
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
          applicationDocuments: corporateWorkApplicationDocuments,
          jurisdictionEnabled: true,
          jurisdictions: buildCorporateWorkJurisdictions(CHINA_NAME, 'cn'),
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
          jurisdictionEnabled: true,
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
          jurisdictionEnabled: false,
          jurisdictions: [],
          documents: checklistToJurisdictionDocuments(crewApplicationDocuments, 'jurisdiction'),
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
          applicationDocuments: b2bTouristApplicationDocuments,
          jurisdictionEnabled: true,
          jurisdictions: buildB2bTouristJurisdictions(CHINA_NAME, 'cn-agent-tourist'),
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
          applicationDocuments: b2bBusinessApplicationDocuments,
          jurisdictionEnabled: true,
          jurisdictions: buildB2bBusinessJurisdictions(CHINA_NAME, 'cn-agent-business'),
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
    corporateEvisaSegment('sg', 'Singapore', 2600),
    marineSegment('sg', 'Singapore'),
    b2bEvisaSegment('sg', 'Singapore', 2100, 2600),
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
    corporateEvisaSegment('ke', 'Kenya', 4200),
    marineSegment('ke', 'Kenya'),
    b2bEvisaSegment('ke', 'Kenya', 3500, 4200),
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
    corporateEvisaSegment('au', 'Australia', 7200),
    marineSegment('au', 'Australia'),
    b2bEvisaSegment('au', 'Australia', 6400, 7200),
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
    corporateEvisaSegment('tw', 'Taiwan', 4800),
    marineSegment('tw', 'Taiwan'),
    b2bEvisaSegment('tw', 'Taiwan', 4100, 4800),
  ],
  '31': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-only',
      visaTypes: [
        eVisaType({
          id: 'vn-evisa-tourist',
          name: 'e-Visa · Tourist',
          visaCategory: 'Tourism',
          pricing: 2400,
          processingTime: '3–5 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: '90 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Vietnam',
          gltsScopeLines: [
            'Online e-Visa application completion and submission',
            'Passport and photo validation against Vietnam e-Visa portal rules',
            'Payment coordination for government e-Visa fee',
            'Approval tracking and e-Visa delivery to applicant',
          ],
        }),
        eVisaType({
          id: 'vn-evisa-business',
          name: 'e-Visa · Business',
          visaCategory: 'Business',
          pricing: 2900,
          processingTime: '4–6 business days',
          entryType: 'Single entry',
          validity: '90 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Vietnam',
        }),
      ],
    }),
    corporateEvisaSegment('vn', 'Vietnam', 2900),
    marineSegment('vn', 'Vietnam'),
    b2bEvisaSegment('vn', 'Vietnam', 2400, 2900),
  ],
  '32': [
    segment({
      segment: 'retail',
      enabled: true,
      workflowId: 'workflow-online-only',
      visaTypes: [
        eVisaType({
          id: 'tr-evisa-tourist',
          name: 'e-Visa · Tourist',
          visaCategory: 'Tourism',
          pricing: 3100,
          processingTime: '1–2 business days',
          entryType: 'Multiple entry',
          validity: '180 days',
          stayDuration: '90 days',
          purposeId: 'tourism',
          purposeLabel: 'Tourism',
          countryName: 'Turkey',
          gltsScopeLines: [
            'Eligibility check against Turkey e-Visa nationality and purpose rules',
            'Online e-Visa application completion and submission',
            'Passport and photo validation against Turkey e-Visa portal rules',
            'Approval tracking and e-Visa delivery to applicant',
          ],
        }),
        eVisaType({
          id: 'tr-evisa-business',
          name: 'e-Visa · Business',
          visaCategory: 'Business',
          pricing: 3600,
          processingTime: '2–3 business days',
          entryType: 'Multiple entry',
          validity: '180 days',
          stayDuration: 'As per invitation',
          purposeId: 'business_meeting',
          purposeLabel: 'Business meeting',
          countryName: 'Turkey',
        }),
      ],
    }),
    corporateEvisaSegment('tr', 'Turkey', 3600),
    marineSegment('tr', 'Turkey'),
    b2bEvisaSegment('tr', 'Turkey', 3100, 3600),
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
        jurisdictionEnabled: true,
        jurisdictions: [
          singleJurisdictionForVisa('delhi', 'Delhi', 'Default', stdApplicationDocuments),
        ],
      }),
      eVisaType({
        id: 'default-evisa-tourist',
        name: 'Tourist e-Visa',
        visaCategory: 'Tourism',
        processingTime: '3–5 business days',
        entryType: 'Single entry',
        validity: '90 days',
        stayDuration: '30 days',
        purposeId: 'tourism',
        purposeLabel: 'Tourism',
        countryName: 'Default',
        applicationDocuments: stdApplicationDocuments,
      }),
    ],
  }),
  corporateBusinessSegment('default', 'Default'),
  marineSegment('default', 'Default'),
  b2bAgentSegment('default', 'Default'),
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

/**
 * Overlay catalog processing / validity / stay / price onto the primary
 * retail visa type (first entry) so country-detail hero stats match the
 * destination catalog for every country — default and custom segments alike
 * (e.g. UK 15 days / 6 months, Japan 7 days / 90 days).
 */
function enrichPrimaryRetailFromCatalog(
  segments: CountrySegmentConfig[],
  c: ReturnType<typeof getAllCountries>[0],
): CountrySegmentConfig[] {
  const catalogStay =
    c.visaTypes.find((visaType) => visaType.duration?.trim())?.duration?.trim() || c.validity

  return segments.map((entry) => {
    if (entry.segment !== 'retail') return entry
    return {
      ...entry,
      visaTypes: entry.visaTypes.map((visaType, index) => {
        if (index !== 0) return visaType
        return {
          ...visaType,
          processingTime: c.processingTime,
          validity: c.validity,
          stayDuration: catalogStay,
          pricing: visaType.pricing ?? c.price,
        }
      }),
    }
  })
}

const BASIC_RETAIL_REQUIREMENT_PACK_ID = 'req-basic-retail'

function ensureRetailRequirementPack(segments: CountrySegmentConfig[]): CountrySegmentConfig[] {
  return segments.map((seg) =>
    seg.segment === 'retail' && !seg.requirementPackId
      ? { ...seg, requirementPackId: BASIC_RETAIL_REQUIREMENT_PACK_ID }
      : seg,
  )
}

function buildMasterFromCountry(c: ReturnType<typeof getAllCountries>[0]): CountryMaster {
  const segments = ensureRetailRequirementPack(
    ensureAllSegments(
      normalizeCountrySegments(
        enrichPrimaryRetailFromCatalog(SEGMENTS_BY_COUNTRY[c.id] ?? DEFAULT_SEGMENTS, c),
      ),
    ),
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
    processingTime: c.processingTime,
    price: retailVisa?.pricing ?? c.price,
    rating: c.rating,
    trending: c.trending,
    trendingPercent: c.trendingPercent,
    visaCategory: retailVisa?.visaCategory ?? c.visaCategory,
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
  // normalizeMasterGltsScopes is idempotent defaulting logic — the cache is already normalized
  // after buildMasters()/setMockCountryMastersStore(), so re-running it on every read (this is
  // called extremely frequently, including in per-application admin sync loops) was doing a full
  // deep re-map of every country/segment/visaType/jurisdiction for no behavioral change.
  if (!cache) {
    cache = buildMasters()
  }
  return cache
}

export function resetMockCountryMastersCache(): void {
  cache = null
}

export function setMockCountryMastersStore(rows: CountryMaster[]): void {
  cache = rows.map(normalizeMasterGltsScopes)
}
