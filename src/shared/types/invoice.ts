export type BillingMode = 'application_wise' | 'company_wise'

export type ApplicationSelectionMode = 'single' | 'batch' | 'multiple'

export type InvoiceType =
  | 'single_invoice'
  | 'bulk_invoice'
  | 'cumulative'
  | 'additional_expense'
  | 'final_settlement'
  | 'credit_note'
  | 'debit_note'

export type InvoiceStatus =
  | 'draft'
  | 'submitted'
  | 'shared'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'failed' | 'adjusted'

export type LineItemBillingStatus = 'unbilled' | 'billed' | 'partial'

export interface InvoiceLineItem {
  id: string
  applicationId?: string
  batchId?: string
  applicantName?: string
  servicePresetId?: string
  serviceType: string
  description: string
  quantity: number
  unitPrice: number
  gstApplicable: boolean
  gstAmount: number
  amount: number
  included: boolean
  billingStatus: LineItemBillingStatus
  remarks?: string
  isAdditionalExpense: boolean
}

export interface InvoiceTaxConfig {
  gstApplicable: boolean
  gstPercentage: number
  tdsApplicable: boolean
  tdsPercentage: number
}

export interface InvoiceTotals {
  subtotal: number
  gstTotal: number
  tdsAmount: number
  additionalCharges: number
  finalAmount: number
  advanceAvailable: number
  advanceAdjusted: number
  creditApplied: number
  balancePayable: number
}

export interface InvoiceBillingAdjustmentSnapshot {
  billingType: 'credit' | 'advance' | 'mixed'
  creditLimit?: number
  creditUsed?: number
  creditAvailable?: number
  creditPeriodDays?: number
  advanceBalance?: number
  advanceUtilized?: number
  remainingAdvance?: number
  outstandingAmount?: number
}

export interface InvoiceActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface InvoiceAttachment {
  id: string
  name: string
  type: 'invoice_pdf' | 'signed_copy' | 'other'
  uploadedAt: string
}

export interface InvoicePaymentRecord {
  id: string
  date: string
  amount: number
  method: string
  reference: string
  status: PaymentStatus
  tdsPercentage?: number
  tdsAmount?: number
}

export interface Invoice {
  id: string
  invoiceId: string
  invoiceType: InvoiceType
  billingMode: BillingMode
  companyId: string
  companyName: string
  billingEntity: string
  vesselId?: string
  vesselName?: string
  agreementId?: string
  poReference?: string
  gltsReferences: string[]
  batchIds: string[]
  totalApplications: number
  country?: string
  visaType?: string
  lineItems: InvoiceLineItem[]
  taxConfig: InvoiceTaxConfig
  totals: InvoiceTotals
  billingAdjustment?: InvoiceBillingAdjustmentSnapshot
  invoiceStatus: InvoiceStatus
  paymentStatus: PaymentStatus
  invoiceDate: string
  dueDate: string
  paymentTerms?: string
  lastUpdated: string
  createdAt: string
  sourceInvoiceId?: string
  sharedAt?: string
  sharedToEmail?: string
  activities: InvoiceActivity[]
  attachments: InvoiceAttachment[]
  payments: InvoicePaymentRecord[]
}

export interface InvoiceBillingSelection {
  billingMode: BillingMode
  applicationSelectionMode: ApplicationSelectionMode
  invoiceType: InvoiceType
  companyId: string
  companyName: string
  billingEntity: string
  billingEntityOverride?: string
  vesselId?: string
  vesselName?: string
  applicationIds: string[]
  batchIds: string[]
  servicePresetIds: string[]
  billingPeriodFrom?: string
  billingPeriodTo?: string
  poReference?: string
}

export interface InvoiceWorkspaceState {
  selection: InvoiceBillingSelection
  lineItems: InvoiceLineItem[]
  taxConfig: InvoiceTaxConfig
  additionalCharges: number
  paymentTerms: string
  dueDate: string
  sourceInvoiceId?: string
  draftInvoiceId?: string
  agreementId?: string
}

export interface InvoiceListFilters {
  company?: string
  billingEntity?: string
  vessel?: string
  billingMode?: BillingMode | 'all'
  applicationId?: string
  batchId?: string
  invoiceType?: InvoiceType | 'all'
  invoiceStatus?: InvoiceStatus | 'all'
  paymentStatus?: PaymentStatus | 'all'
  country?: string
  visaType?: string
  dateFrom?: string
  dateTo?: string
  query?: string
}

export interface ShareInvoicePayload {
  email: string
  paymentTerms: string
  dueDate: string
  message?: string
}

export interface RecordPaymentPayload {
  amount: number
  date: string
  method: string
  reference: string
  tdsPercentage?: number
  tdsAmount?: number
}

export interface CreditNoteAdjustment {
  mode: 'partial' | 'full'
  lineItemIds?: string[]
  reason: string
}

export interface BillingReportFilters {
  company?: string
  dateFrom?: string
  dateTo?: string
  invoiceType?: InvoiceType | 'all'
}

export interface BillingReportSummaryRow {
  companyName: string
  billingEntity: string
  invoiceCount: number
  totalBilled: number
  totalCollected: number
  outstanding: number
}

export interface BillingReportData {
  totalBilled: number
  totalCollected: number
  outstanding: number
  overdueCount: number
  rows: BillingReportSummaryRow[]
}

export const EMPTY_INVOICE_BILLING_SELECTION: InvoiceBillingSelection = {
  billingMode: 'application_wise',
  applicationSelectionMode: 'single',
  invoiceType: 'single_invoice',
  companyId: '',
  companyName: '',
  billingEntity: '',
  applicationIds: [],
  batchIds: [],
  servicePresetIds: [],
}
