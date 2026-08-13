import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isApplicationInManagementQueueTab,
  resolveApplicationManagementPrimaryQueue,
  type ApplicationManagementQueueTab,
} from '@/shared/utils/applicationQueueStatus'

export type MarineApplicationListingTab =
  | 'all'
  | ApplicationManagementQueueTab

export type MarineApplicationQueueTab = ApplicationManagementQueueTab

export const MARINE_APPLICATION_LISTING_TABS: ReadonlyArray<{
  value: MarineApplicationListingTab
  label: string
}> = [
  { value: 'all', label: 'All applications' },
  { value: 'draft', label: 'Draft' },
  { value: 'verification_pending', label: 'Verification Pending' },
  { value: 'online_submission_pending', label: 'Submission Pending' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'vfs_submission_pending', label: 'Embassy/VFS Submission Pending' },
  { value: 'collection_pending', label: 'Collection Pending' },
  { value: 'collected', label: 'Collected' },
  { value: 'dispatched', label: 'Dispatched' },
]

export function resolveMarineApplicationQueueTab(
  row: MarineApplicationRow,
): MarineApplicationQueueTab | null {
  return resolveApplicationManagementPrimaryQueue(row)
}

export function isMarineApplicationInQueueTab(
  row: MarineApplicationRow,
  tab: MarineApplicationQueueTab,
): boolean {
  return isApplicationInManagementQueueTab(row, tab)
}
