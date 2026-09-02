import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { ApplicationExpenseFinanceStatus } from '@/shared/types/applicationExpenseManagement'

export type ExpenseListingTab = ApplicationCustomerSegment

export type ExpenseFinanceStatusTab = ApplicationExpenseFinanceStatus

export const EXPENSE_LISTING_TABS: { value: ExpenseListingTab; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'retail', label: 'Retail' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'b2bAgents', label: 'B2B Agents' },
]

export const EXPENSE_FINANCE_STATUS_TABS: { value: ExpenseFinanceStatusTab; label: string }[] = [
  { value: 'needs_update', label: 'Needs update' },
  { value: 'paid', label: 'Paid' },
  { value: 'reconciled', label: 'Reconciled' },
]

export const EXPENSE_LISTING_BASE_PATH = '/admin/finance/expenses'
