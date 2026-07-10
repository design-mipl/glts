import type { EnquiryRecord } from '@/shared/types/enquiry'
import type { QuotationFormData } from '@/shared/types/quotation'
import { getDefaultQuotationGstSelection } from '@/shared/utils/quotationGstUtils'

function mapEnquiryCustomerTypeToWorkflow(
  customerType: EnquiryRecord['customer']['customerType'],
): QuotationFormData['workflowType'] {
  if (customerType === 'marine') return 'marine'
  if (customerType === 'corporate') return 'corporate'
  return 'retail'
}

export function buildQuotationFormDataFromEnquiry(
  enquiry: EnquiryRecord,
  base?: Partial<QuotationFormData>,
): QuotationFormData {
  const today = new Date().toISOString().slice(0, 10)
  const validTill = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)

  const defaultGst = getDefaultQuotationGstSelection()

  return {
    sourceType: 'enquiry',
    enquiryId: enquiry.id,
    workflowType: mapEnquiryCustomerTypeToWorkflow(enquiry.customer.customerType),
    customer: {
      companyName: enquiry.customer.companyOrCustomerName,
      contactPersonName: enquiry.customer.contactPersonName ?? '',
      contactNumber: enquiry.customer.contactNumber ?? '',
      alternateContactNumber: enquiry.customer.alternateContactNumber ?? '',
      emailAddress: enquiry.customer.emailAddress ?? '',
      companyAddress: enquiry.customer.companyAddress ?? '',
    },
    quotationDate: base?.quotationDate ?? today,
    validTill: base?.validTill ?? validTill,
    notes: enquiry.notes.initialDiscussionNotes ?? enquiry.notes.internalNotes ?? base?.notes ?? '',
    gstRateId: base?.gstRateId ?? defaultGst.gstRateId,
    gstPercentage: base?.gstPercentage ?? defaultGst.gstPercentage,
    pricingMatrix: base?.pricingMatrix ?? [],
  }
}
