import type { MarineApplicationRow as CorporateApplicationRow } from '@/shared/services/marineApplicationAdminService'
import {
  isApplicationInManagementQueueTab,
  resolveApplicationManagementPrimaryQueue,
  type ApplicationManagementQueueTab,
} from '@/shared/utils/applicationQueueStatus'

export type CorporateApplicationListingTab =
  | 'all'
  | ApplicationManagementQueueTab

export type CorporateApplicationQueueTab = ApplicationManagementQueueTab

export const CORPORATE_APPLICATION_LISTING_TABS: ReadonlyArray<{
  value: CorporateApplicationListingTab
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

export function resolveCorporateApplicationQueueTab(
  row: CorporateApplicationRow,
): CorporateApplicationQueueTab | null {
  return resolveApplicationManagementPrimaryQueue(row)
}

export function isCorporateApplicationInQueueTab(
  row: CorporateApplicationRow,
  tab: CorporateApplicationQueueTab,
): boolean {
  return isApplicationInManagementQueueTab(row, tab)
}
