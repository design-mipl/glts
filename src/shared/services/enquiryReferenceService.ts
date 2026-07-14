import { enquiryService } from '@/shared/services/enquiryService'
import type { EnquiryRecord, EnquiryStatus } from '@/shared/types/enquiry'
import { getVisaRequirementItems } from '@/shared/utils/enquiryVisaRequirementUtils'

const INELIGIBLE_ENQUIRY_STATUSES: EnquiryStatus[] = ['converted', 'lost']

function formatEnquiryOptionLabel(enquiry: EnquiryRecord): string {
  const visaItems = getVisaRequirementItems(enquiry.visaRequirement)
  const countries = visaItems.map((item) => item.country).join(', ') || 'No countries'
  return `${enquiry.id} · ${enquiry.customer.companyOrCustomerName} · ${countries}`
}

export const enquiryReferenceService = {
  listEligible(): EnquiryRecord[] {
    return enquiryService
      .listEligibleForQuotation()
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  },

  getSelectOptions() {
    return this.listEligible().map((enquiry) => ({
      value: enquiry.id,
      label: formatEnquiryOptionLabel(enquiry),
    }))
  },

  isEligible(enquiry: EnquiryRecord | undefined): boolean {
    if (!enquiry) return false
    return !INELIGIBLE_ENQUIRY_STATUSES.includes(enquiry.status)
  },
}
