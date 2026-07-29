import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
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

export function resolveMarineWorkspaceMode(row: MarineApplicationRow): MarineWorkspaceMode {
  const tab = resolveMarineApplicationQueueTab(row)
  if (!tab || tab === 'draft') {
    return 'verification'
  }
  if (tab === 'verification_pending') {
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

export function isMarineReadOnlyWorkspace(row: MarineApplicationRow): boolean {
  return resolveMarineWorkspaceMode(row) === 'readonly'
}

export function isMarinePendingPaymentWorkspace(row: MarineApplicationRow): boolean {
  return resolveMarineWorkspaceMode(row) === 'pending_payment'
}

/** Listing should open view-form directly (skip verify) for these modes. */
export function opensMarineViewFormDirectly(row: MarineApplicationRow): boolean {
  const mode = resolveMarineWorkspaceMode(row)
  return mode === 'readonly' || mode === 'pending_payment'
}
