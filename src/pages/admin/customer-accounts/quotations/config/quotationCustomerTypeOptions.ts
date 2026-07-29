import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'

/** Customer types available on quotation create/edit. */
export const quotationCustomerTypeOptions: { label: string; value: AgreementWorkflowType }[] = [
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
  { label: 'B2B Agent', value: 'b2b_agent' },
]
