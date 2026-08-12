import type { ReconciliationPeriodPreset, ReconciliationTab } from '@/shared/types/reconciliation'

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

export function getReconciliationReferenceLabel(_tab?: ReconciliationTab): string {
  return 'Book entry number'
}

export function getReconciliationStatusLabel(status: 'pending' | 'submitted'): string {
  return status === 'submitted' ? 'Submitted' : 'Pending'
}
