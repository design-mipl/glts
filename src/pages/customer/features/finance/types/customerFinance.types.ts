import type { Invoice, InvoicePaymentRecord } from '@/shared/types/invoice'

export interface CustomerPaymentRow {
  id: string
  paymentDate: string
  receiptNumber: string
  invoiceId: string
  invoiceNumber: string
  amount: number
  paymentMode: string
  transactionReference: string
  status: string
  verificationStatus: string
  invoice: Invoice
  payment: InvoicePaymentRecord
}

export interface FinanceOverviewMetrics {
  totalInvoiced: number
  totalPaid: number
  outstanding: number
  overdue: number
  upcomingDue: number
}

export interface FinanceOverviewData {
  metrics: FinanceOverviewMetrics
  recentInvoices: Invoice[]
  recentPayments: CustomerPaymentRow[]
  quickOutstanding: Invoice[]
}

export interface OutstandingInvoiceRow {
  invoice: Invoice
  outstandingAmount: number
  daysOutstanding: number
  isOverdue: boolean
}

export interface StatementOfAccount {
  periodLabel: string
  openingBalance: number
  invoicesRaised: number
  paymentsReceived: number
  creditNotes: number
  closingBalance: number
  lineItems: StatementLineItem[]
}

export interface StatementLineItem {
  id: string
  date: string
  type: 'opening' | 'invoice' | 'payment' | 'credit_note' | 'closing'
  reference: string
  description: string
  debit: number
  credit: number
  balance: number
}

export interface AgingBucket {
  label: string
  range: string
  amount: number
  invoiceCount: number
}

export interface InvoiceLinkedApplicationRow {
  applicationId: string
  applicationType: 'single' | 'bulk'
  bookerName: string
  passengerCrewCount: number
  country: string
  visaType: string
  amount: number
}

export interface InvoiceListingRow {
  id: string
  invoice: Invoice
  linkedApplicationsCount: number
  bookers: string[]
  passengerCrewCount: number
  paidAmount: number
  outstandingAmount: number
}

export interface CustomerBillingInfo {
  companyName: string
  billingContact: string
  billingEmail: string
  gstNumber: string
}
