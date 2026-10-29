import type { InvoiceRefundAppliedVia, InvoiceRefundBillingStatus } from '@/shared/types/invoice'

/** Invoice composition service categories (aligned with agreement / quotation). */
export type InvoiceServiceLineCategory =
  | 'glts_processing'
  | 'miscellaneous_dispatch'
  | 'vfs'

/** Client-billable service line seeded from Expense Management; Cost / Total editable on invoice. */
export interface InvoiceBillableServiceLine {
  id: string
  expenseRecordId: string
  serviceLabel: string
  /**
   * Vendor / actual outlay (Cost).
   * IW is display-only: Total − Cost.
   */
  costAmount: number
  /**
   * Client quote / billable total before GST (Total Amount).
   * Original / application service amount on generate.
   */
  amount: number
  /**
   * Credit note: amount to credit (editable when selected).
   * Revised invoice: reference from the credit note (read-only).
   */
  creditAmount?: number
  /**
   * Revised invoice: final billable amount (editable).
   * Seeded from current application services.
   */
  updatedAmount?: number
  /** Credit note: whether this line is included in the credit. */
  selected?: boolean
  remark: string
  /** Whether GST applies to this service (from agreement / expense / VFS rate). */
  gstApplicable: boolean
  /** Drives always-vs-selected rules and composition grouping. */
  category: InvoiceServiceLineCategory
}

/** Composition UI / totals mode. */
export type InvoiceCompositionMode = 'generate' | 'credit_note' | 'revised'

/** Passenger-level consulate refund from Ground Ops shown on composition. */
export interface InvoiceConsulateRefundLine {
  id: string
  caseId: string
  operationalId: string
  applicationId: string
  passengerName: string
  passportNumber: string
  vendorName: string
  amount: number
  remarks: string
  recordedAt?: string
  recordedBy?: string
  status: InvoiceRefundBillingStatus
  /** Include this refund as a reduction (or credit) on the current document. */
  included: boolean
  /** Close the refund without a refund line — amounts already absorbed in services. */
  managed: boolean
  appliedVia?: InvoiceRefundAppliedVia
  appliedDocumentId?: string
  appliedDocumentNumber?: string
}

export interface ApplicantFeeBundle {
  applicantId: string
  applicantName: string
  passportNumber: string
  country: string
  visaType: string
  serviceLines: InvoiceBillableServiceLine[]
  consulateRefunds?: InvoiceConsulateRefundLine[]
}

export interface SingleApplicationFeeCard {
  applicationId: string
  applicationName: string
  companyName: string
  country: string
  visaType: string
  billingEntity: string
  vessel: string
  applicantName: string
  serviceLines: InvoiceBillableServiceLine[]
  consulateRefunds?: InvoiceConsulateRefundLine[]
}

export interface BulkApplicationFeeCard {
  batchId: string
  applicationName: string
  companyName: string
  country: string
  visaType: string
  billingEntity: string
  vessel: string
  totalApplicants: number
  expanded: boolean
  applicants: ApplicantFeeBundle[]
}

export interface InvoiceFeeCompositionState {
  invoiceType: 'cumulative'
  companyId: string
  companyName: string
  billingEntity: string
  /** Document date (invoice date or credit note date), YYYY-MM-DD. */
  documentDate: string
  vesselId?: string
  vesselName?: string
  agreementId?: string
  singles: SingleApplicationFeeCard[]
  bulks: BulkApplicationFeeCard[]
  draftInvoiceId?: string
}

export interface InvoiceFeeCompositionSummary {
  totalApplications: number
  totalApplicants: number
  singleCount: number
  bulkCount: number
  /** Sum of all client-billable service line amounts. */
  servicesTotal: number
  /** Sum of included pending consulate refunds (to apply). */
  refundsIncludedTotal: number
}
