import {
  getDocumentWorkspaceItems,
  getVisaOfferingById,
  offeringAllowsPhysicalOriginalDocuments,
} from '@/shared/services/countryMasterService'
import type { WorkflowProfile } from '@/shared/types/countryMaster'
import type {
  OriginalDocumentCollectionDetailsByMethod,
  OriginalDocumentCollectionMethod,
  OriginalDocumentCollectionState,
  OriginalRequiredDocumentRef,
} from '@/shared/types/originalDocumentCollection'

export type CollectionDetailFieldType = 'text' | 'date' | 'time' | 'tel' | 'select' | 'textarea'

export interface CollectionDetailFieldDef {
  key: string
  label: string
  type: CollectionDetailFieldType
  required?: boolean
  /** When type is select and optionsKey is receivingOffice */
  optionsKey?: 'receivingOffice'
}

export const ORIGINAL_COLLECTION_METHOD_OPTIONS: {
  value: OriginalDocumentCollectionMethod
  label: string
}[] = [
  { value: 'couriered_by_applicant', label: 'Couriered by Applicant' },
  { value: 'picked_up_from_company', label: 'Picked up by GLTS Staff from Company' },
  { value: 'delivered_to_office', label: 'Delivered to GLTS Office' },
  { value: 'picked_up_at_airport', label: 'Picked up from Applicant at Airport' },
  { value: 'picked_up_from_cargo', label: 'Picked up from Air Cargo Office' },
  { value: 'hand_carry_by_applicant', label: 'Hand carry by applicant' },
]

export const COLLECTION_DETAIL_FIELDS_BY_METHOD: Record<
  OriginalDocumentCollectionMethod,
  CollectionDetailFieldDef[]
