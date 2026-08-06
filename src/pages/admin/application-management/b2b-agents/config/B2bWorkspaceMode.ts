import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
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

export function resolveB2bWorkspaceMode(row: B2bApplicationRow): B2bWorkspaceMode {
  const tab = resolveB2bApplicationQueueTab(row)
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

export function isB2bReadOnlyWorkspace(row: B2bApplicationRow): boolean {
  return resolveB2bWorkspaceMode(row) === 'readonly'
}

export function isB2bPendingPaymentWorkspace(row: B2bApplicationRow): boolean {
  return resolveB2bWorkspaceMode(row) === 'pending_payment'
}

/** Listing should open view-form directly (skip verify) for these modes. */
export function opensB2bViewFormDirectly(row: B2bApplicationRow): boolean {
  const tab = resolveB2bApplicationQueueTab(row)
  if (tab === 'draft') return false
  const mode = resolveB2bWorkspaceMode(row)
  return mode === 'readonly' || mode === 'pending_payment'
}
