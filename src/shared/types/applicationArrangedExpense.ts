export type ApplicationArrangedExpenseCategory = 'travel_ticket' | 'travel_insurance'

export type ApplicationExpenseBillingStatus = 'unbilled' | 'billed'

export type ApplicationExpenseSource = 'glts_document_arrangement'

export interface ApplicationArrangedExpense {
  id: string
  applicationId: string
  batchId?: string
  applicantId: string
  travelerRowId: string
  applicantName: string
  companyName?: string
  documentId: 'travel-ticket' | 'insurance'
  category: ApplicationArrangedExpenseCategory
  categoryLabel: string
  amount: number
  vendorId: string
  vendorName: string
  documentFileName?: string
  source: ApplicationExpenseSource
  billingStatus: ApplicationExpenseBillingStatus
  invoiceId?: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationArrangedExpenseListFilters {
  applicationId?: string
  batchId?: string
  applicantId?: string
  category?: ApplicationArrangedExpenseCategory | 'all'
  billingStatus?: ApplicationExpenseBillingStatus | 'all'
  vendorId?: string
  query?: string
}
