import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'
import type { GlobalDocumentUploadMeta } from '../hooks/useApplicationFlowState'
import { isApplicantDocumentPreviewable } from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  getCommonDocumentChecklistItems,
  resolveJurisdictionIdByName,
  resolveOfferingIdsByLabels,
} from '@/shared/services/countryMasterService'

export interface GlobalChecklistDocument {
  documentId: string
  name: string
  required: boolean
}

export interface ResolveGlobalChecklistInput {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  countryLabel?: string
  visaTypeLabel?: string
  jurisdictionName?: string
}

export function resolveGlobalChecklistDocuments(
  input: ResolveGlobalChecklistInput = {},
): GlobalChecklistDocument[] {
  const ids =
    input.countryId && input.visaOfferingId
      ? { countryId: input.countryId, visaOfferingId: input.visaOfferingId }
      : input.countryLabel && input.visaTypeLabel
        ? resolveOfferingIdsByLabels(input.countryLabel, input.visaTypeLabel)
        : undefined

  if (!ids) return []

  const jurisdictionId =
    input.jurisdictionId ||
    resolveJurisdictionIdByName(ids.countryId, ids.visaOfferingId, input.jurisdictionName)

  return getCommonDocumentChecklistItems(ids.countryId, ids.visaOfferingId, jurisdictionId)
}

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
  resolvedDocs?: GlobalChecklistDocument[],
): CustomerChecklistItem[] {
  if (documents && documents.length > 0) {
    return documents.map(mapDocumentToChecklistItem)
  }

  return (resolvedDocs ?? []).map(doc => ({
    id: `global-${doc.documentId}`,
    label: doc.name,
    required: doc.required,
    status: uploads?.[doc.documentId] ? 'under_review' : 'pending',
    previewable: Boolean(uploads?.[doc.documentId]),
  }))
}
