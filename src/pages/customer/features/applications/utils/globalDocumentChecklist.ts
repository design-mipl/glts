import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { GlobalDocumentUploadMeta } from '../hooks/useApplicationFlowState'

export interface GlobalChecklistDocument {
  documentId: string
  name: string
  required: boolean
}

export const REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS: GlobalChecklistDocument[] = [
  { documentId: 'loi', name: 'LOI (Letter of Intent)', required: true },
]

export function buildGlobalChecklistItems(
  uploads: Record<string, GlobalDocumentUploadMeta> | undefined,
): CustomerChecklistItem[] {
  return REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS.map(doc => ({
    id: `global-${doc.documentId}`,
    label: doc.name,
    required: doc.required,
    status: uploads?.[doc.documentId] ? 'uploaded' : 'missing',
  }))
}
