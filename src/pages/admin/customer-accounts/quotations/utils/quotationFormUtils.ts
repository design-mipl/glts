import type { QuotationFormData } from '@/shared/types/quotation'
import { getDefaultQuotationGstSelection } from '@/shared/utils/quotationGstUtils'

export function createEmptyQuotationFormData(): QuotationFormData {
  const today = new Date().toISOString().slice(0, 10)
  const validTill = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  const defaultGst = getDefaultQuotationGstSelection()
  return {
    sourceType: 'direct',
    workflowType: 'corporate',
    customer: {
      companyName: '',
      contactPersonName: '',
      contactNumber: '',
      emailAddress: '',
      companyAddress: '',
    },
    quotationDate: today,
    validTill,
    notes: '',
    gstRateId: defaultGst.gstRateId,
    gstPercentage: defaultGst.gstPercentage,
    pricingMatrix: [],
  }
}
