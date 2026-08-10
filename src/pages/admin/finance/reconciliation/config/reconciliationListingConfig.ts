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

export function getReconciliationReferenceLabel(tab: ReconciliationTab): string {
  switch (tab) {
    case 'insurance':
      return 'Policy number'
    case 'ticket':
      return 'Ticket booking reference'
    case 'courier':
      return 'Tracking no (AWB)'
    case 'mode_of_payment':
      return 'AC Entry No'
    case 'approved_claim_sheet':
      return 'Settlement reference'
    default:
      return 'Reference number'
  }
}

export function getReconciliationStatusLabel(status: 'pending' | 'submitted'): string {
  return status === 'submitted' ? 'Submitted' : 'Pending'
}
