import type { CustomerTone } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { ApplicationOperationalStatus } from '../../types/applicationListing.types'

export const APPLICATION_OPERATIONAL_STATUSES: ApplicationOperationalStatus[] = [
  'Draft',
  'Pending Documents',
  'Under Review',
  'Verification Pending',
  'Correction Required',
  'Submitted',
  'Passport Ready',
  'Completed',
  'Rejected',
]

export const PROCESSING_STAGE_OPTIONS = [
  { value: '', label: 'All stages' },
  { value: 'Intake', label: 'Intake' },
  { value: 'Document verification', label: 'Document verification' },
  { value: 'Embassy submission', label: 'Embassy submission' },
  { value: 'Embassy processing', label: 'Embassy processing' },
  { value: 'Passport dispatch', label: 'Passport dispatch' },
  { value: 'Closed', label: 'Closed' },
]

export function getApplicationOperationalTone(status: ApplicationOperationalStatus | string): CustomerTone {
  switch (status) {
    case 'Completed':
    case 'Passport Ready':
      return 'success'
    case 'Draft':
      return 'neutral'
    case 'Pending Documents':
    case 'Correction Required':
      return 'warning'
    case 'Rejected':
      return 'critical'
    case 'Under Review':
    case 'Verification Pending':
    case 'Submitted':
      return 'info'
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
  if (status === 'Pending Documents' || status === 'Correction Required') return 'pending'
  if (status === 'Under Review' || status === 'Verification Pending' || status === 'Submitted') return 'review'
  return 'processing'
}
