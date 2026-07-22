import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import type { Invoice } from '@/shared/types/invoice'
import { getBilledItemsRegistry, isServiceAlreadyBilled } from '@/shared/utils/invoiceBilledItemsRegistry'
import { roundMoney } from '@/shared/utils/invoiceCalculations'
import { isGoRefundExpenseId } from './invoiceConsulateRefundUtils'

export {
  listInvoiceRefunds,
  sumInvoiceRefunds,
  sumPendingInvoiceRefunds,
  type InvoiceDetailRefundRow,
} from './invoiceConsulateRefundUtils'

function invoiceApplicationIds(invoice: Invoice): string[] {
  return [...new Set([...invoice.gltsReferences, ...invoice.batchIds].filter(Boolean))]
}

function isClientBillableExpense(expense: ApplicationExpenseRecord): boolean {
  return !expense.billTo || expense.billTo === 'client'
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function isConsulateRefundExpense(expense: ApplicationExpenseRecord): boolean {
  if (isGoRefundExpenseId(expense.id)) return true
  if (expense.linkedService === 'Logistics consulate refund') return true
  const label = normalizeKey(expense.expenseTypeLabel || expense.expenseName)
  return label.startsWith('consulate refund')
}

/**
 * Client-billable expenses for invoice applications that are not already on this invoice
 * and not locked as billed on another submitted invoice.
 */
export function listInvoiceUnbilledExpenses(invoice: Invoice): ApplicationExpenseRecord[] {
  const appIds = invoiceApplicationIds(invoice)
  if (appIds.length === 0) return []

  const onThisInvoice = new Set(
    invoice.lineItems
      .map(li => li.servicePresetId)
      .filter((id): id is string => Boolean(id)),
  )
  const onThisInvoiceLabels = new Set(
    invoice.lineItems.map(li => normalizeKey(li.description || li.serviceType)),
  )
  const billedRegistry = getBilledItemsRegistry()

  const byId = new Map<string, ApplicationExpenseRecord>()

  for (const applicationId of appIds) {
    applicationExpenseManagementService.syncApplication(applicationId)
    const detail = applicationExpenseManagementService.getApplicationDetail(applicationId)
    for (const expense of detail?.expenses ?? []) {
      if (!isClientBillableExpense(expense)) continue
      if (isConsulateRefundExpense(expense)) continue
      if (expense.netPayableAmount <= 0) continue
      if (onThisInvoice.has(expense.id)) continue
      if (onThisInvoiceLabels.has(normalizeKey(expense.expenseTypeLabel || expense.expenseName))) {
        continue
      }
      const serviceLabel = expense.expenseTypeLabel || expense.expenseName
      if (
        isServiceAlreadyBilled(billedRegistry, applicationId, undefined, serviceLabel) ||
        isServiceAlreadyBilled(billedRegistry, undefined, applicationId, serviceLabel)
      ) {
        continue
      }
      byId.set(expense.id, expense)
    }
  }

  return [...byId.values()].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export function sumUnbilledExpenses(expenses: ApplicationExpenseRecord[]): number {
  return roundMoney(expenses.reduce((sum, expense) => sum + expense.netPayableAmount, 0))
}
