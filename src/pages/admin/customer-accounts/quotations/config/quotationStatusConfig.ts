import {
  clientManagementPipelineColor,
  clientManagementPipelineLabel,
  pipelineStatusOptions,
} from '@/shared/config/clientManagementPipelineConfig'
import type { QuotationSharedStatus } from '@/shared/types/quotation'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'

export const quotationPipelineStatusLabel = clientManagementPipelineLabel
export const quotationPipelineStatusColor = clientManagementPipelineColor
export const quotationPipelineStatusOptions = pipelineStatusOptions(true)

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
