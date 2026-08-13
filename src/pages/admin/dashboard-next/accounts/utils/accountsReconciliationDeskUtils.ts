import type { AccountsDashboardData, AccountsReconciliationRow } from '../types'
import { getAccountsWorkloadCounts } from './accountsWorkloadUtils'

export type ReconciliationDeskTabId =
  | 'insurance'
  | 'ticket'
  | 'courier'
  | 'cards'
  | 'claim_sheets'

function isPendingReconciliationStatus(status: string): boolean {
  return !status.toLowerCase().includes('matched')
}

function matchesReconDeskTab(category: string, tab: Exclude<ReconciliationDeskTabId, 'claim_sheets'>): boolean {
  const normalized = category.toLowerCase()
  switch (tab) {
    case 'insurance':
      return normalized.includes('insurance')
    case 'ticket':
      return normalized.includes('ticketing') || normalized.includes('ticket')
    case 'courier':
      return normalized.includes('courier')
    case 'cards':
      return normalized.includes('credit card')
    default:
      return false
  }
}

export function filterPendingReconciliationRows(
  rows: AccountsReconciliationRow[],
  tab: Exclude<ReconciliationDeskTabId, 'claim_sheets'>,
): AccountsReconciliationRow[] {
  return rows.filter(
    (row) => isPendingReconciliationStatus(row.status) && matchesReconDeskTab(row.category, tab),
  )
}

export function countReconciliationDeskRows(
  data: AccountsDashboardData,
  tab: ReconciliationDeskTabId,
): number {
  if (tab === 'claim_sheets') {
    return data.claimSheetRows.filter((row) => row.status === 'Approved').length
  }
  return filterPendingReconciliationRows(data.reconciliationRows, tab).length
}

export function countReconciliationWorkBadge(data: AccountsDashboardData): number {
  const counts = getAccountsWorkloadCounts(data)
  return counts.pendingReconciliations + counts.pendingClaimRecon
}

export function reconciliationModuleTabHref(tab: ReconciliationDeskTabId): string {
  const queryTab =
    tab === 'claim_sheets'
      ? 'approved_claim_sheet'
      : tab === 'cards'
        ? 'mode_of_payment'
        : tab
  return `/admin/finance/reconciliation?tab=${queryTab}`
}
