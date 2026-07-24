import type {
  ApplicantDocumentItem,
  ApplicantDocumentStatus,
  UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { buildProcessingTimelineFromQueueRow } from '@/shared/utils/applicationProcessingTimeline'
import { isApplicantDocumentSatisfied } from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { BadgeProps } from '@/design-system/UIComponents/Display/Badge'

export type VerifyDocumentBadgeLabel = 'Pending' | 'Rejected' | 'Verified'

export type VerifyOriginalDocumentBadgeLabel = 'Pending' | 'Received' | 'Rejected' | 'Verified'

function toVerifyDocumentBadgeLabel(status: ApplicantDocumentStatus): VerifyDocumentBadgeLabel {
  if (status === 'verified') return 'Verified'
  if (status === 'rejected') return 'Rejected'
  return 'Pending'
}

export function buildVerifyTimeline(
  row: UploadQueueRow | null,
  isSubmitted: boolean,
  externalPortalSubmitted = false,
  context?: {
    countryId?: string
    countryName?: string
    visaTypeLabel?: string
    visaOfferingId?: string
    operationalStatus?: string
    processingStage?: string
  },
): ApplicationProcessingTimelineStep[] {
  const required = row?.documents.filter((doc) => doc.required) ?? []
  const docsDone =
    required.length === 0 || required.every((doc) => isApplicantDocumentSatisfied(doc))
  const allVerified = required.length > 0 && required.every((doc) => doc.status === 'verified')
  const hasRejection = required.some(
    (doc) => doc.status === 'rejected' || doc.status === 'needs_review',
  )

  return buildProcessingTimelineFromQueueRow(row, {
    isSubmitted,
    externalPortalSubmitted,
    docsDone,
    allVerified,
    hasRejection,
    countryId: context?.countryId,
    countryName: context?.countryName,
    visaTypeLabel: context?.visaTypeLabel,
    visaOfferingId: context?.visaOfferingId,
    operationalStatus: context?.operationalStatus,
    processingStage: context?.processingStage,
  })
}

export function documentBadgeColor(
  status: ApplicantDocumentStatus,
  doc?: ApplicantDocumentItem,
): BadgeProps['color'] {
  const label = toVerifyDocumentBadgeLabel(doc?.status ?? status)

  if (label === 'Verified') return 'success'
  if (label === 'Rejected') return 'error'
  return 'warning'
}

export function verifyDocumentBadgeLabel(doc: ApplicantDocumentItem): VerifyDocumentBadgeLabel {
  return toVerifyDocumentBadgeLabel(doc.status)
}

export function verifyOriginalDocumentBadgeLabel(
  doc: ApplicantDocumentItem,
): VerifyOriginalDocumentBadgeLabel {
  if (doc.status === 'verified') return 'Verified'
  if (doc.status === 'rejected') return 'Rejected'
  if (doc.originalDocumentReceived) return 'Received'
  return 'Pending'
}

export function originalDocumentBadgeColor(
  doc: ApplicantDocumentItem,
): BadgeProps['color'] {
  const label = verifyOriginalDocumentBadgeLabel(doc)
  if (label === 'Verified') return 'success'
  if (label === 'Rejected') return 'error'
  if (label === 'Received') return 'info'
  return 'warning'
}

export function isOriginalVerifyDocument(doc: ApplicantDocumentItem): boolean {
  return doc.originalDocument === true
}

export interface VerifyOverviewData {
  gltsApplicationId?: string
  gltsBatchId?: string
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel?: string
  jurisdiction?: string
  travelDate: string
  travelerCount: number
}

export interface VerifyRejectedDocumentEntry {
  document: ApplicantDocumentItem
  scope: 'traveler' | 'global'
  travelerId?: string
  travelerName?: string
}

export function isRejectedVerifyDocument(doc: ApplicantDocumentItem): boolean {
  return doc.status === 'rejected'
}

export function collectRejectedVerifyDocuments(
  rows: UploadQueueRow[],
  globalDocuments: ApplicantDocumentItem[],
): VerifyRejectedDocumentEntry[] {
  const entries: VerifyRejectedDocumentEntry[] = []

  for (const row of rows.filter(r => r.status !== 'processing')) {
    for (const document of row.documents) {
      if (!isRejectedVerifyDocument(document)) continue
      entries.push({
        document,
        scope: 'traveler',
        travelerId: row.id,
        travelerName: row.travelerName,
      })
    }
  }

  for (const document of globalDocuments) {
    if (!isRejectedVerifyDocument(document)) continue
    entries.push({
      document,
      scope: 'global',
    })
  }

  return entries
}

export type VerifyTravelerListFilter = 'all' | 'pending' | 'completed' | 'correction'

export type VerifyTravelerTone = 'completed' | 'pending' | 'correction'

export interface VerifyTravelerDocProgress {
  verified: number
  total: number
  tone: VerifyTravelerTone
  label: string
}

export function getTravelerDocProgress(row: UploadQueueRow): VerifyTravelerDocProgress {
  const required = row.documents.filter(doc => doc.required && !isOriginalVerifyDocument(doc))
  const total = required.length > 0 ? required.length : row.documentsTotal
  const verified =
    required.length > 0
      ? required.filter(doc => doc.status === 'verified').length
      : row.documentsComplete
  const hasCorrection = row.documents.some(
    doc => doc.status === 'rejected' || doc.status === 'needs_review',
  )
  const missingCount =
    required.length > 0
      ? required.filter(doc => doc.status === 'missing').length
      : Math.max(0, total - verified)

  if (hasCorrection) {
    return {
      verified,
      total,
      tone: 'correction',
      label: missingCount > 0 && verified === 0 ? 'Missing' : `${verified}/${total}`,
    }
  }

  if (total > 0 && verified >= total) {
    return { verified, total, tone: 'completed', label: 'Completed' }
  }

  if (missingCount === total && total > 0) {
    return { verified, total, tone: 'correction', label: 'Missing' }
  }

  return {
    verified,
    total,
    tone: 'pending',
    label: total > 0 ? `${verified}/${total}` : '—',
  }
}

export function getTravelerVerifyBucket(
  row: UploadQueueRow,
): Exclude<VerifyTravelerListFilter, 'all'> {
  const progress = getTravelerDocProgress(row)
  if (progress.tone === 'completed') return 'completed'
  if (progress.tone === 'correction') return 'correction'
  return 'pending'
}

export function filterVerifyTravelers(
  rows: UploadQueueRow[],
  search: string,
  filter: VerifyTravelerListFilter,
): UploadQueueRow[] {
  const q = search.trim().toLowerCase()
  return rows.filter(row => {
    if (filter !== 'all' && getTravelerVerifyBucket(row) !== filter) return false
    if (!q) return true
    const haystack = [
      row.travelerName,
      row.passportNo,
      row.gltsApplicantId,
      row.nationality,
      row.basicDetails?.passportNumber,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function countVerifyTravelerBuckets(
  rows: UploadQueueRow[],
): Record<VerifyTravelerListFilter, number> {
  const counts: Record<VerifyTravelerListFilter, number> = {
    all: rows.length,
    pending: 0,
    completed: 0,
    correction: 0,
  }
  for (const row of rows) {
    counts[getTravelerVerifyBucket(row)] += 1
  }
  return counts
}

export function buildOverviewFromDetail(
  applicationId: string,
  isBulk: boolean,
  rows: UploadQueueRow[],
  app?: {
    country?: string
    countryFlag?: string
    visaType?: string
    travelDate?: string
    jurisdiction?: string
  } | null,
): VerifyOverviewData {
  const readyRows = rows.filter(r => r.status !== 'processing')
  const firstRow = rows[0]
  const batchId = isBulk ? applicationId : undefined
  const rowAppId = firstRow?.gltsApplicationId?.trim() || undefined
  return {
    gltsApplicationId: isBulk
      ? rowAppId && rowAppId !== batchId
        ? rowAppId
        : undefined
      : rowAppId ?? applicationId,
    gltsBatchId: batchId,
    countryName: app?.country ?? '—',
    countryFlag: app?.countryFlag ?? '',
    visaTypeLabel: app?.visaType ?? '—',
    jurisdiction: app?.jurisdiction?.trim() || undefined,
    travelDate: app?.travelDate ?? '—',
    travelerCount: readyRows.length || rows.length,
  }
}
