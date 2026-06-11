import type {
  ApplicantDocumentItem,
  ApplicantDocumentStatus,
  UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { buildProcessingTimelineFromQueueRow } from '@/shared/utils/applicationProcessingTimeline'
import { adminDocumentBadgeStatus } from '@/shared/services/applicationVerificationService'
import {
  documentStatusLabel,
  isApplicantDocumentSatisfied,
  isSimpleDocumentRequirement,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { BadgeProps } from '@/design-system/UIComponents/Display/Badge'

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
  if (doc && isSimpleDocumentRequirement(doc.documentId)) {
    const label = documentStatusLabel(doc)
    if (label === 'Verified' || label === 'Arranged by GLTS') return 'success'
    if (label === 'Rejected' || label === 'Re-upload Requested') return 'error'
    if (label.includes('Uploaded') || label === 'Under Verification') return 'info'
    return 'warning'
  }
  const badge = adminDocumentBadgeStatus(status)
  switch (badge) {
    case 'verified':
      return 'success'
    case 'rejected':
      return 'error'
    case 'uploaded':
      return 'info'
    default:
      return 'warning'
  }
}

export function documentBadgeLabel(status: ApplicantDocumentStatus): string {
  const badge = adminDocumentBadgeStatus(status)
  if (badge === 'verified') return 'verified'
  if (badge === 'rejected') return 'rejected'
  if (status === 'needs_review') return 'uploaded'
  return badge
}

export function verifyDocumentBadgeLabel(doc: ApplicantDocumentItem): string {
  if (isSimpleDocumentRequirement(doc.documentId)) {
    return documentStatusLabel(doc)
  }
  return documentBadgeLabel(doc.status)
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
  return {
    gltsApplicationId: firstRow?.gltsApplicationId ?? applicationId,
    gltsBatchId: isBulk ? applicationId : undefined,
    countryName: app?.country ?? '—',
    countryFlag: app?.countryFlag ?? '',
    visaTypeLabel: app?.visaType ?? '—',
    jurisdiction: app?.jurisdiction?.trim() || undefined,
    travelDate: app?.travelDate ?? '—',
    travelerCount: readyRows.length || rows.length,
  }
}
