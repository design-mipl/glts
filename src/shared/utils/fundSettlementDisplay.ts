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

/** Short day label for reconciliation rows, e.g. `23 Jul`. */
export function formatSettlementDayLabel(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** Longer header label, e.g. `24 Jul 2026`. */
export function formatSettlementHeaderDate(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
