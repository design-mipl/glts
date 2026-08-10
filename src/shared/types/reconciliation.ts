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

export type ReconciliationStatus = 'pending' | 'submitted'

export type ReconciliationSourceKind = 'expense' | 'claim_sheet'

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

  /**
   * Primary editable reconciliation reference.
   * Label varies by tab (policy / AWB / AC entry / settlement ref).
   */
  referenceNumber: string
  reconciledAt?: string
  reconciledBy?: string
}

export interface SubmitReconciliationInput {
  id: string
  referenceNumber: string
}
