export type LogisticsDeliveryMethod =
  | 'Courier'
  | 'Airport Assistance'
  | 'Cargo'
  | 'Hand Delivery'

export type AirportAssistanceType = 'Office Hours' | 'Outside Office Hours'

export type HandDeliveryLocation = 'Office' | 'Residence' | 'Hotel'

export interface LogisticsFinalQcChecks {
  nameCheck: boolean
  cdcNumberValidity: boolean
  passportDetails: boolean
  dateOfBirth: boolean
  photoMatch: boolean
  genderMatch: boolean
  travelDateVsVisaValidity: boolean
  visaType: boolean
  visaIssueExpiryDate: boolean
}

export interface LogisticsFinalQc {
  checks: LogisticsFinalQcChecks
  remarks: string
  verifiedBy: string
  verifiedAt: string
  completed: boolean
}

export interface LogisticsDispatchDetails {
  deliveryMethod: LogisticsDeliveryMethod | ''
  dispatchDateTime: string
  remarks: string
  courierPartner?: string
  awbNumber?: string
  courierCharges?: number
  trackingUrl?: string
  assistanceType?: AirportAssistanceType
  airportAssistanceCharges?: number
  cargoHandlingCharges?: number
  deliveryLocation?: HandDeliveryLocation
  dispatchedAt?: string
}

export const LOGISTICS_DELIVERY_METHODS: LogisticsDeliveryMethod[] = [
  'Courier',
  'Airport Assistance',
  'Cargo',
  'Hand Delivery',
]

export const AIRPORT_ASSISTANCE_TYPES: AirportAssistanceType[] = [
  'Office Hours',
  'Outside Office Hours',
]

export const HAND_DELIVERY_LOCATIONS: HandDeliveryLocation[] = [
  'Office',
  'Residence',
  'Hotel',
]

export const LOGISTICS_COURIER_PARTNERS = [
  'Blue Dart',
  'DTDC',
  'DHL',
  'FedEx',
  'Delhivery',
] as const

export const LOGISTICS_FINAL_QC_CHECKLIST: {
  key: keyof LogisticsFinalQcChecks
  label: string
}[] = [
  { key: 'nameCheck', label: 'Name Check' },
  { key: 'cdcNumberValidity', label: 'CDC Number & Validity' },
  { key: 'passportDetails', label: 'Passport Details' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'photoMatch', label: 'Photo Match (Passport vs. Visa)' },
  { key: 'genderMatch', label: 'Gender Match' },
  { key: 'travelDateVsVisaValidity', label: 'Travel Date vs. Visa Validity' },
  { key: 'visaType', label: 'Visa Type' },
  { key: 'visaIssueExpiryDate', label: 'Visa Issue & Expiry Date' },
]

export function createEmptyLogisticsFinalQcChecks(): LogisticsFinalQcChecks {
  return {
    nameCheck: false,
    cdcNumberValidity: false,
    passportDetails: false,
    dateOfBirth: false,
    photoMatch: false,
    genderMatch: false,
    travelDateVsVisaValidity: false,
    visaType: false,
    visaIssueExpiryDate: false,
  }
}

export function createEmptyLogisticsDispatchDetails(): LogisticsDispatchDetails {
  return {
    deliveryMethod: '',
    dispatchDateTime: '',
    remarks: '',
    courierPartner: '',
    awbNumber: '',
    courierCharges: undefined,
    trackingUrl: '',
    assistanceType: undefined,
    airportAssistanceCharges: undefined,
    cargoHandlingCharges: undefined,
    deliveryLocation: undefined,
  }
}
