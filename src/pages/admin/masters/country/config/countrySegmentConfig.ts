import type { BusinessSegment } from '@/shared/types/countryMaster'

export type CountryListingTab = 'all' | BusinessSegment

export const COUNTRY_LISTING_TABS: { value: CountryListingTab; label: string }[] = [
  { value: 'all', label: 'All Countries' },
  { value: 'retail', label: 'Retail' },
  { value: 'corporate', label: 'Corporate / B2B' },
  { value: 'marine', label: 'Marine' },
]

export const SEGMENT_LABELS: Record<BusinessSegment, string> = {
  retail: 'Retail',
  corporate: 'Corporate / B2B',
  marine: 'Marine',
}

export const SEGMENT_DESCRIPTIONS: Record<BusinessSegment, string> = {
  retail: 'Individual travelers and retail visa processing',
  corporate: 'B2B accounts and corporate travel programs',
  marine: 'Crew, shipping, and marine visa workflows',
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
  if (value === 'retail' || value === 'corporate' || value === 'marine') return value
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
