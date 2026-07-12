import type { AgreementWorkflowType } from './commercialAgreement'
import type { CommercialVisaPricingRule, QuotationServiceLine } from './quotation'

export interface QuotationPricingTemplate {
  id: string
  name: string
  /** Customer type when the template was saved (for display only — list shows all). */
  workflowType: AgreementWorkflowType
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
  createdAt: string
  updatedAt: string
}
