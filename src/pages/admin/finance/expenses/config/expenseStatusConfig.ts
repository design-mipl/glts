import type {
  ApplicationExpenseProofStatus,
  ApplicationExpenseRollupApprovalStatus,
  ApplicationExpenseRollupPaymentStatus,
} from '@/shared/types/applicationExpenseManagement'

export const expenseRollupApprovalColor: Record<
  ApplicationExpenseRollupApprovalStatus,
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  none: 'neutral',
  pending: 'warning',
  partial: 'info',
  approved: 'success',
  rejected: 'error',
  clarification: 'warning',
}

export const expenseRollupPaymentColor: Record<
  ApplicationExpenseRollupPaymentStatus,
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  none: 'neutral',
  not_paid: 'warning',
  partially_paid: 'info',
  paid: 'success',
  pending_reimbursement: 'warning',
}

export const expenseProofStatusColor: Record<
  ApplicationExpenseProofStatus,
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  not_required: 'neutral',
  missing: 'error',
  uploaded: 'info',
  verified: 'success',
}

export const expenseProofStatusLabel: Record<ApplicationExpenseProofStatus, string> = {
  not_required: 'Not Required',
  missing: 'Missing',
  uploaded: 'Uploaded',
  verified: 'Verified',
}
