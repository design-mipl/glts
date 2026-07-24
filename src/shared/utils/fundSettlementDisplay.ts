import { formatInr } from '@/shared/utils/invoiceCalculations'

export type SettlementAmountTone = 'reimburse' | 'return' | 'settled'

/**
 * Settlement = expenses incurred − allocated amount.
 * Positive → Finance reimburses Ground Ops; negative → Ground Ops returns excess; zero → settled.
 */
export function formatSettlementAmountLabel(amount: number): string {
  if (amount > 0) return `${formatInr(amount)} Reimburse`
  if (amount < 0) return `${formatInr(Math.abs(amount))} Return`
  return 'Settled'
}

export function getSettlementAmountTone(amount: number): SettlementAmountTone {
  if (amount > 0) return 'reimburse'
  if (amount < 0) return 'return'
  return 'settled'
}

/** MUI palette path for settlement tone. */
export function getSettlementAmountColor(
  tone: SettlementAmountTone,
): 'warning.main' | 'success.main' | 'text.primary' {
  if (tone === 'reimburse') return 'warning.main'
  if (tone === 'return') return 'success.main'
  return 'text.primary'
}

export function getSettlementAmountHint(amount: number): string {
  if (amount > 0) return 'Finance reimburses Ground Ops'
  if (amount < 0) return 'Ground Ops returns excess to Finance'
  return 'Settlement completed'
}
