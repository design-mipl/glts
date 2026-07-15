import type { ApplicationCustomerSegment, ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { VfsServiceChargeLine } from '@/shared/utils/vfsServicePickerUtils'

export type FundAllocationListingTab = 'pending_allocation' | 'allocated'

export type FundAllocationStatus = 'pending_allocation' | 'allocated'

export interface FundAllocationOverlay {
  allocationStatus: FundAllocationStatus
  totalAmount: number
  allocatedAmount: number
  selectedServices: VfsServiceChargeLine[]
  cardId: string
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
  totalAmount: number
  allocatedAmount: number
  selectedServices: VfsServiceChargeLine[]
  cardId: string
  cardName: string
  allocatedAt: string
  /** Latest assigner from Assignment & Priority Management. */
  allocatedBy: string
  /** Current assignee from Assignment & Priority Management. */
  allocatedTo: string
  allocationNotes: string
  suggestedAllocationAmount: number
  lastUpdated: string
}

export interface FundAllocationQueueFilters {
  customerSegment: string
  country: string
  visaType: string
  jurisdiction: string
  /** ISO date (yyyy-MM-dd) — filters on VFS submission date. */
  dateFrom: string
  dateTo: string
  search: string
}

export interface FundAllocationActionInput {
  selectedServices: VfsServiceChargeLine[]
  totalAmount: number
  allocatedAmount: number
  cardId: string
  notes?: string
}
