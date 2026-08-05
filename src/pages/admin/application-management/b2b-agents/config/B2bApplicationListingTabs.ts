import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { isApplicationVfsSubmissionPending } from '@/shared/utils/applicationProcessingQueueUtils'

export type B2bApplicationListingTab =
  | 'all'
  | 'draft'
  | 'verification_pending'
  | 'online_submission_pending'
  | 'pending_payment'
  | 'vfs_submission_pending'
  | 'collection_pending'
  | 'collected'
  | 'dispatched'

export type B2bApplicationQueueTab = Exclude<B2bApplicationListingTab, 'all'>

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

const VERIFICATION_PENDING_STATUSES = new Set([
  'Submitted',
  'Under Review',
  'Verification Pending',
  'Document Rejected',
  'Pending Documents',
  'Correction Required',
])

export function resolveB2bApplicationQueueTab(
  row: B2bApplicationRow,
): B2bApplicationQueueTab | null {
  if (row.operationalStatus === 'Draft') {
    return 'draft'
  }

  if (row.operationalStatus === 'Completed' || row.processingStage === 'Delivered') {
    return 'dispatched'
  }

  if (row.processingStage === 'Dispatch' || row.operationalStatus === 'Passport Ready') {
    return 'collected'
  }

  if (row.processingStage === 'Embassy processing') {
    return 'collection_pending'
  }

  if (isApplicationVfsSubmissionPending(row)) {
    return 'vfs_submission_pending'
  }

  if (row.processingStage === 'Payment pending') {
    return 'pending_payment'
  }

  if (row.processingStage === 'Submitted') {
    return 'online_submission_pending'
  }

  if (
    row.processingStage === 'Ready for submission' ||
    VERIFICATION_PENDING_STATUSES.has(row.operationalStatus)
  ) {
    return 'verification_pending'
  }

  return null
}

export function isB2bApplicationInQueueTab(
  row: B2bApplicationRow,
  tab: B2bApplicationQueueTab,
): boolean {
  return resolveB2bApplicationQueueTab(row) === tab
}
