import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'

export type ExpenseListingTab = ApplicationCustomerSegment

export const EXPENSE_LISTING_TABS: { value: ExpenseListingTab; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'retail', label: 'Retail' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'b2bAgents', label: 'B2B Agents' },
]

export const EXPENSE_LISTING_BASE_PATH = '/admin/finance/expenses'
