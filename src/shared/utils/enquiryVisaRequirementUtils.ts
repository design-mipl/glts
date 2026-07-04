import type { EnquiryVisaRequirement, EnquiryVisaRequirementItem } from '@/shared/types/enquiry'

export const purposeOfVisitTableTextSx = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  lineHeight: 1.45,
  fontSize: 13,
} as const

export function getVisaRequirementItems(requirement: EnquiryVisaRequirement): EnquiryVisaRequirementItem[] {
  if (requirement.items?.length) return requirement.items
  if (!requirement.countries.length) return []
  return requirement.countries.map((country, index) => ({
    id: `legacy-${index}-${country}`,
    country,
    visaType: requirement.visaType,
    purposeOfVisit: requirement.purposeOfVisit,
  }))
}

export function syncVisaRequirementFromItems(
  items: EnquiryVisaRequirementItem[],
): Pick<EnquiryVisaRequirement, 'items' | 'countries' | 'visaType' | 'purposeOfVisit'> {
  const countries = items.map((item) => item.country)
  const visaTypes = [...new Set(items.map((item) => item.visaType.trim()).filter(Boolean))]
  const purposes = [...new Set(items.map((item) => item.purposeOfVisit.trim()).filter(Boolean))]

  return {
    items,
    countries,
    visaType: visaTypes.length === 1 ? visaTypes[0] : visaTypes.join(', '),
    purposeOfVisit: purposes.length === 1 ? purposes[0] : purposes.join('; '),
  }
}

export function normalizeVisaRequirement(requirement: EnquiryVisaRequirement): EnquiryVisaRequirement {
  const items = getVisaRequirementItems(requirement)
  return {
    ...requirement,
    ...syncVisaRequirementFromItems(items),
  }
}
