import type { ApplicationCustomerSegment, ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { VfsServiceChargeLine } from '@/shared/utils/vfsServicePickerUtils'

export type FundAllocationListingTab = 'pending_allocation' | 'allocated'

export type FundAllocationStatus = 'pending_allocation' | 'allocated'

export type FundTransferType =
  | 'cash_upi'
  | 'bank_transfer'
  | 'cheque'
  | 'demand_draft'
  | 'card'
  | 'other'

export const FUND_TRANSFER_DEFAULT_SOURCE = 'GLTS main office'

export interface FundTransferDetails {
  fundSource: string
  transferType: FundTransferType | ''
  transferDate: string
  /** Cash / UPI — auto-filled from assigned user */
  receivedBy: string
  /** Bank transfer */
  destinationBankAccount: string
  /** Card — selected from card master */
  assignedCardId: string
  /** Shared reference for DD, Other, Bank, Cheque, Card, etc. */
  paymentReference: string
  paymentRemark: string
}

export const FUND_TRANSFER_TYPE_OPTIONS: Array<{ value: FundTransferType; label: string }> = [
  { value: 'cash_upi', label: 'Cash / UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'demand_draft', label: 'Demand Draft (DD)' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
]

export function getFundTransferTypeLabel(type: FundTransferType | '' | undefined): string {
  if (!type) return '—'
  return FUND_TRANSFER_TYPE_OPTIONS.find(option => option.value === type)?.label ?? type
}

export function createEmptyFundTransferDetails(
  partial?: Partial<FundTransferDetails>,
): FundTransferDetails {
  return {
    fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
    transferType: '',
    transferDate: '',
    receivedBy: '',
    destinationBankAccount: '',
    assignedCardId: '',
    paymentReference: '',
    paymentRemark: '',
    ...partial,
    fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
  }
}

export function isFundTransferValid(details: FundTransferDetails): boolean {
  if (!details.transferType || !details.transferDate.trim()) return false

  if (details.transferType === 'bank_transfer') {
    return details.destinationBankAccount.trim().length > 0
  }

  if (details.transferType === 'card') {
    return details.assignedCardId.trim().length > 0
  }

  return true
}

export interface FundAllocationOverlay {
  allocationStatus: FundAllocationStatus
  /** True when Assignment & Priority requested funds for selected services. */
  fundRequested: boolean
  requestedAt: string
  totalAmount: number
  allocatedAmount: number
  selectedServices: VfsServiceChargeLine[]
  /** @deprecated Prefer fundTransfer. Kept for legacy seed/display compatibility. */
  cardId: string
  fundTransfer?: FundTransferDetails
  allocatedAt: string
  allocationNotes: string
  lastUpdated: string
}

export interface FundAllocationPassengerRow {
  id: string
  gltsApplicantId: string
  gltsApplicationId: string
  sequenceNo: number
  passengerName: string
  passportNo: string
  companyName: string
  country: string
  countryFlag?: string
  visaType: string
  jurisdiction: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  travelDate: string
  /** Online submission date from Application Management. */
  onlineSubmissionDate: string
  /**
   * VFS submission date from Application Management / Ground Operations
   * (Ground Ops submission date is the same value).
   */
  vfsSubmissionDate: string
  /** Tentative collection date from Application Management. */
  tentativeCollectionDate: string
  /** Actual collection date from Ground Operations. */
  collectionDate: string
  /**
   * Listing / filter date — prefers VFS submission date, else online submission date.
   * @deprecated Prefer onlineSubmissionDate / vfsSubmissionDate for display.
   */
  submissionDate: string
  submissionStatus: ApplicationOperationalStatus
  customerSegment: ApplicationCustomerSegment
  allocationStatus: FundAllocationStatus
  fundRequested: boolean
  requestedAt: string
  totalAmount: number
  allocatedAmount: number
  selectedServices: VfsServiceChargeLine[]
  /** @deprecated Prefer fundTransfer. Kept for legacy seed/display compatibility. */
  cardId: string
  cardName: string
  fundTransfer?: FundTransferDetails
  allocatedAt: string
  /** Latest assigner from Assignment & Priority Management. */
  allocatedBy: string
  /** Current assignee from Assignment & Priority Management. */
  allocatedTo: string
  /** Team from Assignment & Priority Management. */
  assignedTeam: string
  /** User from Assignment & Priority Management. */
  assignedUser: string
  allocationNotes: string
  suggestedAllocationAmount: number
  lastUpdated: string
}

export interface FundAllocationQueueFilters {
  customerSegment: string
  country: string
  visaType: string
  jurisdiction: string
  assignedTeam: string
  assignedUser: string
  /** ISO date (yyyy-MM-dd) — filters on VFS submission date. */
  dateFrom: string
  dateTo: string
  search: string
}

export interface FundAllocationActionInput {
  selectedServices: VfsServiceChargeLine[]
  totalAmount: number
  allocatedAmount: number
  fundTransfer: FundTransferDetails
  notes?: string
}

/** Service selection captured when Assignment & Priority requests funds. */
export interface FundAllocationRequestInput {
  selectedServices: VfsServiceChargeLine[]
  totalAmount: number
  notes?: string
}
