import type { OperationalCase, OperationalCaseStatus } from '@/shared/types/operationalCaseHandling'
import type {
  ApplicationProcessingStageDates,
  ApplicationProcessingTimelineStep,
} from '@/shared/types/applicationProcessingTimeline'
import { PROCESSING_STATUS_IDS } from '@/shared/utils/applicationProcessingStatusIds'
import {
  buildApplicationProcessingTimeline,
  deriveProcessingStageDates,
} from '@/shared/utils/applicationProcessingTimeline'
import { applicationProcessingStatusService } from '@/shared/services/applicationProcessingStatusService'
import { applicationVerificationService } from '@/shared/services/applicationVerificationService'
import { statusMasterService } from '@/shared/services/statusMasterService'

/** Ground-ops milestones mapped onto Status Master / passenger timeline ids. */
export const GROUND_OPS_TIMELINE_STATUS = {
  readyForOffline: 'status-ready-for-offline-submission',
  offlineSubmissionDone: 'status-offline-submission-done',
  underEmbassy: PROCESSING_STATUS_IDS.underEmbassyReview,
  passportCollected: PROCESSING_STATUS_IDS.passportCollected,
  dispatch: PROCESSING_STATUS_IDS.dispatch,
  delivered: PROCESSING_STATUS_IDS.delivered,
} as const

export type GroundOpsTimelineMilestone =
  (typeof GROUND_OPS_TIMELINE_STATUS)[keyof typeof GROUND_OPS_TIMELINE_STATUS]

const MILESTONE_ORDER: GroundOpsTimelineMilestone[] = [
  GROUND_OPS_TIMELINE_STATUS.readyForOffline,
  GROUND_OPS_TIMELINE_STATUS.offlineSubmissionDone,
  GROUND_OPS_TIMELINE_STATUS.underEmbassy,
  GROUND_OPS_TIMELINE_STATUS.passportCollected,
  GROUND_OPS_TIMELINE_STATUS.dispatch,
  GROUND_OPS_TIMELINE_STATUS.delivered,
]

export function mapOperationalStatusToTimelineStatusId(
  status: OperationalCaseStatus,
): GroundOpsTimelineMilestone {
  switch (status) {
    case 'Completed':
      return GROUND_OPS_TIMELINE_STATUS.delivered
    case 'Dispatched':
      return GROUND_OPS_TIMELINE_STATUS.dispatch
    case 'Collected':
      return GROUND_OPS_TIMELINE_STATUS.passportCollected
    case 'Document Submitted':
      return GROUND_OPS_TIMELINE_STATUS.underEmbassy
    case 'Moved to Next Day':
    case 'Pending':
    default:
      return GROUND_OPS_TIMELINE_STATUS.readyForOffline
  }
}

/** Prefer visa decision status when recorded after collection. */
export function resolveOperationalCaseTimelineStatusId(record: OperationalCase): string {
  const outcome = record.visaOutcome?.outcome
  if (outcome === 'rejected' || outcome === 'withdrawn') {
    return PROCESSING_STATUS_IDS.visaStatusRefused
  }
  if (outcome === 'approved' && record.status === 'Collected') {
    return PROCESSING_STATUS_IDS.visaStatusApproved
  }
  return mapOperationalStatusToTimelineStatusId(record.status)
}

export function isGroundOpsMilestoneAhead(
  candidate: string,
  current: string | undefined,
): boolean {
  if (!current) return true
  const nextIndex = MILESTONE_ORDER.indexOf(candidate as GroundOpsTimelineMilestone)
  const currentIndex = MILESTONE_ORDER.indexOf(current as GroundOpsTimelineMilestone)
  if (nextIndex < 0) return true
  if (currentIndex < 0) return true
  return nextIndex > currentIndex
}

function toIsoDate(value?: string): string | undefined {
  if (!value?.trim()) return undefined
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString().slice(0, 10)
}

