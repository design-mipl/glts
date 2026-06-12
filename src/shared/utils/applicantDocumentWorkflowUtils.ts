import type {
  ApplicantDocumentItem,
  ApplicantDocumentStatus,
} from '@/pages/customer/features/applications/data/applicationFlowData'

export type DocumentHandlingMode = 'upload_by_applicant' | 'arrange_by_glts'

export interface TravelTicketWorkflow {
  fileName?: string
  ticketNumber?: string
  airlineTravelMode?: string
  travelDate?: string
  remarks?: string
  /** @deprecated Use remarks — kept for merge compatibility */
  notes?: string
}

export interface InsuranceWorkflow {
  fileName?: string
  policyNumber?: string
  insuranceProvider?: string
  validFrom?: string
  validTo?: string
  remarks?: string
  /** @deprecated Use validFrom/validTo — kept for merge compatibility */
  travelStartDate?: string
  /** @deprecated Use validFrom/validTo */
  travelEndDate?: string
  /** @deprecated Use remarks */
  notes?: string
}

export const SIMPLE_DOCUMENT_REQUIREMENT_IDS = ['travel-ticket', 'insurance'] as const
export type SimpleDocumentRequirementId = (typeof SIMPLE_DOCUMENT_REQUIREMENT_IDS)[number]

export type SimpleDocumentWorkflowStatus =
  | 'not_selected'
  | 'customer_will_upload'
  | 'pending_customer_upload'
  | 'uploaded_by_customer'
  | 'under_verification'
  | 'pending_glts_booking'
  | 'pending_glts_insurance'
  | 'ticket_uploaded_by_glts'
  | 'insurance_uploaded_by_glts'
  | 'arranged_by_glts'
  | 'verified'
  | 'rejected'
  | 'reupload_requested'
  | 'needs_review'

export function isSimpleDocumentRequirement(documentId: string): documentId is SimpleDocumentRequirementId {
  return SIMPLE_DOCUMENT_REQUIREMENT_IDS.includes(documentId as SimpleDocumentRequirementId)
}

export function hasHandlingModeChosen(doc: ApplicantDocumentItem): boolean {
  return doc.handlingMode === 'upload_by_applicant' || doc.handlingMode === 'arrange_by_glts'
}

export function resolveHandlingMode(doc: ApplicantDocumentItem): DocumentHandlingMode | undefined {
  return doc.handlingMode
}

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

function hasWorkflowFile(doc: ApplicantDocumentItem): boolean {
  if (doc.documentId === 'travel-ticket') {
    return hasText(doc.travelTicket?.fileName)
  }
  if (doc.documentId === 'insurance') {
    return hasText(doc.insurance?.fileName)
  }
  return false
}

export function getSimpleDocumentWorkflowStatus(doc: ApplicantDocumentItem): SimpleDocumentWorkflowStatus {
  if (!isSimpleDocumentRequirement(doc.documentId)) {
    if (doc.status === 'verified') return 'verified'
    if (doc.status === 'rejected') return 'rejected'
    return 'not_selected'
  }

  if (doc.status === 'verified') return 'verified'
  if (doc.status === 'rejected') return 'rejected'
  if (doc.status === 'needs_review') {
    return doc.handlingMode === 'upload_by_applicant' ? 'reupload_requested' : 'needs_review'
  }

  if (!hasHandlingModeChosen(doc)) return 'not_selected'

  const mode = doc.handlingMode!
  const hasFile = hasWorkflowFile(doc)

  if (mode === 'upload_by_applicant') {
    if (hasFile && doc.status === 'uploaded') return 'uploaded_by_customer'
    if (hasFile) return 'under_verification'
    return 'customer_will_upload'
  }

  if (hasFile) {
    return doc.documentId === 'travel-ticket' ? 'ticket_uploaded_by_glts' : 'insurance_uploaded_by_glts'
  }

  return doc.documentId === 'travel-ticket' ? 'pending_glts_booking' : 'pending_glts_insurance'
}

const WORKFLOW_STATUS_LABELS: Record<SimpleDocumentWorkflowStatus, string> = {
  not_selected: 'Not Selected',
  customer_will_upload: 'Customer Will Upload',
  pending_customer_upload: 'Pending Customer Upload',
  uploaded_by_customer: 'Uploaded by Customer',
  under_verification: 'Under Verification',
  pending_glts_booking: 'Pending GLTS Booking',
  pending_glts_insurance: 'Pending GLTS Insurance Arrangement',
  ticket_uploaded_by_glts: 'Ticket Uploaded by GLTS',
  insurance_uploaded_by_glts: 'Insurance Uploaded by GLTS',
  arranged_by_glts: 'Arranged by GLTS',
  verified: 'Verified',
  rejected: 'Rejected',
  reupload_requested: 'Re-upload Requested',
  needs_review: 'Needs review',
}

