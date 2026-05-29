import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/pages/customer/features/applications/components/ApplicationProcessingTimeline'
import type { SubmitTimelineStatus } from '@/pages/customer/features/applications/types/applicationDetail.types'
import { adminDocumentBadgeStatus } from '@/shared/services/applicationVerificationService'
import type { ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { BadgeProps } from '@/design-system/UIComponents/Display/Badge'

export function buildVerifyTimeline(
  row: UploadQueueRow | null,
  isSubmitted: boolean,
  externalPortalSubmitted = false,
): ApplicationProcessingTimelineStep[] {
  const required = row?.documents.filter(d => d.required) ?? []
  const docsDone =
    required.length === 0 ||
    required.every(d => d.status === 'verified' || d.status === 'uploaded')
  const allVerified = required.length > 0 && required.every(d => d.status === 'verified')
  const hasRejection = required.some(d => d.status === 'rejected' || d.status === 'needs_review')

  const submitted: SubmitTimelineStatus =
    externalPortalSubmitted || isSubmitted ? 'completed' : docsDone ? 'active' : 'pending'
  const appointmentBooked = externalPortalSubmitted || (allVerified && isSubmitted && !hasRejection)
  const embassyStageActive = externalPortalSubmitted || appointmentBooked
  const passportReady = false
  const dispatch = false
  const delivered = false

  return [
    {
      id: 'ready',
      label: 'Ready of submission',
      status: docsDone ? 'completed' : 'active',
    },
    {
      id: 'submitted',
      label: 'Submitted',
      status: externalPortalSubmitted || isSubmitted ? 'completed' : docsDone ? 'active' : 'pending',
    },
    {
      id: 'appointment',
      label: 'Appointment booked',
      status: appointmentBooked ? 'completed' : submitted === 'completed' ? 'active' : 'pending',
    },
    {
      id: 'embassy',
      label: 'Embassy processing',
      status: externalPortalSubmitted || appointmentBooked ? 'active' : 'pending',
    },
    {
      id: 'passport-ready',
      label: 'Passport ready',
      status: passportReady ? 'completed' : embassyStageActive ? 'active' : 'pending',
    },
    {
      id: 'dispatch',
      label: 'Dispatch',
      status: dispatch ? 'completed' : passportReady ? 'active' : 'pending',
    },
    {
      id: 'delivered',
      label: 'Delivered',
      status: delivered ? 'completed' : dispatch ? 'active' : 'pending',
    },
  ]
}

export function documentBadgeColor(
  status: ApplicantDocumentStatus,
): BadgeProps['color'] {
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

export interface VerifyOverviewData {
  gltsApplicationId?: string
  gltsBatchId?: string
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel?: string
  travelDate: string
  travelerCount: number
}

export function buildOverviewFromDetail(
  applicationId: string,
  isBulk: boolean,
  rows: UploadQueueRow[],
  app?: { country?: string; countryFlag?: string; visaType?: string; travelDate?: string } | null,
): VerifyOverviewData {
  const readyRows = rows.filter(r => r.status !== 'processing')
  const firstRow = rows[0]
  return {
    gltsApplicationId: firstRow?.gltsApplicationId ?? applicationId,
    gltsBatchId: isBulk ? applicationId : undefined,
    countryName: app?.country ?? '—',
    countryFlag: app?.countryFlag ?? '',
    visaTypeLabel: app?.visaType ?? '—',
    travelDate: app?.travelDate ?? '—',
    travelerCount: readyRows.length || rows.length,
  }
}
