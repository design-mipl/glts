import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isApplicationInManagementQueueTab,
  resolveApplicationManagementPrimaryQueue,
  type ApplicationManagementQueueTab,
} from '@/shared/utils/applicationQueueStatus'

export type B2bApplicationListingTab =
  | 'all'
  | ApplicationManagementQueueTab

export type B2bApplicationQueueTab = ApplicationManagementQueueTab

export const B2B_APPLICATION_LISTING_TABS: ReadonlyArray<{
  value: B2bApplicationListingTab
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

export function resolveB2bApplicationQueueTab(
  row: B2bApplicationRow,
): B2bApplicationQueueTab | null {
  return resolveApplicationManagementPrimaryQueue(row)
}

export function isB2bApplicationInQueueTab(
  row: B2bApplicationRow,
  tab: B2bApplicationQueueTab,
): boolean {
  return isApplicationInManagementQueueTab(row, tab)
}
