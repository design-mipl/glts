import { describe, expect, it } from 'vitest'
import { getCountryMasterById, listPortalCountries } from '@/shared/services/countryMasterService'
import type { BusinessSegment, CountryMaster, CountryProcessingRules, CountryVisaType } from '@/shared/types/countryMaster'
import {
  countryHasBookableConfiguration,
  resolvePortalProcessingTime,
  resolvePortalStartingPrice,
  resolvePortalValidityLabel,
} from './portalCountryDisplay'

const stubRules: CountryProcessingRules = {
  submissionMode: 'vfs',
  normalProcessingDays: '10',
  appointmentRequired: false,
  fundsHandlingMode: 'customer_pays',
  ocrPolicyEnabled: false,
  workflowProfile: 'standard',
  biometricRequired: false,
  interviewRequired: false,
  physicalPassportRequired: false,
}

function visaType(partial: Partial<CountryVisaType> & Pick<CountryVisaType, 'id' | 'name'>): CountryVisaType {
  return {
    visaCategory: 'Tourism',
    processingTime: '7–14 business days',
    entryType: 'Single entry',
    validity: '30 days',
    stayDuration: '30 days',
    prioritySupport: false,
    status: 'active',
    jurisdictions: [],
    applicationDocuments: [],
    ...partial,
  }
}

function masterWithSegments(
  entries: Array<{
    segment: BusinessSegment
    enabled: boolean
    visaTypes: CountryVisaType[]
  }>,
): CountryMaster {
  return {
    id: '5',
    code: 'US',
    name: 'USA',
    flag: '🇺🇸',
    region: 'Americas',
    status: 'active',
    processingType: 'vfs',
    cities: 'New York',
    heroPhotoId: 'usa',
    processingTime: '7–14 business days',
    price: 14200,
    rating: 64,
    trending: false,
    trendingPercent: 0,
    visaCategory: 'Tourism',
    validity: '30 days',
    passportIssueLocations: [],
    segments: entries.map((entry) => ({
      segment: entry.segment,
      enabled: entry.enabled,
      commonDocuments: [],
      processingRules: stubRules,
      visaTypes: entry.visaTypes,
    })),
    visaOfferings: [],
    createdAt: '',
    updatedAt: '',
    activities: [],
  }
}

const usaMaster = masterWithSegments([
  {
    segment: 'retail',
    enabled: true,
    visaTypes: [
      visaType({
        id: 'us-tourist',
        name: 'Tourist Visa',
        processingTime: '7–14 business days',
        validity: '30 days',
        pricing: 14200,
      }),
    ],
  },
  {
    segment: 'corporate',
    enabled: true,
    visaTypes: [
      visaType({
        id: 'us-business-corp',
        name: 'Business Visa',
        visaCategory: 'Business',
        processingTime: '10–14 business days',
        validity: '1 year',
        pricing: 18600,
      }),
    ],
  },
  {
    segment: 'b2bAgents',
    enabled: true,
    visaTypes: [
      visaType({
        id: 'us-agent-tourist',
        name: 'Agent Tourist Visa',
        processingTime: '8–12 business days',
        validity: '30 days',
        pricing: 11800,
      }),
      visaType({
        id: 'us-agent-business',
        name: 'Agent Business Visa',
        visaCategory: 'Business',
        processingTime: '10–14 business days',
        validity: '90 days',
        pricing: 16400,
      }),
    ],
  },
  {
    segment: 'marine',
    enabled: false,
    visaTypes: [],
  },
])

describe('resolvePortalProcessingTime', () => {
  it('uses country-level time when no segment is passed', () => {
    expect(resolvePortalProcessingTime(usaMaster)).toBe('7–14 business days')
  })

  it('uses the segment visa type when a portal segment is passed', () => {
    expect(resolvePortalProcessingTime(usaMaster, { segment: 'corporate' })).toBe('10–14 business days')
    expect(resolvePortalProcessingTime(usaMaster, { segment: 'b2bAgents' })).toBe('8–12 business days')
    expect(resolvePortalProcessingTime(usaMaster, { segment: 'retail' })).toBe('7–14 business days')
  })
})

describe('resolvePortalValidityLabel', () => {
  it('uses the segment visa type validity', () => {
    expect(resolvePortalValidityLabel(usaMaster, { segment: 'corporate' })).toBe('1 year')
    expect(resolvePortalValidityLabel(usaMaster, { segment: 'b2bAgents' })).toBe('30 days')
    expect(resolvePortalValidityLabel(usaMaster, { segment: 'retail' })).toBe('30 days')
  })
})

describe('resolvePortalStartingPrice', () => {
  it('uses country price when no segment is passed', () => {
    expect(resolvePortalStartingPrice(usaMaster)).toBe(14200)
  })

  it('uses the lowest priced active visa type in the segment', () => {
    expect(resolvePortalStartingPrice(usaMaster, { segment: 'corporate' })).toBe(18600)
    expect(resolvePortalStartingPrice(usaMaster, { segment: 'b2bAgents' })).toBe(11800)
    expect(resolvePortalStartingPrice(usaMaster, { segment: 'retail' })).toBe(14200)
  })

  it('falls back to country price when the segment has no list prices', () => {
    const master = masterWithSegments([
      {
        segment: 'corporate',
        enabled: true,
        visaTypes: [visaType({ id: 'corp', name: 'Business Visa', processingTime: '10–14 business days', validity: '1 year' })],
      },
    ])
    expect(resolvePortalStartingPrice(master, { segment: 'corporate' })).toBe(14200)
  })
})

describe('countryHasBookableConfiguration', () => {
  it('hides countries with no active visa types in the requested segment', () => {
    expect(countryHasBookableConfiguration(usaMaster, 'marine')).toBe(false)
    expect(countryHasBookableConfiguration(usaMaster, 'corporate')).toBe(true)
  })
})

describe('USA country master seed', () => {
  it('maps corporate card fields from the corporate visa type, not retail website fields', () => {
    const usa = getCountryMasterById('5')
    expect(usa).toBeDefined()
    expect(resolvePortalProcessingTime(usa!, { segment: 'corporate' })).toBe('10–14 business days')
    expect(resolvePortalValidityLabel(usa!, { segment: 'corporate' })).toBe('1 year')
    expect(resolvePortalProcessingTime(usa!, { segment: 'retail' })).toBe('7–14 business days')
    expect(resolvePortalValidityLabel(usa!, { segment: 'retail' })).toBe('30 days')
  })

  it('omits USA from marine listings because marine is not enabled', () => {
    expect(listPortalCountries({ segment: 'marine' }).some((country) => country.id === '5')).toBe(false)
    expect(listPortalCountries({ segment: 'corporate' }).some((country) => country.id === '5')).toBe(true)
  })
})