> = {
  couriered_by_applicant: [
    { key: 'receivingOfficeId', label: 'Receiving Office', type: 'select', optionsKey: 'receivingOffice', required: true },
    { key: 'courierPartner', label: 'Courier Partner', type: 'text', required: true },
    { key: 'trackingNumber', label: 'Tracking Number', type: 'text', required: true },
    { key: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
    { key: 'expectedArrivalDate', label: 'Expected Arrival Date', type: 'date', required: true },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
  picked_up_from_company: [
    { key: 'companyName', label: 'Company Name', type: 'text', required: true },
    { key: 'pickupAddress', label: 'Pickup Address', type: 'textarea', required: true },
    { key: 'contactPerson', label: 'Contact Person', type: 'text', required: true },
    { key: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
    { key: 'pickupDate', label: 'Pickup Date', type: 'date', required: true },
    { key: 'pickupTime', label: 'Pickup Time', type: 'time', required: true },
    { key: 'pickupExecutive', label: 'Pickup Executive', type: 'text', required: true },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
  delivered_to_office: [
    { key: 'receivingOfficeId', label: 'Receiving Office', type: 'select', optionsKey: 'receivingOffice', required: true },
    { key: 'deliveryDate', label: 'Delivery Date', type: 'date', required: true },
    { key: 'deliveredBy', label: 'Delivered By', type: 'text', required: true },
    { key: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
    { key: 'receiverName', label: 'Receiver Name', type: 'text', required: true },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
  picked_up_at_airport: [
    { key: 'airportName', label: 'Airport Name', type: 'text', required: true },
    { key: 'flightNumber', label: 'Flight Number', type: 'text', required: true },
    { key: 'arrivalDate', label: 'Arrival Date', type: 'date', required: true },
    { key: 'arrivalTime', label: 'Arrival Time', type: 'time', required: true },
    { key: 'applicantContactNumber', label: 'Applicant Contact Number', type: 'tel', required: true },
    { key: 'pickupExecutive', label: 'Pickup Executive', type: 'text', required: true },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
  picked_up_from_cargo: [
    { key: 'cargoOfficeName', label: 'Cargo Office Name', type: 'text', required: true },
    { key: 'awbNumber', label: 'AWB Number', type: 'text', required: true },
    { key: 'pickupDate', label: 'Pickup Date', type: 'date', required: true },
    { key: 'pickupTime', label: 'Pickup Time', type: 'time', required: true },
    { key: 'pickupExecutive', label: 'Pickup Executive', type: 'text', required: true },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
  hand_carry_by_applicant: [
    { key: 'receivingOfficeId', label: 'Receiving Office / Partner', type: 'select', optionsKey: 'receivingOffice', required: true },
    { key: 'handCarryDate', label: 'Hand Carry Date', type: 'date', required: true },
    { key: 'handCarryTime', label: 'Hand Carry Time', type: 'time', required: true },
    { key: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
    { key: 'applicantContactNumber', label: 'Applicant Contact Number', type: 'tel', required: true },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
}

function emptyDetailsForMethod<M extends OriginalDocumentCollectionMethod>(
  method: M,
): OriginalDocumentCollectionDetailsByMethod[M] {
  const fields = COLLECTION_DETAIL_FIELDS_BY_METHOD[method]
  const record: Record<string, string> = {}
  for (const field of fields) {
    record[field.key] = ''
  }
  return record as unknown as OriginalDocumentCollectionDetailsByMethod[M]
}

export function emptyOriginalDocumentCollectionState(
  documents: OriginalRequiredDocumentRef[],
): OriginalDocumentCollectionState {
  const details: OriginalDocumentCollectionDetailsByMethod = {
    couriered_by_applicant: emptyDetailsForMethod('couriered_by_applicant'),
    picked_up_from_company: emptyDetailsForMethod('picked_up_from_company'),
    delivered_to_office: emptyDetailsForMethod('delivered_to_office'),
    picked_up_at_airport: emptyDetailsForMethod('picked_up_at_airport'),
    picked_up_from_cargo: emptyDetailsForMethod('picked_up_from_cargo'),
    hand_carry_by_applicant: emptyDetailsForMethod('hand_carry_by_applicant'),
  }

  return {
    method: 'couriered_by_applicant',
    receivedDocuments: documents.map(doc => ({
      documentId: doc.documentId,
      name: doc.name,
      received: false,
    })),
    details,
    receivedRemarks: '',
  }
}

export function resolveOriginalRequiredDocuments(
  countryId: string,
  visaOfferingId: string,
  jurisdictionId?: string,
  _workflowProfile?: WorkflowProfile,
): OriginalRequiredDocumentRef[] {
  if (!offeringAllowsPhysicalOriginalDocuments(countryId, visaOfferingId)) {
    return []
  }

  const workspace = getDocumentWorkspaceItems(countryId, visaOfferingId, 'normal', jurisdictionId)
  return workspace
    .filter(doc => doc.originalDocument)
    .map(doc => ({ documentId: doc.id, name: doc.name }))
}

export function resolveWorkflowProfile(
  countryId: string,
  visaOfferingId: string,
): WorkflowProfile | undefined {
  return getVisaOfferingById(countryId, visaOfferingId)?.workflowProfile
}

export function countDocumentsReceived(state: OriginalDocumentCollectionState): {
  received: number
  total: number
} {
  const total = state.receivedDocuments.length
  const received = state.receivedDocuments.filter(item => item.received).length
  return { received, total }
}

export function originalCollectionMethodLabel(method: OriginalDocumentCollectionMethod): string {
  return (
    ORIGINAL_COLLECTION_METHOD_OPTIONS.find(option => option.value === method)?.label ?? method
  )
}

export function originalCollectionSummaryLabel(state: OriginalDocumentCollectionState): string {
  const { received, total } = countDocumentsReceived(state)
  if (total === 0) return 'Not required'
  if (received === 0) return 'Not started'
  return `${received}/${total}`
}

export type OriginalCollectionSummaryVariant = 'complete' | 'progress' | 'neutral'

export function originalCollectionSummaryVariant(
  state: OriginalDocumentCollectionState,
): OriginalCollectionSummaryVariant {
  const { received, total } = countDocumentsReceived(state)
  if (total === 0) return 'neutral'
  if (received === total) return 'complete'
  if (received > 0) return 'progress'
  return 'neutral'
}

export function mergeOriginalCollectionDocuments(
  state: OriginalDocumentCollectionState,
  documents: OriginalRequiredDocumentRef[],
): OriginalDocumentCollectionState {
  const previousById = new Map(
    state.receivedDocuments.map(item => [item.documentId, item.received]),
  )
  return {
    ...state,
    receivedDocuments: documents.map(doc => ({
      documentId: doc.documentId,
      name: doc.name,
      received: previousById.get(doc.documentId) ?? false,
    })),
  }
}

export function ensureOriginalDocumentCollectionState(
  existing: OriginalDocumentCollectionState | undefined,
  documents: OriginalRequiredDocumentRef[],
): OriginalDocumentCollectionState {
  if (!existing) {
    return emptyOriginalDocumentCollectionState(documents)
  }
  return mergeOriginalCollectionDocuments(existing, documents)
}

export function patchOriginalDocumentCollection(
  state: OriginalDocumentCollectionState,
  patch: Partial<OriginalDocumentCollectionState>,
): OriginalDocumentCollectionState {
  return {
    ...state,
    ...patch,
    receivedDocuments: patch.receivedDocuments ?? state.receivedDocuments,
    details: patch.details ? { ...state.details, ...patch.details } : state.details,
  }
}

export function toggleOriginalDocumentReceived(
  state: OriginalDocumentCollectionState,
  documentId: string,
  received: boolean,
): OriginalDocumentCollectionState {
  return {
    ...state,
    receivedDocuments: state.receivedDocuments.map(item =>
      item.documentId === documentId ? { ...item, received } : item,
    ),
  }
}

export function submitOriginalDocumentsReceived(
  state: OriginalDocumentCollectionState,
  remarks: string,
): OriginalDocumentCollectionState {
  return {
    ...state,
    receivedRemarks: remarks.trim(),
  }
}

export function patchCollectionDetailField(
  state: OriginalDocumentCollectionState,
  method: OriginalDocumentCollectionMethod,
  key: string,
  value: string,
): OriginalDocumentCollectionState {
  const currentMethodDetails = state.details[method] ?? emptyDetailsForMethod(method)
  return {
    ...state,
    details: {
      ...state.details,
      [method]: {
        ...currentMethodDetails,
        [key]: value,
      },
    },
  }
}

export function listReceivingOfficeOptions(): {
  value: string
  label: string
  description?: string
}[] {
  return [
    { value: 'office-mumbai', label: 'GLTS Mumbai Branch', description: 'Office' },
    { value: 'office-delhi', label: 'GLTS Delhi Branch', description: 'Office' },
    { value: 'partner-chennai', label: 'Chennai', description: 'Partner' },
    { value: 'partner-kolkata', label: 'Kolkata', description: 'Partner' },
    { value: 'partner-bangalore', label: 'Bangalore', description: 'Partner' },
  ]
}

export function originalCollectionCollapsedHint(state: OriginalDocumentCollectionState): string {
  const { received, total } = countDocumentsReceived(state)
  const methodLabel = originalCollectionMethodLabel(state.method)
  if (total === 0) return 'No originals required'
  return `${received} of ${total} originals received · ${methodLabel}`
}