export function deriveOperationalCaseStageDates(
  record: OperationalCase,
): ApplicationProcessingStageDates {
  const operationalDay = toIsoDate(record.operationalDate) ?? toIsoDate(record.lastUpdated)
  const submission = toIsoDate(record.submissionDate)
  const collection = toIsoDate(record.collectionDate)
  const dispatched = toIsoDate(record.dispatchDetails?.dispatchedAt)
  const delivered = toIsoDate(record.dispatchDetails?.deliveredAt)
  const appointment = toIsoDate(record.biometricsScheduled)

  const dates: ApplicationProcessingStageDates = {
    ...deriveProcessingStageDates({
      createdAt: operationalDay,
      submissionDate: submission,
      appointmentDate: appointment,
      lastUpdated: toIsoDate(record.lastUpdated),
      processingStage: statusMasterService.getById(
        mapOperationalStatusToTimelineStatusId(record.status),
      )?.name,
      operationalStatus:
        record.status === 'Completed'
          ? 'Completed'
          : record.status === 'Collected' || record.status === 'Dispatched'
            ? 'Passport Ready'
            : record.status === 'Document Submitted'
              ? 'Under Review'
              : 'Submitted',
    }),
  }

  if (operationalDay) {
    dates.ready = dates.ready ?? operationalDay
    dates.submitted = dates.submitted ?? submission ?? operationalDay
    dates[GROUND_OPS_TIMELINE_STATUS.readyForOffline] =
      dates[GROUND_OPS_TIMELINE_STATUS.readyForOffline] ?? operationalDay
  }
  if (submission) {
    dates.submitted = submission
    dates.embassy = submission
    dates[GROUND_OPS_TIMELINE_STATUS.offlineSubmissionDone] = submission
    dates[GROUND_OPS_TIMELINE_STATUS.underEmbassy] = submission
  }
  if (appointment) {
    dates.appointment = appointment
  }
  if (collection) {
    dates['passport-ready'] = collection
    dates[GROUND_OPS_TIMELINE_STATUS.passportCollected] = collection
  }
  if (dispatched) {
    dates.dispatch = dispatched
    dates[GROUND_OPS_TIMELINE_STATUS.dispatch] = dispatched
  }
  if (delivered || record.status === 'Completed') {
    const deliveredAt = delivered ?? toIsoDate(record.lastUpdated) ?? operationalDay
    if (deliveredAt) {
      dates.delivered = deliveredAt
      dates[GROUND_OPS_TIMELINE_STATUS.delivered] = deliveredAt
    }
  }

  return dates
}

export function resolveOperationalCaseTravelerRowId(record: OperationalCase): string {
  try {
    const resolved = applicationVerificationService.resolveTravelerRowId(
      record.applicationId,
      record.gltsApplicantId,
      record.passengerSequence,
    )
    if (resolved) return resolved
  } catch {
    // Portal application may be missing for some mock ground-ops cases.
  }
  return record.gltsApplicantId || `${record.applicationId}-q${record.passengerSequence}`
}

export function buildOperationalCaseProcessingTimeline(
  record: OperationalCase,
): ApplicationProcessingTimelineStep[] {
  const travelerRowId = resolveOperationalCaseTravelerRowId(record)
  const inferredStatusId = resolveOperationalCaseTimelineStatusId(record)
  const stageDates = deriveOperationalCaseStageDates(record)
  const refused =
    record.visaOutcome?.outcome === 'rejected' || record.visaOutcome?.outcome === 'withdrawn'

  const processingState = applicationProcessingStatusService.ensureState({
    applicationId: record.applicationId,
    travelerRowId,
    docsDone: true,
    allVerified: true,
    countryName: record.country,
    visaTypeLabel: record.visaType,
    inferredStatusId,
  })

  const currentStatusId = refused
    ? inferredStatusId
    : isGroundOpsMilestoneAhead(inferredStatusId, processingState.currentStatusId)
      ? inferredStatusId
      : processingState.currentStatusId

  const statusName = statusMasterService.getById(currentStatusId)?.name

  return buildApplicationProcessingTimeline({
    stageDates,
    docsDone: true,
    isSubmitted: true,
    externalPortalSubmitted:
      record.status === 'Document Submitted' ||
      record.status === 'Collected' ||
      record.status === 'Dispatched' ||
      record.status === 'Completed',
    allVerified: true,
    hasRejection: refused,
    countryName: record.country,
    visaTypeLabel: record.visaType,
    workflowId: refused ? undefined : processingState.workflowId,
    currentStatusId,
    heldFromStatusId: processingState.heldFromStatusId,
    operationalStatus: refused
      ? 'Rejected'
      : record.status === 'Completed'
        ? 'Completed'
        : record.status === 'Collected' || record.status === 'Dispatched'
          ? 'Passport Ready'
          : record.status === 'Document Submitted'
            ? 'Under Review'
            : 'Submitted',
    processingStage: statusName,
  })
}

/** Push ground-ops milestone onto the shared passenger processing timeline (forward only). */
export function syncPassengerTimelineFromOperationalCase(record: OperationalCase): void {
  const travelerRowId = resolveOperationalCaseTravelerRowId(record)
  const nextStatusId = resolveOperationalCaseTimelineStatusId(record)
  const stageDates = deriveOperationalCaseStageDates(record)
  const outcomeNote =
    record.visaOutcome?.outcome === 'approved'
      ? 'Visa approved'
      : record.visaOutcome?.outcome === 'rejected'
        ? 'Visa rejected'
        : record.visaOutcome?.outcome === 'withdrawn'
          ? 'Application withdrawn'
          : undefined

  applicationProcessingStatusService.syncGroundOpsMilestone({
    applicationId: record.applicationId,
    travelerRowId,
    nextStatusId,
    stageDates,
    countryName: record.country,
    visaTypeLabel: record.visaType,
    note: outcomeNote
      ? `Ground operations · ${outcomeNote}`
      : `Ground operations · ${record.status}`,
  })
}
