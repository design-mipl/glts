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

/** Parent GLTS application reference — allocated when the create flow starts. e.g. GL-12345 */
export function createGltsApplicationId(): string {
  return `GL-${nextSequence()}`
}

/** Bulk wrapper under a GLTS application — allocated when 2+ travelers are uploaded. */
export function createGltsBatchId(): string {
  return createGltsApplicationId()
}

/** Per-traveler applicant reference within a bulk application. e.g. GL-12345/1 */
export function createGltsApplicantId(applicationId: string, sequenceNo: number): string {
  const base = applicationId.trim() || createGltsApplicationId()
  return `${base}/${sequenceNo}`
}

export function ensureFlowGltsApplicationId(state: ApplicationFlowState): string {
  return state.gltsApplicationId || createGltsApplicationId()
}

export function resolveFlowBatchId(
  state: ApplicationFlowState,
  travelerCount: number,
): string | undefined {
  if (travelerCount <= 1) return undefined
  return state.gltsBatchId || state.gltsApplicationId || createGltsBatchId()
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
      gltsApplicantId: row.gltsApplicantId || createGltsApplicantId(gltsApplicationId, sequenceNo),
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
    gltsApplicantId: createGltsApplicantId(gltsApplicationId, sequenceNo),
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

export function resolveApplicationReferenceDisplay(
  gltsApplicationId?: string,
  gltsBatchId?: string,
): { primaryId?: string; batchId?: string } {
  const appId = gltsApplicationId?.trim() || undefined
  const batchId = gltsBatchId?.trim() || undefined

  if (!appId && !batchId) return {}
  if (appId && batchId && appId !== batchId) return { primaryId: appId, batchId }
  return { primaryId: appId ?? batchId }
}

export function formatQueueRowGltsLabel(
  row: UploadQueueRow,
  gltsApplicationId: string | undefined,
  singleListing: boolean,
): string {
  if (singleListing && gltsApplicationId) return gltsApplicationId
  if (row.gltsApplicantId) return row.gltsApplicantId
  if (gltsApplicationId && row.sequenceNo) {
    return createGltsApplicantId(gltsApplicationId, row.sequenceNo)
  }
  return '—'
}
