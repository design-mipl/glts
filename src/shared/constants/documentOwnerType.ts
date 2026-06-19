import type { BusinessSegment, DocumentOwnerType } from '@/shared/types/countryMaster'

export const DOCUMENT_OWNER_TYPE_LABELS: Record<DocumentOwnerType, string> = {
  seafarer: 'Seafarer',
  applicant: 'Applicant',
  company: 'Company',
  shipping_agent: 'Shipping Agent',
  inviting_company: 'Inviting company',
  inviting_family_friend: 'Inviting family / friend',
}

export const MARINE_DOCUMENT_OWNER_TAB_ORDER: DocumentOwnerType[] = [
  'seafarer',
  'company',
  'shipping_agent',
]

const SEGMENT_OWNER_TYPES: Record<BusinessSegment, DocumentOwnerType[]> = {
  marine: ['seafarer', 'company', 'shipping_agent'],
  corporate: ['applicant', 'company', 'inviting_company'],
  retail: ['applicant', 'company', 'inviting_family_friend'],
  b2bAgents: [
    'seafarer',
    'applicant',
    'company',
    'shipping_agent',
    'inviting_company',
    'inviting_family_friend',
  ],
}

export function getDocumentOwnerTypeLabel(ownerType: DocumentOwnerType | undefined): string {
  if (!ownerType) return ''
  return DOCUMENT_OWNER_TYPE_LABELS[ownerType]
}

export function getDocumentOwnerTypeOptions(segment: BusinessSegment) {
  return SEGMENT_OWNER_TYPES[segment].map((value) => ({
    value,
    label: DOCUMENT_OWNER_TYPE_LABELS[value],
  }))
}
