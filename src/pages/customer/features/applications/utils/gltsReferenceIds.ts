import { emptyApplicantBasicDetails } from '../config/applicantBasicDetailsConfig'
import type { ApplicationFlowState } from '../hooks/useApplicationFlowState'
import type { UploadQueueRow } from '../data/applicationFlowData'

const FLOW_ID_SEQ_KEY = 'glts:flow-id-seq'

function nextSequence(): number {
  try {
    const current = Number(sessionStorage.getItem(FLOW_ID_SEQ_KEY) ?? '860')
    const next = Number.isFinite(current) ? current + 1 : 861
    sessionStorage.setItem(FLOW_ID_SEQ_KEY, String(next))
    return next
  } catch {
    return Math.floor(Date.now() % 1000) + 860
  }
}

/** Parent GLTS application reference — allocated when the create flow starts. */
export function createGltsApplicationId(): string {
  return `GLTS-APP-2026-${nextSequence()}`
}

/** Bulk wrapper under a GLTS application — allocated when 2+ travelers are uploaded. */
export function createGltsBatchId(): string {
  return `GLTS-BAT-2026-${String(nextSequence()).padStart(3, '0')}`
}

/** Per-traveler applicant reference within an application / batch. */
export function createGltsApplicantId(sequenceNo: number): string {
  return `GLTS-APL-${String(sequenceNo).padStart(3, '0')}`
}

export function ensureFlowGltsApplicationId(state: ApplicationFlowState): string {
  return state.gltsApplicationId || createGltsApplicationId()
}

export function resolveFlowBatchId(
  state: ApplicationFlowState,
  travelerCount: number,
): string | undefined {
  if (travelerCount <= 1) return undefined
  return state.gltsBatchId || createGltsBatchId()
}

export function assignApplicantReferences(
  rows: UploadQueueRow[],
  gltsApplicationId: string,
): UploadQueueRow[] {
  return rows.map((row, index) => {
    const sequenceNo = index + 1
    return {
      ...row,
      gltsApplicationId,
      sequenceNo,
      gltsApplicantId: row.gltsApplicantId || createGltsApplicantId(sequenceNo),
    }
  })
}

/** Minimal queue row for admin create when no passport upload was provided. */
export function createEmptyUploadQueueRow(
  gltsApplicationId: string,
  sequenceNo = 1,
): UploadQueueRow {
  return {
    id: `empty-${gltsApplicationId}-${sequenceNo}-${Date.now()}`,
    fileName: '',
    gltsApplicationId,
    gltsApplicantId: createGltsApplicantId(sequenceNo),
    sequenceNo,
    travelerName: '—',
    passportNo: '—',
    expiry: '—',
    nationality: '—',
    confidence: 0,
    status: 'verified',
    fields: [],
    documents: [],
    documentsComplete: 0,
    documentsTotal: 0,
    basicDetails: emptyApplicantBasicDetails(),
  }
}

export function formatQueueRowGltsLabel(
  row: UploadQueueRow,
  gltsApplicationId: string | undefined,
  singleListing: boolean,
): string {
  if (singleListing && gltsApplicationId) return gltsApplicationId
  if (row.gltsApplicantId) return row.gltsApplicantId
  if (row.sequenceNo) return createGltsApplicantId(row.sequenceNo)
  return '—'
}
