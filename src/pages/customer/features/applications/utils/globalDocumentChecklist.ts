import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'
import type { GlobalDocumentUploadMeta } from '../hooks/useApplicationFlowState'
import { isApplicantDocumentPreviewable } from '@/shared/utils/applicantDocumentWorkflowUtils'

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
        : doc.status === 'rejected'
          ? 'invalid'
          : doc.status === 'needs_review' || doc.status === 'uploaded'
            ? 'under_review'
            : 'pending',
    reviewComment: doc.reviewComment,
    previewable: isApplicantDocumentPreviewable(doc),
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
    status: uploads?.[doc.documentId] ? 'under_review' : 'pending',
    previewable: Boolean(uploads?.[doc.documentId]),
  }))
}
