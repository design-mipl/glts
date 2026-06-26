import type { EnquiryCustomerType } from '@/shared/types/enquiry'
import type { BusinessSegment } from '@/shared/types/countryMaster'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'

function customerTypeToSegment(customerType: EnquiryCustomerType): BusinessSegment | undefined {
  switch (customerType) {
    case 'retail':
      return 'retail'
    case 'corporate':
      return 'corporate'
    case 'marine':
      return 'marine'
    default:
      return undefined
  }
}

export function getEnquiryCountryOptions() {
  return countryMasterAdminService
    .list({ status: 'active' })
    .map((country) => ({ value: country.id, label: country.name }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function resolveEnquiryCountryName(countryId: string): string {
  return countryMasterAdminService.getById(countryId)?.name ?? countryId
}

export function getEnquiryVisaTypeOptions(countryId: string, customerType: EnquiryCustomerType) {
  const country = countryMasterAdminService.getById(countryId)
  if (!country) return []

  const segment = customerTypeToSegment(customerType)
  const segments = segment
    ? country.segments.filter((entry) => entry.segment === segment && entry.enabled)
    : country.segments.filter((entry) => entry.enabled)

  const visaTypes = new Set<string>()
  segments.forEach((entry) => {
    entry.visaTypes
      .filter((visaType) => visaType.status === 'active')
      .forEach((visaType) => visaTypes.add(visaType.name))
  })

  return [...visaTypes].sort((a, b) => a.localeCompare(b)).map((name) => ({ value: name, label: name }))
}
