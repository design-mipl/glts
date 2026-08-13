import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isMarineApplicationInQueueTab,
  resolveMarineApplicationQueueTab,
  type MarineApplicationQueueTab,
} from './marineApplicationListingTabs'

export type MarineWorkspaceMode =
  | 'verification'
  | 'online_submission'
  | 'pending_payment'
  | 'readonly'

const READONLY_QUEUE_TABS = new Set<MarineApplicationQueueTab>([
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
])

function parseQueueTabFromListingHref(fromListing?: string): MarineApplicationQueueTab | null {
  if (!fromListing?.includes('?')) return null
  const query = fromListing.slice(fromListing.indexOf('?') + 1)
  const tab = new URLSearchParams(query).get('tab')
  if (!tab || tab === 'all') return null
  return tab as MarineApplicationQueueTab
}

export function resolveMarineWorkspaceMode(
  row: MarineApplicationRow,
  fromListing?: string,
): MarineWorkspaceMode {
  const preferred = parseQueueTabFromListingHref(fromListing)
  const tab =
    preferred && isMarineApplicationInQueueTab(row, preferred)
      ? preferred
      : resolveMarineApplicationQueueTab(row)

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

export function isMarineReadOnlyWorkspace(row: MarineApplicationRow, fromListing?: string): boolean {
  return resolveMarineWorkspaceMode(row, fromListing) === 'readonly'
}

export function isMarinePendingPaymentWorkspace(
  row: MarineApplicationRow,
  fromListing?: string,
): boolean {
  return resolveMarineWorkspaceMode(row, fromListing) === 'pending_payment'
}

/** Listing should open view-form directly (skip verify) for these modes. */
export function opensMarineViewFormDirectly(
  row: MarineApplicationRow,
  fromListing?: string,
): boolean {
  const tab = resolveMarineApplicationQueueTab(row)
  if (tab === 'draft') return false
  const preferred = parseQueueTabFromListingHref(fromListing)
  if (preferred === 'pending_payment' && isMarineApplicationInQueueTab(row, 'pending_payment')) {
    return true
  }
  const mode = resolveMarineWorkspaceMode(row, fromListing)
  return mode === 'readonly' || mode === 'pending_payment'
}
