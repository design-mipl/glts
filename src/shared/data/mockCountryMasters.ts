import { getAllCountries } from '@/shared/services/visaService'
import type {
  CountryDocumentMapping,
  CountryMaster,
  CountryVisaOffering,
  RequirementPreviewCard,
} from '@/shared/types/countryMaster'

/** B2B customer account ↔ country mapping (admin-configured; mock). */
export const ACCOUNT_MAPPED_COUNTRY_IDS = ['13', '15'] as const

const stdDocs: CountryDocumentMapping[] = [
  {
    documentId: 'passport',
    name: 'Passport',
    mandatory: true,
    hasSample: true,
    ocrSupported: true,
    description: 'Primary identity document used for OCR and visa filing.',
    formatNotes: 'Color scan, all corners visible, PDF/JPG/PNG.',
    remarks: 'Bio page must be clear and glare-free.',
  },
  {
    documentId: 'photo',
    name: 'Applicant Photo',
    mandatory: true,
    description: 'Recent passport-size photograph as per embassy requirements.',
    formatNotes: 'White background, 35x45mm equivalent.',
  },
  {
    documentId: 'bank',
    name: 'Bank Statement',
    mandatory: true,
    description: 'Financial proof as per embassy checklist.',
    formatNotes: 'Last 3 months, stamped by bank.',
  },
]

const crewDocs: CountryDocumentMapping[] = [
  ...stdDocs.filter(d => d.documentId !== 'bank'),
  {
    documentId: 'cdc',
    name: 'CDC',
    mandatory: true,
    hasSample: true,
    ocrSupported: true,
    description: 'Continuous discharge certificate for marine workflows.',
    formatNotes: 'Upload front and back pages in one PDF.',
  },
  {
    documentId: 'vessel-letter',
    name: 'Vessel Joining Letter',
    mandatory: true,
    description: 'Joining confirmation issued by shipping company.',
    formatNotes: 'Company letterhead with sign and stamp.',
  },
]

function offering(
  partial: Omit<CountryVisaOffering, 'active' | 'documentMappings' | 'workflowProfile'> & {
    workflowProfile?: CountryVisaOffering['workflowProfile']
    documentMappings?: CountryDocumentMapping[]
    requirementPreviewCards?: RequirementPreviewCard[]
  },
): CountryVisaOffering {
  const isCrew = partial.workflowProfile === 'crew' || partial.purposeId === 'crew_joining'
  return {
    active: true,
    workflowProfile: partial.workflowProfile ?? (isCrew ? 'crew' : 'standard'),
    documentMappings: partial.documentMappings ?? (isCrew ? crewDocs : stdDocs),
    ...partial,
  }
}

