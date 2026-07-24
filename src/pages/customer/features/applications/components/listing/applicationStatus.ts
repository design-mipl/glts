import type { CustomerTone } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  APPLICATION_PROCESSING_STAGE_LABELS,
  APPLICATION_PROCESSING_STAGE_ORDER,
} from '@/shared/types/applicationProcessingTimeline'
import type { ApplicationOperationalStatus } from '../../types/applicationListing.types'

export const APPLICATION_OPERATIONAL_STATUSES: ApplicationOperationalStatus[] = [
  'Draft',
  'Pending Documents',
  'Under Review',
  'Verification Pending',
  'Correction Required',
  'Submitted',
  'Appointment Booked',
  'Passport Ready',
  'Completed',
  'Rejected',
]

export const PROCESSING_STAGE_OPTIONS = [
  { value: '', label: 'All stages' },
  ...APPLICATION_PROCESSING_STAGE_ORDER.map(id => ({
    value: APPLICATION_PROCESSING_STAGE_LABELS[id],
    label: APPLICATION_PROCESSING_STAGE_LABELS[id],
  })),
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
    case 'Appointment Booked':
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
  if (status === 'Under Review' || status === 'Verification Pending' || status === 'Submitted' || status === 'Appointment Booked') return 'review'
  return 'processing'
}
