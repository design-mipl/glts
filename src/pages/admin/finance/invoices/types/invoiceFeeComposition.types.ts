/** Invoice composition service categories (aligned with agreement / quotation). */
export type InvoiceServiceLineCategory =
  | 'glts_processing'
  | 'miscellaneous_dispatch'
  | 'vfs'

/** Client-billable service line seeded from Expense Management; amount/remark editable on invoice. */
export interface InvoiceBillableServiceLine {
  id: string
  expenseRecordId: string
  serviceLabel: string
  /** Original / application service amount. */
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
  status: 'pending' | 'applied'
  /** Include this refund when submitting the current composition. */
  included: boolean
  appliedVia?: 'generate' | 'modify' | 'credit_note'
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
