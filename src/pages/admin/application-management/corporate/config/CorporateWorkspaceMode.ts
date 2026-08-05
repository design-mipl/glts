import type { MarineApplicationRow as CorporateApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  resolveCorporateApplicationQueueTab,
  type CorporateApplicationQueueTab,
} from './CorporateApplicationListingTabs'

export type CorporateWorkspaceMode =
  | 'verification'
  | 'online_submission'
  | 'pending_payment'
  | 'readonly'

const READONLY_QUEUE_TABS = new Set<CorporateApplicationQueueTab>([
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
])

export function resolveCorporateWorkspaceMode(row: CorporateApplicationRow): CorporateWorkspaceMode {
  const tab = resolveCorporateApplicationQueueTab(row)
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

export function isCorporateReadOnlyWorkspace(row: CorporateApplicationRow): boolean {
  return resolveCorporateWorkspaceMode(row) === 'readonly'
}

export function isCorporatePendingPaymentWorkspace(row: CorporateApplicationRow): boolean {
  return resolveCorporateWorkspaceMode(row) === 'pending_payment'
}

/** Listing should open view-form directly (skip verify) for these modes. */
export function opensCorporateViewFormDirectly(row: CorporateApplicationRow): boolean {
  const mode = resolveCorporateWorkspaceMode(row)
  return mode === 'readonly' || mode === 'pending_payment'
}
