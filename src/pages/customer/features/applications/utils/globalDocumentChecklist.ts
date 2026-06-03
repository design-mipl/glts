import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'
import type { GlobalDocumentUploadMeta } from '../hooks/useApplicationFlowState'

export interface GlobalChecklistDocument {
  documentId: string
  name: string
  required: boolean
}

export const REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS: GlobalChecklistDocument[] = [
  { documentId: 'loi', name: 'LOI (Letter of Intent)', required: true },
]

function mapDocumentToChecklistItem(doc: ApplicantDocumentItem): CustomerChecklistItem {
  return {
    id: `global-${doc.documentId}`,
    label: doc.name,
    required: doc.required,
    status:
      doc.status === 'verified'
        ? 'verified'
        : doc.status === 'uploaded'
          ? 'uploaded'
          : doc.status === 'rejected' || doc.status === 'needs_review'
            ? 'invalid'
            : 'missing',
    reviewComment: doc.reviewComment,
  }
}

export function buildGlobalChecklistItems(
  uploads: Record<string, GlobalDocumentUploadMeta> | undefined,
  documents?: ApplicantDocumentItem[],
): CustomerChecklistItem[] {
  if (documents && documents.length > 0) {
    return documents.map(mapDocumentToChecklistItem)
  }

  return REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS.map(doc => ({
    id: `global-${doc.documentId}`,
    label: doc.name,
    required: doc.required,
    status: uploads?.[doc.documentId] ? 'uploaded' : 'missing',
  }))
}
