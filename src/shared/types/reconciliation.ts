import type { FormAssistPaymentEntry } from '@/shared/services/applicationFormAssistService'
import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'

export type ReconciliationTab =
  | 'approved_claim_sheet'
  | 'insurance'
  | 'ticket'
  | 'courier'
  | 'mode_of_payment'

export type ReconciliationPeriodPreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'mtd'
  | 'qtd'
  | 'ytd'
  | 'custom'

export type ReconciliationStatus = 'pending' | 'submitted' | 'rejected'

export type ReconciliationSourceKind = 'expense' | 'claim_sheet' | 'payment_entry'

export interface ReconciliationPaymentServiceLine {
  id: string
  serviceName: string
  amount: number
  gstIncluded?: boolean
  vendorName?: string
}

/** One row per pending-payment entry (multiple services in one payment). */
export interface ReconciliationPaymentEntryRow {
  id: string
  applicationId: string
  travelerRowId: string
  paymentEntryId: string
  entry: FormAssistPaymentEntry
  services: ReconciliationPaymentServiceLine[]
  status: ReconciliationStatus
  refNo: string
  gltsCreationDate: string
  passengerName: string
  client: string
  visaCountry: string
  paymentDate: string
  paymentMode: string
  paymentReferenceNumber: string
  cardUsed: string
  amountInr: number
  foreignCurrencyAmount: number
  staffName: string
  serviceCount: number
  servicesSummary: string
  referenceNumber: string
  reconciledAt?: string
  reconciledBy?: string
  rejectionReason?: string
}

export interface ReconciliationFilters {
  period: ReconciliationPeriodPreset
  customFrom?: string
  customTo?: string
  /** Mode-of-payment tab only */
  paymentMode?: string
  status?: ReconciliationStatus | ''
}

export interface ReconciliationItem {
  id: string
  sourceKind: ReconciliationSourceKind
  sourceId: string
  tab: ReconciliationTab
  status: ReconciliationStatus

  /** GLTS application / claim reference shown as RefNo / GLTS No */
  refNo: string
  gltsCreationDate: string
  passengerName: string
  client: string
  bookedBy: string
  consultant: string
  visaCountry: string
  vendor: string

  bookingDate: string
  cost: number
  markup: number
  total: number

  /** Insurance */
  policyNumber: string
  vendorInvoiceNumber: string

  /** Ticket / courier route */
  locationFrom: string
  locationTo: string

  /** Courier */
  trackingNumber: string
  courierBookedBy: string

  /** Mode of payment */
  chargesName: string
  paymentDate: string
  paymentMode: string
  cardUsed: string
  amountInr: number
  foreignCurrencyAmount: number
  staffName: string
  acPersonName: string
  acEntryNo: string

  /** Claim sheet */
  claimNumber: string
  claimTeam: string
  claimCasesCount: number
  claimGrandTotal: number
  claimReviewedAt: string

  /** Book entry number entered on successful reconcile. */
  referenceNumber: string
  reconciledAt?: string
  reconciledBy?: string
  rejectionReason?: string
}

/** One row per approved claim sheet — mirrors Fund Allocation claim sheet listing grain. */
export interface ReconciliationClaimSheetRow {
  id: string
  sheetId: string
  sheet: GroundOpsClaimSheet
  status: ReconciliationStatus
  referenceNumber: string
  reconciledAt?: string
  reconciledBy?: string
  rejectionReason?: string
}

export interface SubmitReconciliationInput {
  id: string
  referenceNumber: string
  cost?: number
  total?: number
  vendorInvoiceNumber?: string
  /** Courier reports — AWB / tracking number entered in the drawer. */
  trackingNumber?: string
}

export interface RejectReconciliationInput {
  id: string
  reason: string
}
