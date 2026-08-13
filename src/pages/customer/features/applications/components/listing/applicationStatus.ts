import type { CustomerTone } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  APPLICATION_PROCESSING_STAGE_LABELS,
  APPLICATION_PROCESSING_STAGE_ORDER,
} from '@/shared/types/applicationProcessingTimeline'
import type { ApplicationOperationalStatus } from '../../types/applicationListing.types'

/** DS Badge colors used by Application Management Status column. */
export type ApplicationOperationalBadgeColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

export const APPLICATION_OPERATIONAL_STATUSES: ApplicationOperationalStatus[] = [
  'Draft',
  'Pending Documents',
  'Under Review',
  'Verification Pending',
  'Document Rejected',
  'Correction Required',
  'Ops · Correction Required',
  'Ops · Document Missing',
  'Docs · Correction Required',
  'Docs · Document Missing / Blocked',
  'Submission Pending',
  'Form Pending',
  'Pending Payment',
  'Embassy/VFS Submission Pending',
  'Submitted',
  'Appointment Booked',
  'Passport Ready',
  'Completed',
  'Rejected',
  'On Hold',
]

export const PROCESSING_STAGE_OPTIONS = [
  { value: '', label: 'All stages' },
  ...APPLICATION_PROCESSING_STAGE_ORDER.map(id => ({
    value: APPLICATION_PROCESSING_STAGE_LABELS[id],
    label: APPLICATION_PROCESSING_STAGE_LABELS[id],
  })),
]

/**
 * Standard Status badge colors for Application Management listings.
 *
 * Semantic groups:
 * - neutral — draft / idle
 * - info — waiting Ops review / in review
 * - primary — Docs submission queue / embassy handoff
 * - secondary — form work in progress
 * - warning — correction / payment attention
 * - error — missing / blocked / hard reject
 * - success — ready / completed
 */
export function getApplicationOperationalBadgeColor(
  status: ApplicationOperationalStatus | string,
): ApplicationOperationalBadgeColor {
  switch (status) {
    case 'Draft':
      return 'neutral'

    case 'Verification Pending':
    case 'Under Review':
    case 'Submitted':
    case 'Appointment Booked':
      return 'info'

    case 'Submission Pending':
    case 'Embassy/VFS Submission Pending':
      return 'primary'

    case 'Form Pending':
      return 'secondary'

    case 'Pending Documents':
    case 'Pending Payment':
    case 'On Hold':
    case 'Correction Required':
    case 'Ops · Correction Required':
    case 'Docs · Correction Required':
      return 'warning'

    case 'Document Rejected':
    case 'Ops · Document Missing':
    case 'Docs · Document Missing / Blocked':
    case 'Rejected':
      return 'error'

    case 'Passport Ready':
    case 'Completed':
      return 'success'

    default:
      return 'neutral'
  }
}

export function getApplicationOperationalTone(status: ApplicationOperationalStatus | string): CustomerTone {
  const badge = getApplicationOperationalBadgeColor(status)
  switch (badge) {
    case 'success':
      return 'success'
    case 'error':
      return 'critical'
    case 'warning':
      return 'warning'
    case 'info':
    case 'primary':
    case 'secondary':
      return 'info'
    case 'neutral':
    default:
      return 'neutral'
  }
}

export function getApplicationTypeLabel(recordType: 'single' | 'bulk'): string {
  return recordType === 'bulk' ? 'Bulk' : 'Single'
}

export function getApplicationTypeTone(recordType: 'single' | 'bulk'): CustomerTone {
  return recordType === 'bulk' ? 'info' : 'neutral'
}

export function statusToneFromOperational(
  status: ApplicationOperationalStatus,
): 'review' | 'pending' | 'approved' | 'draft' | 'processing' {
  if (status === 'Draft') return 'draft'
  if (status === 'Completed' || status === 'Passport Ready') return 'approved'
  if (
    status === 'Pending Documents' ||
    status === 'Document Rejected' ||
    status === 'Correction Required' ||
    status === 'Ops · Correction Required' ||
    status === 'Ops · Document Missing' ||
    status === 'Docs · Correction Required' ||
    status === 'Docs · Document Missing / Blocked' ||
    status === 'On Hold' ||
    status === 'Pending Payment'
  ) {
    return 'pending'
  }
  if (
    status === 'Under Review' ||
    status === 'Verification Pending' ||
    status === 'Submitted' ||
    status === 'Submission Pending' ||
    status === 'Form Pending' ||
    status === 'Embassy/VFS Submission Pending' ||
    status === 'Appointment Booked'
  ) {
    return 'review'
  }
  return 'processing'
}
