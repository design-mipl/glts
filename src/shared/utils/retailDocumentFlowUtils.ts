import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'

/** Collected in retail extras steps — never in the filing checklist. */
export const RETAIL_EXTRAS_DOCUMENT_IDS = new Set(['travel-ticket', 'insurance'])

export function isRetailExtrasDocument(documentId: string): boolean {
  return RETAIL_EXTRAS_DOCUMENT_IDS.has(documentId)
}

export function filterRetailChecklistDocuments(
  documents: RetailChecklistDocument[],
): RetailChecklistDocument[] {
  return documents.filter((doc) => !isRetailExtrasDocument(doc.documentId))
}

export function checklistUploadKey(applicantId: string, documentId: string): string {
  return `${applicantId}__${documentId}`
}

function isIdentityCaptureDoc(documentId: string): 'photo' | 'passport' | null {
  const id = documentId.toLowerCase()
  if (id === 'photo' || id === 'photograph') return 'photo'
  if (id.includes('photo') && !id.includes('passport')) return 'photo'
  if (id === 'passport') return 'passport'
  if (id.includes('passport') && !/old|stamp|back|front|all|pages/.test(id)) return 'passport'
  return null
}

export interface RetailTravellerUploadState {
  id: string
  photo?: unknown
  passport?: unknown
}

export interface RetailCapturedUpload {
  dataUrl: string
  capturedAt: string
}

export function isRetailDocumentUploadComplete(
  documentId: string,
  applicant: RetailTravellerUploadState,
  uploads: Record<string, RetailCapturedUpload>,
): boolean {
  const identity = isIdentityCaptureDoc(documentId)
  if (identity === 'photo' && applicant.photo) return true
  if (identity === 'passport' && applicant.passport) return true
  return Boolean(
    uploads[checklistUploadKey(applicant.id, documentId)] || uploads[documentId],
  )
}

export function isRetailChecklistDocumentComplete(
  doc: RetailChecklistDocument,
  applicant: RetailTravellerUploadState,
  uploads: Record<string, RetailCapturedUpload>,
): boolean {
  return isRetailDocumentUploadComplete(doc.documentId, applicant, uploads)
}

export function resolveRetailOriginalDocumentIds(
  documents: RetailChecklistDocument[],
): string[] {
  return documents.filter((doc) => doc.originalDocument).map((doc) => doc.documentId)
}
