/** How physical original documents reach GLTS operations. */
export type OriginalDocumentCollectionMethod =
  | 'couriered_by_applicant'
  | 'picked_up_from_company'
  | 'delivered_to_office'
  | 'picked_up_at_airport'
  | 'picked_up_from_cargo'
  | 'hand_carry_by_applicant'

export interface OriginalDocumentReceivedItem {
  documentId: string
  name: string
  received: boolean
}

export interface CourieredByApplicantDetails {
  receivingOfficeId: string
  courierPartner: string
  trackingNumber: string
  dispatchDate: string
  expectedArrivalDate: string
  remarks: string
}

export interface PickedUpFromCompanyDetails {
  companyName: string
  pickupAddress: string
  contactPerson: string
  contactNumber: string
  pickupDate: string
  pickupTime: string
  pickupExecutive: string
  remarks: string
}

export interface DeliveredToOfficeDetails {
  receivingOfficeId: string
  deliveryDate: string
  deliveredBy: string
  contactNumber: string
  receiverName: string
  remarks: string
}

export interface PickedUpAtAirportDetails {
  airportName: string
  flightNumber: string
  arrivalDate: string
  arrivalTime: string
  applicantContactNumber: string
  pickupExecutive: string
  remarks: string
}

export interface PickedUpFromCargoDetails {
  cargoOfficeName: string
  awbNumber: string
  pickupDate: string
  pickupTime: string
  pickupExecutive: string
  remarks: string
}

export interface HandCarryByApplicantDetails {
  receivingOfficeId: string
  handCarryDate: string
  handCarryTime: string
  applicantName: string
  applicantContactNumber: string
  remarks: string
}

export interface OriginalDocumentCollectionDetailsByMethod {
  couriered_by_applicant: CourieredByApplicantDetails
  picked_up_from_company: PickedUpFromCompanyDetails
  delivered_to_office: DeliveredToOfficeDetails
  picked_up_at_airport: PickedUpAtAirportDetails
  picked_up_from_cargo: PickedUpFromCargoDetails
  hand_carry_by_applicant: HandCarryByApplicantDetails
}

export interface OriginalDocumentCollectionState {
  method: OriginalDocumentCollectionMethod
  receivedDocuments: OriginalDocumentReceivedItem[]
  details: Partial<OriginalDocumentCollectionDetailsByMethod>
  /** Ops note captured when physical documents are marked received. */
  receivedRemarks?: string
}

export interface OriginalRequiredDocumentRef {
  documentId: string
  name: string
}
