export type LogisticsDeliveryMethod =
  | 'Courier'
  | 'Airport Assistance - Working Hours'
  | 'Airport Assistance - Non-Working Hours'
  | 'Cargo'
  | 'Hand Delivery'

export type AirportAssistanceType = 'Working Hours' | 'Non-Working Hours'

export type HandDeliveryLocation = 'Office' | 'Residence' | 'Hotel'

/** Payment modes for logistics dispatch settlement (aligned with ground-ops). */
export type LogisticsPaymentMode = 'card_cash' | 'upi' | 'dd' | 'card' | 'cash'

export const LOGISTICS_PAYMENT_MODE_OPTIONS: {
  value: LogisticsPaymentMode
  label: string
}[] = [
  { value: 'card_cash', label: 'Card + cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'dd', label: 'DD' },
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
]

export function getLogisticsPaymentModeLabel(value?: LogisticsPaymentMode): string {
  return LOGISTICS_PAYMENT_MODE_OPTIONS.find(option => option.value === value)?.label ?? '—'
}

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
  /** Payment date for dispatch charge settlement (YYYY-MM-DD). */
  paymentDate?: string
  paymentMode?: LogisticsPaymentMode
  /** Card master id when payment mode is card. */
  paymentCardId?: string
  /** UTR / transaction reference for the payment. */
  transactionReference?: string
  dispatchedAt?: string
  /** Set when courier/handover is confirmed delivered — ends IN TRANSIT. */
  deliveredAt?: string
}

export const LOGISTICS_DELIVERY_METHODS: LogisticsDeliveryMethod[] = [
  'Courier',
  'Airport Assistance - Working Hours',
  'Airport Assistance - Non-Working Hours',
  'Cargo',
  'Hand Delivery',
]

export const AIRPORT_ASSISTANCE_TYPES: AirportAssistanceType[] = [
  'Working Hours',
  'Non-Working Hours',
]

export function isAirportAssistanceDeliveryMethod(
  method: LogisticsDeliveryMethod | '' | undefined,
): boolean {
  return (
    method === 'Airport Assistance - Working Hours' ||
    method === 'Airport Assistance - Non-Working Hours'
  )
}

export function assistanceTypeFromDeliveryMethod(
  method: LogisticsDeliveryMethod | '',
): AirportAssistanceType | undefined {
  if (method === 'Airport Assistance - Working Hours') return 'Working Hours'
  if (method === 'Airport Assistance - Non-Working Hours') return 'Non-Working Hours'
  return undefined
}

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
    paymentDate: '',
    paymentMode: undefined,
    paymentCardId: '',
    transactionReference: '',
  }
}

/** Consulate refund captured on logistics desk — seeded into invoice composition. */
export interface LogisticsRefundDetails {
  vendorId: string
  vendorName: string
  amount: number
  remarks?: string
  recordedAt?: string
  recordedBy?: string
}

export function createEmptyLogisticsRefundDetails(): LogisticsRefundDetails {
  return {
    vendorId: '',
    vendorName: '',
    amount: 0,
    remarks: '',
  }
}
