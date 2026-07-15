/** Client-billable service line seeded from Expense Management; amount/remark editable on invoice. */
export interface InvoiceBillableServiceLine {
  id: string
  expenseRecordId: string
  serviceLabel: string
  amount: number
  remark: string
}

export interface ApplicantFeeBundle {
  applicantId: string
  applicantName: string
  passportNumber: string
  country: string
  visaType: string
  serviceLines: InvoiceBillableServiceLine[]
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
}
