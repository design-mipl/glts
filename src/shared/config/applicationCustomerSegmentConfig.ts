import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'

export interface ApplicationCustomerSegmentOption {
  value: ApplicationCustomerSegment
  label: string
}

export const APPLICATION_CUSTOMER_SEGMENT_OPTIONS: ReadonlyArray<ApplicationCustomerSegmentOption> = [
  { value: 'retail', label: 'Retail' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'marine', label: 'Marine' },
  { value: 'b2bAgents', label: 'B2B Agent' },
]

export const APPLICATION_CUSTOMER_SEGMENT_LABELS: Record<ApplicationCustomerSegment, string> =
  Object.fromEntries(
    APPLICATION_CUSTOMER_SEGMENT_OPTIONS.map(option => [option.value, option.label]),
  ) as Record<ApplicationCustomerSegment, string>

export const APPLICATION_CUSTOMER_SEGMENTS: ApplicationCustomerSegment[] =
  APPLICATION_CUSTOMER_SEGMENT_OPTIONS.map(option => option.value)

export function getApplicationCustomerSegmentLabel(segment: ApplicationCustomerSegment): string {
  return APPLICATION_CUSTOMER_SEGMENT_LABELS[segment]
}
