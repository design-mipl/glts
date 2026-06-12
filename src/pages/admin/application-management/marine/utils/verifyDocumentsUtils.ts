import type {
  ApplicantDocumentItem,
  ApplicantDocumentStatus,
  UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { buildProcessingTimelineFromQueueRow } from '@/shared/utils/applicationProcessingTimeline'
import { isApplicantDocumentSatisfied } from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { BadgeProps } from '@/design-system/UIComponents/Display/Badge'

export type VerifyDocumentBadgeLabel = 'Needs review' | 'Rejected' | 'Verified'

function toVerifyDocumentBadgeLabel(status: ApplicantDocumentStatus): VerifyDocumentBadgeLabel {
  if (status === 'verified') return 'Verified'
  if (status === 'rejected') return 'Rejected'
  return 'Needs review'
}

export function buildVerifyTimeline(
  row: UploadQueueRow | null,
  isSubmitted: boolean,
  externalPortalSubmitted = false,
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