export function documentStatusLabel(doc: ApplicantDocumentItem): string {
  if (!isSimpleDocumentRequirement(doc.documentId)) {
    if (doc.status === 'verified') return 'Verified'
    if (doc.status === 'rejected') return 'Rejected'
    if (doc.status === 'needs_review') return 'Needs review'
    if (doc.status === 'uploaded') return 'Uploaded'
    return 'Not uploaded'
  }

  if (doc.status === 'needs_review') {
    return doc.handlingMode === 'upload_by_applicant'
      ? WORKFLOW_STATUS_LABELS.reupload_requested
      : WORKFLOW_STATUS_LABELS.needs_review
  }

  if (doc.status === 'verified') return 'Verified'
  if (doc.status === 'rejected') return 'Rejected'

  const workflowStatus = getSimpleDocumentWorkflowStatus(doc)
  if (workflowStatus === 'ticket_uploaded_by_glts' || workflowStatus === 'insurance_uploaded_by_glts') {
    if (doc.status !== 'verified') {
      return WORKFLOW_STATUS_LABELS[workflowStatus]
    }
  }
  if (
    workflowStatus === 'ticket_uploaded_by_glts' ||
    workflowStatus === 'insurance_uploaded_by_glts' ||
    (workflowStatus === 'verified' && doc.handlingMode === 'arrange_by_glts' && hasWorkflowFile(doc))
  ) {
    if (doc.status === 'verified') return 'Verified'
    if (doc.handlingMode === 'arrange_by_glts' && hasWorkflowFile(doc)) {
      return 'Arranged by GLTS'
    }
  }

  if (doc.handlingMode === 'arrange_by_glts' && hasWorkflowFile(doc) && doc.status === 'verified') {
    return 'Verified'
  }
  if (doc.handlingMode === 'arrange_by_glts' && hasWorkflowFile(doc)) {
    return 'Arranged by GLTS'
  }

  return WORKFLOW_STATUS_LABELS[workflowStatus]
}

export function requirementTypeLabel(doc: ApplicantDocumentItem): string | null {
  if (!isSimpleDocumentRequirement(doc.documentId) || !hasHandlingModeChosen(doc)) return null
  return doc.handlingMode === 'upload_by_applicant' ? 'Customer Upload' : 'GLTS To Arrange'
}

export function isApplicantDocumentSatisfied(doc: ApplicantDocumentItem): boolean {
  if (!isSimpleDocumentRequirement(doc.documentId)) {
    return doc.status === 'uploaded' || doc.status === 'verified'
  }

  if (!hasHandlingModeChosen(doc)) return false

  if (doc.handlingMode === 'upload_by_applicant') {
    return hasWorkflowFile(doc)
  }

  return true
}

function ticketRemarks(w: TravelTicketWorkflow | undefined): string {
  return (w?.remarks ?? w?.notes ?? '').trim()
}

function insuranceRemarks(w: InsuranceWorkflow | undefined): string {
  return (w?.remarks ?? w?.notes ?? '').trim()
}

function insuranceValidFrom(w: InsuranceWorkflow | undefined): string | undefined {
  return w?.validFrom?.trim() || w?.travelStartDate?.trim() || undefined
}

function insuranceValidTo(w: InsuranceWorkflow | undefined): string | undefined {
  return w?.validTo?.trim() || w?.travelEndDate?.trim() || undefined
}

export function formatWorkflowSummary(doc: ApplicantDocumentItem): string | null {
  if (!isSimpleDocumentRequirement(doc.documentId)) return null

  const reqType = requirementTypeLabel(doc)
  if (!reqType) return null

  const parts: string[] = [reqType]

  if (doc.documentId === 'travel-ticket') {
    const w = doc.travelTicket
    if (w?.fileName?.trim()) parts.push(w.fileName.trim())
    if (w?.ticketNumber?.trim()) parts.push(`Ticket: ${w.ticketNumber.trim()}`)
    if (w?.airlineTravelMode?.trim()) parts.push(w.airlineTravelMode.trim())
    if (w?.travelDate?.trim()) parts.push(`Travel: ${w.travelDate.trim()}`)
    const remarks = ticketRemarks(w)
    if (remarks) parts.push(remarks)
    return parts.join(' · ')
  }

  const w = doc.insurance
  if (w?.fileName?.trim()) parts.push(w.fileName.trim())
  if (w?.policyNumber?.trim()) parts.push(`Policy: ${w.policyNumber.trim()}`)
  if (w?.insuranceProvider?.trim()) parts.push(w.insuranceProvider.trim())
  const from = insuranceValidFrom(w)
  const to = insuranceValidTo(w)
  if (from && to) parts.push(`${from} – ${to}`)
  else if (from) parts.push(`From: ${from}`)
  const remarks = insuranceRemarks(w)
  if (remarks) parts.push(remarks)
  return parts.join(' · ')
}

export function emptyTravelTicketWorkflow(): TravelTicketWorkflow {
  return {
    fileName: '',
    ticketNumber: '',
    airlineTravelMode: '',
    travelDate: '',
    remarks: '',
  }
}

export function emptyInsuranceWorkflow(): InsuranceWorkflow {
  return {
    fileName: '',
    policyNumber: '',
    insuranceProvider: '',
    validFrom: '',
    validTo: '',
    remarks: '',
  }
}

