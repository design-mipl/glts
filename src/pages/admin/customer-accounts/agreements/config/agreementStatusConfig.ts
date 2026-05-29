import type { AgreementStatus, AgreementType, AgreementBillingType, AgreementWorkflowType } from '@/shared/types/commercialAgreement'

export const agreementStatusLabel: Record<AgreementStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
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
}

export const agreementTypeLabel: Record<AgreementType, string> = {
  agreemented: 'Agreemented',
  non_agreemented: 'Non-agreemented',
}

export const workflowTypeLabel: Record<AgreementWorkflowType, string> = {
  marine: 'Marine',
  corporate: 'Corporate',
  retail: 'Retail',
  mixed: 'Mixed',
}

export const billingTypeLabel: Record<AgreementBillingType, string> = {
  credit: 'Credit',
  advance: 'Advance',
  mixed: 'Mixed',
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
