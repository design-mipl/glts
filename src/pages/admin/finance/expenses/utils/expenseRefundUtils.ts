import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import { isGoRefundExpenseId } from '@/shared/utils/invoiceConsulateRefundUtils'

/** Consulate / logistics refund lines synced from Ground Ops Tracking & Logistics. */
export function isConsulateRefundExpense(expense: ApplicationExpenseRecord): boolean {
  if (isGoRefundExpenseId(expense.id)) return true
  if (expense.linkedService === 'Logistics consulate refund') return true
  const label = (expense.expenseName || expense.expenseTypeLabel || '').trim().toLowerCase()
  return label.startsWith('consulate refund')
}

export function splitPassengerExpenses(expenses: ApplicationExpenseRecord[]): {
  serviceExpenses: ApplicationExpenseRecord[]
  refundExpenses: ApplicationExpenseRecord[]
} {
  const serviceExpenses: ApplicationExpenseRecord[] = []
  const refundExpenses: ApplicationExpenseRecord[] = []
  for (const expense of expenses) {
    if (isConsulateRefundExpense(expense)) refundExpenses.push(expense)
    else serviceExpenses.push(expense)
  }
  return { serviceExpenses, refundExpenses }
}
