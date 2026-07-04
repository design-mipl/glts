import type { ApplicationCustomerSegment, ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { VfsServiceChargeLine } from '@/shared/utils/vfsServicePickerUtils'

export type FundAllocationListingTab = 'pending_allocation' | 'allocated'

export type FundAllocationStatus = 'pending_allocation' | 'allocated'

export interface FundAllocationOverlay {
  allocationStatus: FundAllocationStatus
  totalAmount: number
  allocatedAmount: number
  selectedServices: VfsServiceChargeLine[]
  creditCardId: string
  allocatedAt: string
  allocatedBy: string
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
  submissionDate: string
  submissionStatus: ApplicationOperationalStatus
  customerSegment: ApplicationCustomerSegment
  appointmentDate: string
  allocationStatus: FundAllocationStatus
  totalAmount: number
  allocatedAmount: number
  selectedServices: VfsServiceChargeLine[]
  creditCardId: string
  creditCardName: string
  allocatedAt: string
  allocatedBy: string
  allocationNotes: string
  suggestedAllocationAmount: number
  lastUpdated: string
}

export interface FundAllocationQueueFilters {
  customerSegment: string
  country: string
  visaType: string
  jurisdiction: string
  search: string
}

export interface FundAllocationActionInput {
  selectedServices: VfsServiceChargeLine[]
  totalAmount: number
  allocatedAmount: number
  creditCardId: string
  notes?: string
}
