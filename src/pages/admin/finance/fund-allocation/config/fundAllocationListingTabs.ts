import type { FundAllocationListingTab } from '@/shared/types/fundAllocation'

export const FUND_ALLOCATION_LISTING_TABS: ReadonlyArray<{
  value: FundAllocationListingTab
  label: string
}> = [
  { value: 'pending_allocation', label: 'Pending allocation' },
  { value: 'allocated', label: 'Allocated' },
  { value: 'claim_sheets', label: 'Claim sheets' },
]

export const FUND_ALLOCATION_BASE_PATH = '/admin/finance/fund-allocation'
