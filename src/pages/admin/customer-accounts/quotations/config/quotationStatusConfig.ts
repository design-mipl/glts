import type { QuotationSharedStatus, QuotationVersionStatus } from '@/shared/types/quotation'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'

export const quotationVersionStatusLabel: Record<QuotationVersionStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const quotationVersionStatusColor: Record<
  QuotationVersionStatus,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  draft: 'neutral',
  submitted: 'info',
  approved: 'success',
  rejected: 'error',
}

export const quotationSharedStatusLabel: Record<QuotationSharedStatus, string> = {
  not_shared: 'Not Shared',
  shared: 'Shared',
}

export const quotationSharedStatusColor: Record<QuotationSharedStatus, 'neutral' | 'success'> = {
  not_shared: 'neutral',
  shared: 'success',
}

export const quotationSourceTypeLabel = {
  enquiry: 'Enquiry',
  direct: 'Direct',
} as const

export const quotationSourceTypeColor = {
  enquiry: 'info',
  direct: 'neutral',
} as const

export { workflowTypeLabel, workflowTypeColor } from '../../agreements/config/agreementStatusConfig'

export type { AgreementWorkflowType }