export function seedSimpleDocumentWorkflowFields(doc: ApplicantDocumentItem): ApplicantDocumentItem {
  if (!isSimpleDocumentRequirement(doc.documentId)) return doc

  if (doc.documentId === 'travel-ticket') {
    return { ...doc, travelTicket: doc.travelTicket ?? emptyTravelTicketWorkflow() }
  }
  return { ...doc, insurance: doc.insurance ?? emptyInsuranceWorkflow() }
}

export function statusAfterWorkflowChange(
  doc: ApplicantDocumentItem,
  previousMode?: DocumentHandlingMode,
): ApplicantDocumentStatus {
  if (!isSimpleDocumentRequirement(doc.documentId)) return doc.status

  if (previousMode && doc.handlingMode && previousMode !== doc.handlingMode) {
    if (doc.status === 'verified' || doc.status === 'needs_review' || doc.status === 'rejected') {
      return doc.status
    }
    return 'missing'
  }

  if (doc.status === 'verified' || doc.status === 'needs_review' || doc.status === 'rejected') {
    return doc.status
  }

  if (!hasHandlingModeChosen(doc)) return 'missing'

  if (doc.handlingMode === 'upload_by_applicant') {
    return hasWorkflowFile(doc) ? 'uploaded' : 'missing'
  }

  if (hasWorkflowFile(doc)) return 'uploaded'
  return 'missing'
}

function clearTravelTicketForMode(mode: DocumentHandlingMode): Partial<TravelTicketWorkflow> {
  if (mode === 'upload_by_applicant') {
    return {
      ticketNumber: '',
      airlineTravelMode: '',
      travelDate: '',
      remarks: '',
      notes: '',
    }
  }
  return { fileName: '' }
}

function clearInsuranceForMode(mode: DocumentHandlingMode): Partial<InsuranceWorkflow> {
  if (mode === 'upload_by_applicant') {
    return {
      policyNumber: '',
      insuranceProvider: '',
      validFrom: '',
      validTo: '',
      remarks: '',
      notes: '',
      travelStartDate: '',
      travelEndDate: '',
    }
  }
  return { fileName: '' }
}

export function patchAfterHandlingModeChange(
  doc: ApplicantDocumentItem,
  mode: DocumentHandlingMode,
): Partial<ApplicantDocumentItem> {
  const previousMode = doc.handlingMode

  if (doc.documentId === 'travel-ticket') {
    const cleared = clearTravelTicketForMode(mode)
    const travelTicket = { ...(doc.travelTicket ?? emptyTravelTicketWorkflow()), ...cleared }
    const nextDoc = { ...doc, handlingMode: mode, travelTicket }
    return {
      handlingMode: mode,
      travelTicket,
      status: statusAfterWorkflowChange(nextDoc, previousMode),
    }
  }

  const cleared = clearInsuranceForMode(mode)
  const insurance = { ...(doc.insurance ?? emptyInsuranceWorkflow()), ...cleared }
  const nextDoc = { ...doc, handlingMode: mode, insurance }
  return {
    handlingMode: mode,
    insurance,
    status: statusAfterWorkflowChange(nextDoc, previousMode),
  }
}

export function applyWorkflowPatch(
  doc: ApplicantDocumentItem,
  patch: Partial<ApplicantDocumentItem>,
): ApplicantDocumentItem {
  const next: ApplicantDocumentItem = { ...doc, ...patch }
  const seeded = seedSimpleDocumentWorkflowFields(next)
  return {
    ...seeded,
    status: patch.status ?? statusAfterWorkflowChange(seeded),
  }
}

export function simpleDocumentUploadActionLabel(documentId: SimpleDocumentRequirementId): string {
  return documentId === 'travel-ticket' ? 'Upload Ticket' : 'Upload Insurance'
}

export function downloadWorkflowDocumentFileName(doc: ApplicantDocumentItem): string | null {
  if (!hasWorkflowFile(doc)) return null
  if (doc.documentId === 'travel-ticket') return doc.travelTicket!.fileName!.trim()
  if (doc.documentId === 'insurance') return doc.insurance!.fileName!.trim()
  return null
}

export function createMockWorkflowDocumentBlob(doc: ApplicantDocumentItem, travelerName?: string): Blob {
  const fileName = downloadWorkflowDocumentFileName(doc) ?? 'document'
  const body = [
    'GLTS — mock document',
    `Document: ${doc.name}`,
    `File: ${fileName}`,
    travelerName ? `Traveler: ${travelerName}` : '',
    formatWorkflowSummary(doc) ?? '',
    `Exported: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n')
  return new Blob([body], { type: 'text/plain;charset=utf-8' })
}

export function downloadWorkflowDocument(doc: ApplicantDocumentItem, travelerName?: string): void {
  const fileName = downloadWorkflowDocumentFileName(doc)
  if (!fileName) return
  const url = URL.createObjectURL(createMockWorkflowDocumentBlob(doc, travelerName))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
