import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { CustomerType } from '@/shared/auth/session'

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

/** Map signed-in customer portal type to application / Country Master segment. */
export function mapCustomerTypeToApplicationSegment(
  customerType?: CustomerType,
): ApplicationCustomerSegment {
  if (customerType === 'marine') return 'marine'
  if (customerType === 'b2b_agent') return 'b2bAgents'
  if (customerType === 'corporate') return 'corporate'
  return 'retail'
}
