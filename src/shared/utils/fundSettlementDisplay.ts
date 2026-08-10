import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export type SettlementAmountTone = 'reimburse' | 'return' | 'settled'

/**
 * How settlementAmount is interpreted:
 * - `closing_cash` (bank float): positive = return to Accounts; negative = reimburse executive
 * - `expense_vs_allocated` (card / non-bank claims): positive = reimburse; negative = return
 */
export type SettlementConvention = 'closing_cash' | 'expense_vs_allocated'

/**
 * Default: closing-cash convention for bank float reconciliation.
 */
export function formatSettlementAmountLabel(
  amount: number,
  convention: SettlementConvention = 'closing_cash',
): string {
  if (convention === 'expense_vs_allocated') {
    if (amount > 0) return `${formatInr(amount)} Reimburse`
    if (amount < 0) return `${formatInr(Math.abs(amount))} Return`
    return 'Settled'
  }
  if (amount > 0) return `${formatInr(amount)} Return`
  if (amount < 0) return `${formatInr(Math.abs(amount))} Reimburse`
  return 'Settled'
}

export function getSettlementAmountTone(
  amount: number,
  convention: SettlementConvention = 'closing_cash',
): SettlementAmountTone {
  if (amount === 0) return 'settled'
  if (convention === 'expense_vs_allocated') {
    return amount > 0 ? 'reimburse' : 'return'
  }
  return amount > 0 ? 'return' : 'reimburse'
}

/** MUI palette path for settlement tone. */
export function getSettlementAmountColor(
  tone: SettlementAmountTone,
): 'warning.main' | 'success.main' | 'text.primary' {
  if (tone === 'reimburse') return 'warning.main'
  if (tone === 'return') return 'success.main'
  return 'text.primary'
}

export function getSettlementAmountHint(
  amount: number,
  convention: SettlementConvention = 'closing_cash',
): string {
  if (amount === 0) return 'Settlement completed. No action required.'
  if (convention === 'expense_vs_allocated') {
    if (amount > 0) return 'Finance reimburses Ground Ops'
    return 'Ground Ops returns excess to Finance'
  }
  if (amount > 0) return 'Return remaining cash to Accounts'
  return 'GLTS reimburses the executive'
}

/** Short day label for reconciliation rows. */
export function formatSettlementDayLabel(dateKey: string): string {
  return formatDisplayDate(dateKey)
}

/** Longer header label for settlement drawer / summary headers. */
export function formatSettlementHeaderDate(dateKey: string): string {
  return formatDisplayDate(dateKey)
}
