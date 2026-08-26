import type { ReconciliationPeriodPreset, ReconciliationTab } from '@/shared/types/reconciliation'

export type ReconciliationPaymentMode = 'credit_card' | 'bank' | 'dd'

/** Mode-of-payment tab only — Credit Card, Bank, DD. */
export const RECONCILIATION_PAYMENT_MODE_OPTIONS: {
  value: ReconciliationPaymentMode
  label: string
}[] = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank', label: 'Bank' },
  { value: 'dd', label: 'DD' },
]

const RECONCILIATION_PAYMENT_MODE_LABELS: Record<ReconciliationPaymentMode, string> = {
  credit_card: 'Credit Card',
  bank: 'Bank',
  dd: 'DD',
}

/** Map expense / fund-transfer payment mode to reconciliation mode-of-payment categories. */
export function mapToReconciliationPaymentMode(
  expenseMode?: string,
): ReconciliationPaymentMode | null {
  if (!expenseMode?.trim()) return null
  switch (expenseMode) {
    case 'card':
    case 'card_cash':
      return 'credit_card'
    case 'bank_transfer':
      return 'bank'
    case 'dd':
      return 'dd'
    default:
      return null
  }
}

export function getReconciliationPaymentModeLabel(value?: string): string {
  if (!value?.trim()) return '—'
  if (value in RECONCILIATION_PAYMENT_MODE_LABELS) {
    return RECONCILIATION_PAYMENT_MODE_LABELS[value as ReconciliationPaymentMode]
  }
  const mapped = mapToReconciliationPaymentMode(value)
  if (mapped) return RECONCILIATION_PAYMENT_MODE_LABELS[mapped]
  return '—'
}

export function reconciliationRequiresBookEntry(tab?: ReconciliationTab): boolean {
  return tab !== 'courier'
}

export const RECONCILIATION_BASE_PATH = '/admin/finance/reconciliation'

export const RECONCILIATION_LISTING_TABS: { value: ReconciliationTab; label: string }[] = [
  { value: 'approved_claim_sheet', label: 'Approved claim sheets' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'courier', label: 'Courier reports' },
  { value: 'mode_of_payment', label: 'Mode of payment' },
]

export const RECONCILIATION_PERIOD_OPTIONS: { value: ReconciliationPeriodPreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: '7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'mtd', label: 'MTD' },
  { value: 'qtd', label: 'QTD' },
  { value: 'ytd', label: 'YTD' },
  { value: 'custom', label: 'Custom' },
]

export function getReconciliationReferenceLabel(tab?: ReconciliationTab): string {
  if (tab === 'courier') return 'Reference'
  return 'Book entry number'
}

export function getReconciliationStatusLabel(status: 'pending' | 'submitted' | 'rejected'): string {
  switch (status) {
    case 'submitted':
      return 'Submitted'
    case 'rejected':
      return 'Rejected'
    default:
      return 'Pending'
  }
}

export function getReconciliationStatusBadgeColor(
  status: 'pending' | 'submitted' | 'rejected',
): 'success' | 'warning' | 'error' {
  switch (status) {
    case 'submitted':
      return 'success'
    case 'rejected':
      return 'error'
    default:
      return 'warning'
  }
}
