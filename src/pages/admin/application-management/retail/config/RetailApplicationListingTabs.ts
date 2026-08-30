import type { MarineApplicationRow as RetailApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isApplicationInManagementQueueTab,
  resolveApplicationManagementPrimaryQueue,
  type ApplicationManagementQueueTab,
} from '@/shared/utils/applicationQueueStatus'

export type RetailApplicationListingTab =
  | 'all'
  | ApplicationManagementQueueTab

export type RetailApplicationQueueTab = ApplicationManagementQueueTab

export const RETAIL_APPLICATION_LISTING_TABS: ReadonlyArray<{
  value: RetailApplicationListingTab
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

export function resolveRetailApplicationQueueTab(
  row: RetailApplicationRow,
): RetailApplicationQueueTab | null {
  return resolveApplicationManagementPrimaryQueue(row)
}

export function isRetailApplicationInQueueTab(
  row: RetailApplicationRow,
  tab: RetailApplicationQueueTab,
): boolean {
  return isApplicationInManagementQueueTab(row, tab)
}
