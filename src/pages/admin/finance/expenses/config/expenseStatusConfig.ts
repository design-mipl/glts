import type {
  ApplicationExpenseFinanceStatus,
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

export const expenseFinanceStatusColor: Record<
  ApplicationExpenseFinanceStatus,
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  needs_update: 'warning',
  paid: 'info',
  reconciled: 'success',
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

export const expenseInvoiceStatusColor: Record<
  'invoiced' | 'not_invoiced',
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  invoiced: 'success',
  not_invoiced: 'neutral',
}
