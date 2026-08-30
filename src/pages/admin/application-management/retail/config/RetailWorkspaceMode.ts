import type { MarineApplicationRow as RetailApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isRetailApplicationInQueueTab,
  resolveRetailApplicationQueueTab,
  type RetailApplicationQueueTab,
} from './RetailApplicationListingTabs'

export type RetailWorkspaceMode =
  | 'verification'
  | 'online_submission'
  | 'pending_payment'
  | 'readonly'

const READONLY_QUEUE_TABS = new Set<RetailApplicationQueueTab>([
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
])

function parseQueueTabFromListingHref(fromListing?: string): RetailApplicationQueueTab | null {
  if (!fromListing?.includes('?')) return null
  const query = fromListing.slice(fromListing.indexOf('?') + 1)
  const tab = new URLSearchParams(query).get('tab')
  if (!tab || tab === 'all') return null
  return tab as RetailApplicationQueueTab
}

export function resolveRetailWorkspaceMode(
  row: RetailApplicationRow,
  fromListing?: string,
): RetailWorkspaceMode {
  const preferred = parseQueueTabFromListingHref(fromListing)
  const tab =
    preferred && isRetailApplicationInQueueTab(row, preferred)
      ? preferred
      : resolveRetailApplicationQueueTab(row)

  if (tab === 'draft') {
    return 'readonly'
  }
  if (!tab || tab === 'verification_pending') {
    return 'verification'
  }
  if (tab === 'pending_payment') {
    return 'pending_payment'
  }
  if (tab === 'online_submission_pending') {
    return 'online_submission'
  }
  if (READONLY_QUEUE_TABS.has(tab)) {
    return 'readonly'
  }
  return 'verification'
}

export function isRetailReadOnlyWorkspace(row: RetailApplicationRow, fromListing?: string): boolean {
  return resolveRetailWorkspaceMode(row, fromListing) === 'readonly'
}

export function isRetailPendingPaymentWorkspace(
  row: RetailApplicationRow,
  fromListing?: string,
): boolean {
  return resolveRetailWorkspaceMode(row, fromListing) === 'pending_payment'
}

/** Listing should open view-form directly (skip verify) for these modes. */
export function opensRetailViewFormDirectly(
  row: RetailApplicationRow,
  fromListing?: string,
): boolean {
  const tab = resolveRetailApplicationQueueTab(row)
  if (tab === 'draft') return false
  const preferred = parseQueueTabFromListingHref(fromListing)
  if (preferred === 'pending_payment' && isRetailApplicationInQueueTab(row, 'pending_payment')) {
    return true
  }
  const mode = resolveRetailWorkspaceMode(row, fromListing)
  return mode === 'readonly' || mode === 'pending_payment'
}
