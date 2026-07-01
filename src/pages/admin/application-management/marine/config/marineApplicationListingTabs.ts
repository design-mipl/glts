import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'

export type MarineApplicationListingTab =
  | 'all'
  | 'draft'
  | 'verification_pending'
  | 'online_submission_pending'
  | 'vfs_submission_pending'
  | 'collection_pending'
  | 'collected'
  | 'dispatched'

export type MarineApplicationQueueTab = Exclude<MarineApplicationListingTab, 'all'>

export const MARINE_APPLICATION_LISTING_TABS: ReadonlyArray<{
  value: MarineApplicationListingTab
  label: string
}> = [
  { value: 'all', label: 'All applications' },
  { value: 'draft', label: 'Draft' },
  { value: 'verification_pending', label: 'Verification pending' },
  { value: 'online_submission_pending', label: 'Online submission pending' },
  { value: 'vfs_submission_pending', label: 'VFS submission pending' },
  { value: 'collection_pending', label: 'Collection pending' },
  { value: 'collected', label: 'Collected' },
  { value: 'dispatched', label: 'Dispatched' },
]

const VERIFICATION_PENDING_STATUSES = new Set([
  'Submitted',
  'Under Review',
  'Verification Pending',
  'Pending Documents',
  'Correction Required',
])

export function resolveMarineApplicationQueueTab(
  row: MarineApplicationRow,
): MarineApplicationQueueTab | null {
  if (row.operationalStatus === 'Draft') {
    return 'draft'
  }

  if (row.operationalStatus === 'Completed' || row.processingStage === 'Closed') {
    return 'dispatched'
  }

  if (row.processingStage === 'Passport dispatch' || row.operationalStatus === 'Passport Ready') {
    return 'collected'
  }

  if (row.processingStage === 'Embassy processing') {
    return 'collection_pending'
  }

  if (
    row.processingStage === 'Appointment Booked' ||
    row.operationalStatus === 'Appointment Booked'
  ) {
    return 'vfs_submission_pending'
  }

  if (row.processingStage === 'Embassy submission') {
    return 'online_submission_pending'
  }

  if (
    row.processingStage === 'Document verification' ||
    row.processingStage === 'Intake' ||
    VERIFICATION_PENDING_STATUSES.has(row.operationalStatus)
  ) {
    return 'verification_pending'
  }

  return null
}

export function isMarineApplicationInQueueTab(
  row: MarineApplicationRow,
  tab: MarineApplicationQueueTab,
): boolean {
  return resolveMarineApplicationQueueTab(row) === tab
}
