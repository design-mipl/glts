import { ALL_SEGMENTS } from '@/shared/data/countryMasterDefaults'
import type { BusinessSegment } from '@/shared/types/countryMaster'

export type CountryListingTab = 'all' | BusinessSegment

export const COUNTRY_LISTING_TABS: { value: CountryListingTab; label: string }[] = [
  { value: 'all', label: 'All Countries' },
  { value: 'retail', label: 'Retail' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'marine', label: 'Marine' },
  { value: 'b2bAgents', label: 'B2B Agents' },
]

export const SEGMENT_LABELS: Record<BusinessSegment, string> = {
  retail: 'Retail',
  corporate: 'Corporate',
  marine: 'Marine',
  b2bAgents: 'B2B Agents',
}

export const SEGMENT_DESCRIPTIONS: Record<BusinessSegment, string> = {
  retail: 'Individual travelers and retail visa processing',
  corporate: 'Corporate client accounts and managed travel programs',
  marine: 'Crew, shipping, and marine visa workflows',
  b2bAgents: 'Independent B2B agent partners and sub-agent submission channels',
}

export type CountryDetailTab =
  | 'overview'
  | 'visa-types'
  | 'checklist'
  | 'processing-rules'
  | 'activity'

export const COUNTRY_DETAIL_TABS: { value: CountryDetailTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'visa-types', label: 'Visa Types' },
  { value: 'checklist', label: 'Document Checklist' },
  { value: 'processing-rules', label: 'Processing Rules' },
  { value: 'activity', label: 'Activity Timeline' },
]

export function listingTabToSegment(tab: CountryListingTab): BusinessSegment | undefined {
  if (tab === 'all') return undefined
  return tab
}

export function parseSegmentParam(value: string | null): BusinessSegment | undefined {
  if (value && ALL_SEGMENTS.includes(value as BusinessSegment)) {
    return value as BusinessSegment
  }
  return undefined
}

export function parseDetailTabParam(value: string | null): CountryDetailTab {
  const valid: CountryDetailTab[] = [
    'overview',
    'visa-types',
    'checklist',
    'processing-rules',
    'activity',
  ]
  if (value && valid.includes(value as CountryDetailTab)) return value as CountryDetailTab
  return 'overview'
}
