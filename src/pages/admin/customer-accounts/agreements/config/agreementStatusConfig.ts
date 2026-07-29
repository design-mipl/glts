import type {
  AgreementBillingType,
  AgreementHoldTerminateStatus,
  AgreementStatus,
  AgreementType,
  AgreementWorkflowType,
} from '@/shared/types/commercialAgreement'

export const agreementStatusLabel: Record<AgreementStatus, string> = {
  draft: 'Draft',
  ready_for_activation: 'Ready for activation',
  active: 'Active',
  expired: 'Expired',
  on_hold: 'On hold',
  terminated: 'Terminated',
}

export const agreementStatusColor: Record<
  AgreementStatus,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  draft: 'neutral',
  ready_for_activation: 'info',
  active: 'success',
  expired: 'warning',
  on_hold: 'warning',
  terminated: 'error',
}

export const AGREEMENT_STATUS_FILTER_OPTIONS: { value: AgreementStatus; label: string }[] = [
  { value: 'draft', label: agreementStatusLabel.draft },
  { value: 'ready_for_activation', label: agreementStatusLabel.ready_for_activation },
  { value: 'active', label: agreementStatusLabel.active },
  { value: 'expired', label: agreementStatusLabel.expired },
  { value: 'on_hold', label: agreementStatusLabel.on_hold },
  { value: 'terminated', label: agreementStatusLabel.terminated },
]

export const AGREEMENT_HOLD_TERMINATE_OPTIONS: { value: AgreementHoldTerminateStatus; label: string }[] = [
  { value: 'on_hold', label: agreementStatusLabel.on_hold },
  { value: 'terminated', label: agreementStatusLabel.terminated },
]

export function canEditAgreement(status: AgreementStatus): boolean {
  return status === 'draft' || status === 'ready_for_activation'
}

export function canMarkReadyForActivation(status: AgreementStatus): boolean {
  return status === 'draft'
}

export function canProceedToCorporateAccount(status: AgreementStatus): boolean {
  return status === 'ready_for_activation'
}

export function canUpdateAgreementHoldOrTerminate(status: AgreementStatus): boolean {
  return status === 'active' || status === 'ready_for_activation' || status === 'expired'
}

export const agreementTypeLabel: Record<AgreementType, string> = {
  agreemented: 'Agreemented',
  non_agreemented: 'Non-agreemented',
}

export const agreementTypeColor: Record<
  AgreementType,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  agreemented: 'success',
  non_agreemented: 'warning',
}

export const workflowTypeLabel: Record<AgreementWorkflowType, string> = {
  marine: 'Marine',
  corporate: 'Corporate',
  b2b_agent: 'B2B Agent',
  mixed: 'Mixed',
  retail: 'Retail',
}

export const workflowTypeColor: Record<
  AgreementWorkflowType,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  marine: 'info',
  corporate: 'success',
  b2b_agent: 'warning',
  mixed: 'neutral',
  retail: 'error',
}

/** Commercial workflow options for agreement UI (no retail). */
export const AGREEMENT_WORKFLOW_OPTIONS: { value: AgreementWorkflowType; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'b2b_agent', label: 'B2B Agent' },
  { value: 'mixed', label: 'Mixed' },
]

export const billingTypeLabel: Record<AgreementBillingType, string> = {
  credit: 'Credit',
  advance: 'Advance',
  mixed: 'Mixed',
}

export const billingTypeColor: Record<
  AgreementBillingType,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  credit: 'info',
  advance: 'success',
  mixed: 'warning',
}

export const onboardingDocumentStatusLabel = {
  pending: 'Pending',
  uploaded: 'Uploaded',
  verified: 'Verified',
  rejected: 'Rejected',
} as const

export const onboardingDocumentStatusColor: Record<
  keyof typeof onboardingDocumentStatusLabel,
  'neutral' | 'info' | 'success' | 'error'
> = {
  pending: 'neutral',
  uploaded: 'info',
  verified: 'success',
  rejected: 'error',
}

export const advanceTypeLabel = {
  full: 'Full Advance',
  percentage: 'Percentage Advance',
  fixed: 'Fixed Advance',
} as const

export const processingBlockRuleLabel = {
  before_submission: 'Block Before Submission',
  before_appointment: 'Block Before Appointment',
  before_processing: 'Block Before Processing',
} as const

export const customerSourceModeLabel = {
  quotation: 'Reference Quotation',
  existing: 'Existing Customer',
  new: 'New Customer',
} as const
