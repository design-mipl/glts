import type { AgreementBillingType, AgreementPricingRow, AgreementWorkflowType } from './commercialAgreement'
import type { CompanyMasterFormData } from './companyMaster'

export interface QuotationReference {
  id: string
  quotationId: string
  companyName: string
  gstNumber: string
  companyId?: string
  workflowType: AgreementWorkflowType
  billingType: AgreementBillingType
  company: CompanyMasterFormData
  pricingMatrix: AgreementPricingRow[]
  contactPersonName: string
  createdAt: string
}

export interface QuotationReferenceListFilters {
  query?: string
}
