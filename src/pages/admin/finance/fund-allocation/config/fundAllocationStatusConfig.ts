import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { getApplicationCustomerSegmentLabel } from '@/shared/config/applicationCustomerSegmentConfig'
import type { FundAllocationStatus } from '@/shared/types/fundAllocation'

export const FUND_ALLOCATION_STATUS_LABELS: Record<FundAllocationStatus, string> = {
  pending_allocation: 'Pending allocation',
  allocated: 'Allocated',
}

export function fundAllocationStatusLabel(status: FundAllocationStatus): string {
  return FUND_ALLOCATION_STATUS_LABELS[status]
}

export function fundAllocationStatusBadgeColor(
  status: FundAllocationStatus,
): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'allocated') return 'success'
  return 'warning'
}

export function customerSegmentBadgeColor(
  segment: ApplicationCustomerSegment,
): 'success' | 'warning' | 'info' | 'neutral' {
  switch (segment) {
    case 'marine':
      return 'info'
    case 'corporate':
      return 'neutral'
    case 'b2bAgents':
      return 'warning'
    case 'retail':
    default:
      return 'success'
  }
}

export function customerSegmentDisplayLabel(segment: ApplicationCustomerSegment): string {
  return getApplicationCustomerSegmentLabel(segment)
}
