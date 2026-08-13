import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isB2bApplicationInQueueTab,
  resolveB2bApplicationQueueTab,
  type B2bApplicationQueueTab,
} from './B2bApplicationListingTabs'

export type B2bWorkspaceMode =
  | 'verification'
  | 'online_submission'
  | 'pending_payment'
  | 'readonly'

const READONLY_QUEUE_TABS = new Set<B2bApplicationQueueTab>([
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
])

function parseQueueTabFromListingHref(fromListing?: string): B2bApplicationQueueTab | null {
  if (!fromListing?.includes('?')) return null
  const query = fromListing.slice(fromListing.indexOf('?') + 1)
  const tab = new URLSearchParams(query).get('tab')
  if (!tab || tab === 'all') return null
  return tab as B2bApplicationQueueTab
}

export function resolveB2bWorkspaceMode(
  row: B2bApplicationRow,
  fromListing?: string,
): B2bWorkspaceMode {
  const preferred = parseQueueTabFromListingHref(fromListing)
  const tab =
    preferred && isB2bApplicationInQueueTab(row, preferred)
      ? preferred
      : resolveB2bApplicationQueueTab(row)

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

export function isB2bReadOnlyWorkspace(row: B2bApplicationRow, fromListing?: string): boolean {
  return resolveB2bWorkspaceMode(row, fromListing) === 'readonly'
}

export function isB2bPendingPaymentWorkspace(
  row: B2bApplicationRow,
  fromListing?: string,
): boolean {
  return resolveB2bWorkspaceMode(row, fromListing) === 'pending_payment'
}

/** Listing should open view-form directly (skip verify) for these modes. */
export function opensB2bViewFormDirectly(
  row: B2bApplicationRow,
  fromListing?: string,
): boolean {
  const tab = resolveB2bApplicationQueueTab(row)
  if (tab === 'draft') return false
  const preferred = parseQueueTabFromListingHref(fromListing)
  if (preferred === 'pending_payment' && isB2bApplicationInQueueTab(row, 'pending_payment')) {
    return true
  }
  const mode = resolveB2bWorkspaceMode(row, fromListing)
  return mode === 'readonly' || mode === 'pending_payment'
}