const OFFERINGS_BY_COUNTRY: Record<string, CountryVisaOffering[]> = {
  '1': [
    offering({
      id: 'schengen-tourist',
      visaTypeId: 'tourist',
      visaTypeLabel: 'Tourist Visa',
      purposeId: 'tourism',
      purposeLabel: 'Tourism',
      processingTimeline: '12–18 business days',
      entryType: 'Multiple entry · 90 days',
      requirementSummary: 'Passport, photos, itinerary, insurance',
    }),
    offering({
      id: 'schengen-business',
      visaTypeId: 'business',
      visaTypeLabel: 'Business Visa',
      purposeId: 'business_meeting',
      purposeLabel: 'Business meeting',
      processingTimeline: '10–15 business days',
      entryType: 'Single / multiple entry',
      requirementSummary: 'Invitation, company letter, passport',
    }),
    offering({
      id: 'schengen-crew',
      visaTypeId: 'crew',
      visaTypeLabel: 'Marine Crew Visa',
      purposeId: 'crew_joining',
      purposeLabel: 'Crew joining',
      processingTimeline: '8–12 business days',
      entryType: 'Crew manifest · Type C',
      requirementSummary: 'CDC, vessel letter, crew documents',
      workflowProfile: 'crew',
    }),
  ],
  '2': [
    offering({
      id: 'japan-tourist',
      visaTypeId: 'tourist',
      visaTypeLabel: 'Tourist Visa',
      purposeId: 'tourism',
      purposeLabel: 'Tourism',
      processingTimeline: '5–7 business days',
      entryType: 'Single entry · 90 days',
      requirementSummary: 'Passport, photo, itinerary',
    }),
    offering({
      id: 'japan-business',
      visaTypeId: 'business',
      visaTypeLabel: 'Business Visa',
      purposeId: 'conference',
      purposeLabel: 'Conference',
      processingTimeline: '7–10 business days',
      entryType: 'Single entry',
      requirementSummary: 'Invitation, schedule, passport',
    }),
  ],
  '3': [
    offering({
      id: 'uae-tourist',
      visaTypeId: 'tourist',
      visaTypeLabel: 'Tourist e-Visa',
      purposeId: 'tourism',
      purposeLabel: 'Tourism',
      processingTimeline: '2–3 business days',
      entryType: '30-day stay',
      requirementSummary: 'Passport scan, photo',
    }),
    offering({
      id: 'uae-business',
      visaTypeId: 'business',
      visaTypeLabel: 'Business e-Visa',
      purposeId: 'business_meeting',
      purposeLabel: 'Business meeting',
      processingTimeline: '3–5 business days',
      entryType: '30 / 60 day options',
      requirementSummary: 'Passport, sponsor documents',
    }),
  ],
  '4': [
    offering({
      id: 'uk-visitor',
      visaTypeId: 'tourist',
      visaTypeLabel: 'Visitor Visa',
      purposeId: 'tourism',
      purposeLabel: 'Tourism',
      processingTimeline: '15–20 business days',
      entryType: 'Standard visitor',
      requirementSummary: 'Passport, financials, itinerary',
    }),
    offering({
      id: 'uk-business',
      visaTypeId: 'business',
      visaTypeLabel: 'Business Visitor',
      purposeId: 'business_meeting',
      purposeLabel: 'Business meeting',
      processingTimeline: '12–18 business days',
      entryType: 'Short-term work allowed',
      requirementSummary: 'Invitation, employment proof',
    }),
  ],
  '13': [
    offering({
      id: 'cn-crew',
      visaTypeId: 'crew',
      visaTypeLabel: 'Crew / Marine (C)',
      purposeId: 'crew_joining',
      purposeLabel: 'Crew joining',
      processingTimeline: '10–14 business days',
      entryType: 'Crew visa',
      requirementSummary: 'CDC, vessel docs, passport',
      workflowProfile: 'crew',
    }),
    offering({
      id: 'cn-transit',
      visaTypeId: 'transit',
      visaTypeLabel: 'Transit Visa',
      purposeId: 'transit',
      purposeLabel: 'Transit connection',
      processingTimeline: '5–8 business days',
      entryType: 'Under 72h connection',
      requirementSummary: 'Onward ticket, passport',
    }),
  ],
}

const DEFAULT_OFFERINGS: CountryVisaOffering[] = [
  offering({
    id: 'default-tourist',
    visaTypeId: 'tourist',
    visaTypeLabel: 'Tourist Visa',
    purposeId: 'tourism',
    purposeLabel: 'Tourism',
    processingTimeline: '7–14 business days',
    entryType: 'Single entry',
    requirementSummary: 'Passport, photo, travel proof',
  }),
  offering({
    id: 'default-business',
    visaTypeId: 'business',
    visaTypeLabel: 'Business Visa',
    purposeId: 'business_meeting',
    purposeLabel: 'Business meeting',
    processingTimeline: '10–15 business days',
    entryType: 'Single / multiple',
    requirementSummary: 'Passport, invitation letter',
  }),
]

function buildMasters(): CountryMaster[] {
  return getAllCountries().map(c => ({
    id: c.id,
    code: c.code,
    name: c.name,
    flag: c.flags,
    region: c.region,
    status: 'active' as const,
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
    visaOfferings: OFFERINGS_BY_COUNTRY[c.id] ?? DEFAULT_OFFERINGS,
  }))
}

let cache: CountryMaster[] | null = null

export function getMockCountryMasters(): CountryMaster[] {
  if (!cache) cache = buildMasters()
  return cache
}

export function resetMockCountryMastersCache(): void {
  cache = null
}
