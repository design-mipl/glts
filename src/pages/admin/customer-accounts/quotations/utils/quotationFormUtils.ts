import type { QuotationFormData } from '@/shared/types/quotation'

export function createEmptyQuotationFormData(): QuotationFormData {
  const today = new Date().toISOString().slice(0, 10)
  const validTill = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
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
    gstPercentage: 18,
    pricingMatrix: [],
  }
}
