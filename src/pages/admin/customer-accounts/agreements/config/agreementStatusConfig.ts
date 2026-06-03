import type {
  AgreementBillingType,
  AgreementStatus,
  AgreementType,
  AgreementWorkflowType,
} from '@/shared/types/commercialAgreement'

export const agreementStatusLabel: Record<AgreementStatus, string> = {
  draft: 'Draft',
  submitted: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
  inactive: 'Inactive',
}

export const agreementStatusColor: Record<
  AgreementStatus,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  draft: 'neutral',
  submitted: 'info',
  approved: 'success',
  rejected: 'error',
  expired: 'warning',
  inactive: 'neutral',
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

/** B2B-only workflow options for agreement UI */
export const AGREEMENT_WORKFLOW_OPTIONS: { value: AgreementWorkflowType; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'b2b_agent', label: 'B2B Agent' },
  { value: 'retail', label: 'Retail' },
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
