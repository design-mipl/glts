import {
  documentStatusLabel,
  isApplicantDocumentPreviewable,
  isSimpleDocumentRequirement,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { CustomerChecklistItemStatus } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { ApplicationSubmitKind, UploadQueueRow } from '../data/applicationFlowData'

export interface ChecklistCorrectionRef {
  field: string
  reason: string
}

/** One processed listing → single application; more than one → bulk batch. */
export function deriveApplicationSubmitKind(rows: UploadQueueRow[]): ApplicationSubmitKind {
  const ready = rows.filter(r => r.status !== 'processing')
  return ready.length <= 1 ? 'single' : 'bulk'
}

function findCorrectionForChecklistItem(
  item: { label: string },
  corrections: ChecklistCorrectionRef[],
  travelerName?: string,
  scope: 'traveler' | 'global' = 'traveler',
): ChecklistCorrectionRef | undefined {
  const labelKey = item.label.toLowerCase()

  return corrections.find(correction => {
    const field = correction.field.toLowerCase()
    const isGlobal = field.includes('global')
    if (scope === 'global' && !isGlobal) return false
    if (scope === 'traveler' && isGlobal) return false

    const documentLabel = field.split(' · ')[0]?.trim() ?? field
    const labelMatch =
      field.includes(labelKey) ||
      labelKey.includes(documentLabel) ||
      documentLabel.includes(labelKey.split('(')[0].trim())

    if (!labelMatch) return false
    if (!travelerName || scope === 'global') return true
    return field.includes(travelerName.toLowerCase())
  })
}

export function enrichChecklistWithCorrections<
  T extends {
    id: string
    label: string
    required: boolean
    status: CustomerChecklistItemStatus
    reviewComment?: string
  },
>(items: T[], corrections: ChecklistCorrectionRef[], travelerName?: string): T[] {
  return items.map(item => {
    if (item.reviewComment?.trim()) return item
    if (item.status !== 'invalid' && item.status !== 'missing' && item.status !== 'pending') return item

    const match = findCorrectionForChecklistItem(item, corrections, travelerName, 'traveler')
    if (match?.reason?.trim()) {
      return { ...item, reviewComment: match.reason.trim() }
    }

    if (item.status === 'invalid') {
      return {
        ...item,
        reviewComment: 'Please re-upload this document per GLTS team instructions.',
      }
    }

    return item
  })
}

export function enrichGlobalChecklistWithCorrections<
  T extends {
    id: string
    label: string
    required?: boolean
    status: CustomerChecklistItemStatus
    reviewComment?: string
  },
>(items: T[], corrections: ChecklistCorrectionRef[]): T[] {
  return items.map(item => {
    if (item.reviewComment?.trim()) return item
    if (item.status !== 'invalid' && item.status !== 'missing' && item.status !== 'pending') return item

    const match = findCorrectionForChecklistItem(item, corrections, undefined, 'global')
    if (match?.reason?.trim()) {
      return { ...item, reviewComment: match.reason.trim() }
    }

    if (item.status === 'invalid') {
      return {
        ...item,
        reviewComment: 'Please re-upload this document per GLTS team instructions.',
      }
    }

    return item
  })
}

function mapDocToChecklistStatus(doc: UploadQueueRow['documents'][number]): CustomerChecklistItemStatus {
  if (doc.status === 'verified') return 'verified'
  if (doc.status === 'rejected') return 'invalid'
  if (doc.status === 'needs_review') return 'under_review'
  if (isSimpleDocumentRequirement(doc.documentId)) {
    const label = documentStatusLabel(doc)
    if (
      label === 'Uploaded by Customer' ||
      label === 'Arranged by GLTS' ||
      label.includes('Uploaded by GLTS')
    ) {
      return 'under_review'
    }
    if (label.includes('Pending GLTS') || label === 'Customer Will Upload') {
      return 'pending'
    }
    if (label === 'Not Selected') return 'pending'
  }
  if (doc.status === 'uploaded') return 'under_review'
  return 'pending'
}

export function checklistItemsFromRowDocuments(
  documents: UploadQueueRow['documents'],
): Array<{
  id: string
  label: string
  required: boolean
  status: CustomerChecklistItemStatus
  statusLabel?: string
  reviewComment?: string
}> {
  return documents.map(doc => ({
    id: doc.documentId,
    label: doc.name,
    required: doc.required,
    status: mapDocToChecklistStatus(doc),
    statusLabel: isSimpleDocumentRequirement(doc.documentId) ? documentStatusLabel(doc) : undefined,
    reviewComment: doc.reviewComment,
    previewable: isApplicantDocumentPreviewable(doc),
  }))
}
