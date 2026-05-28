import type { ApplicationSubmitKind, UploadQueueRow } from '../data/applicationFlowData'

/** One processed listing → single application; more than one → bulk batch. */
export function deriveApplicationSubmitKind(rows: UploadQueueRow[]): ApplicationSubmitKind {
  const ready = rows.filter(r => r.status !== 'processing')
  return ready.length <= 1 ? 'single' : 'bulk'
}

export function checklistItemsFromRowDocuments(
  documents: UploadQueueRow['documents'],
): Array<{ id: string; label: string; required: boolean; status: 'uploaded' | 'missing' | 'invalid' | 'pending' }> {
  return documents.map(doc => ({
    id: doc.documentId,
    label: doc.name,
    required: doc.required,
    status:
      doc.status === 'verified' || doc.status === 'uploaded'
        ? 'uploaded'
        : doc.status === 'needs_review'
          ? 'invalid'
          : 'missing',
  }))
}
