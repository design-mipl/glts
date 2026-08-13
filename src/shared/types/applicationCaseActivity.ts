/** Application-management case activity (UI mock — independent of Assignment & Priority). */

export type ApplicationActivityModule =
  | 'application'
  | 'assignment'
  | 'documents'
  | 'form'
  | 'payment'
  | 'logistics'
  | 'remarks'
  | 'status'

export interface ApplicationActivityEvent {
  id: string
  applicationId: string
  occurredAt: string
  actor: string
  action: string
  detail: string
  module: ApplicationActivityModule
  travelerName?: string
}

export type ApplicationLogisticsStatus =
  | 'Pending collection'
  | 'Collected'
  | 'In transit'
  | 'Delivered'
  | 'On hold'

export type ApplicationLogisticsSource = 'ground_operations' | 'application_management'

export interface ApplicationLogisticsUpdate {
  id: string
  applicationId: string
  sequence: number
  createdAt: string
  createdBy: string
  /** Ground Ops synced entries are read-only here; AM-added entries can be edited/deleted. */
  source: ApplicationLogisticsSource
  status: ApplicationLogisticsStatus
  deliveryMethod: string
  courierPartner: string
  awbNumber: string
  trackingUrl: string
  dispatchDateTime: string
  remarks: string
}

export interface ApplicationLogisticsUpdateInput {
  status: ApplicationLogisticsStatus
  deliveryMethod: string
  courierPartner: string
  awbNumber: string
  trackingUrl: string
  dispatchDateTime: string
  remarks: string
}

export const APPLICATION_LOGISTICS_STATUS_OPTIONS: {
  value: ApplicationLogisticsStatus
  label: string
}[] = [
  { value: 'Pending collection', label: 'Pending collection' },
  { value: 'Collected', label: 'Collected' },
  { value: 'In transit', label: 'In transit' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'On hold', label: 'On hold' },
]

export const APPLICATION_LOGISTICS_DELIVERY_METHODS = [
  'Courier',
  'Airport Assistance - Working Hours',
  'Airport Assistance - Non-Working Hours',
  'Cargo',
  'Hand Delivery',
] as const

export const APPLICATION_LOGISTICS_COURIER_PARTNERS = [
  'Blue Dart',
  'DTDC',
  'DHL',
  'FedEx',
  'Delhivery',
] as const
