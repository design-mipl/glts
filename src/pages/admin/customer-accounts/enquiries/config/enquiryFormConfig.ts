import type { EnquiryCustomerType, EnquiryProcessingType, EnquirySource } from '@/shared/types/enquiry'

type BadgeColor = 'neutral' | 'info' | 'warning' | 'success' | 'error'

export const enquiryProcessingTypeLabel: Record<EnquiryProcessingType, string> = {
  standard: 'Standard',
  express: 'Express',
  urgent: 'Urgent',
}

export function formatEnquiryProcessingType(value?: string): string {
  if (!value) return '--'
  const key = value as EnquiryProcessingType
  return enquiryProcessingTypeLabel[key] ?? value
}

export function formatEnquiryInquirySource(source?: EnquirySource | string): string {
  if (!source) return '--'
  return enquiryInquirySourceOptions.find((option) => option.value === source)?.label ?? source
}

export const enquiryProcessingTypeOptions: { label: string; value: EnquiryProcessingType }[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Express', value: 'express' },
  { label: 'Urgent', value: 'urgent' },
]

export const enquiryFormCountryOptions = [
  { label: 'UAE', value: 'UAE' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'UK', value: 'UK' },
  { label: 'USA', value: 'USA' },
]

export const enquiryInquirySourceOptions = [
  { label: 'Website', value: 'website' },
  { label: 'Referral', value: 'referral' },
  { label: 'Existing Customer', value: 'existing_customer' },
  { label: 'Email', value: 'email' },
  { label: 'Call', value: 'call' },
  { label: 'Sales Team', value: 'sales_team' },
]

export const enquiryCustomerTypeOptions = [
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export const enquiryCustomerTypeColor: Record<EnquiryCustomerType, BadgeColor> = {
  retail: 'info',
  corporate: 'success',
  marine: 'warning',
}

export const enquiryInquirySourceColor: Record<EnquirySource, BadgeColor> = {
  website: 'info',
  referral: 'warning',
  existing_customer: 'success',
  email: 'neutral',
  call: 'neutral',
  sales_team: 'error',
}

export const enquiryProcessingTypeColor: Record<EnquiryProcessingType, BadgeColor> = {
  standard: 'neutral',
  express: 'info',
  urgent: 'error',
}
