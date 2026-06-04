export interface SimpleFeeField {
  amount: number
  notes: string
}

export interface RepeatableFeeRow {
  id: string
  feeType: string
  feeTypeLabel: string
  isCustom: boolean
  amount: number
  notes: string
}

export interface ApplicantFeeBundle {
  applicantId: string
  applicantName: string
  passportNumber: string
  country: string
  visaType: string
  gltsFees: SimpleFeeField
  visaFees: SimpleFeeField
  handlingFees: RepeatableFeeRow[]
  miscellaneousFees: RepeatableFeeRow[]
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
  gltsFees: SimpleFeeField
  visaFees: SimpleFeeField
  handlingFees: RepeatableFeeRow[]
  miscellaneousFees: RepeatableFeeRow[]
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

export interface InvoiceFeeCategoryTotals {
  gltsFees: number
  visaFees: number
  handlingFees: number
  miscellaneousFees: number
}

export interface InvoiceFeeCompositionSummary extends InvoiceFeeCategoryTotals {
  totalApplications: number
  totalApplicants: number
  singleCount: number
  bulkCount: number
}
