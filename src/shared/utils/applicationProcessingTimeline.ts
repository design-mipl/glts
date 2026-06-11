import {
  APPLICATION_PROCESSING_STAGE_LABELS,
  APPLICATION_PROCESSING_STAGE_ORDER,
  type ApplicationProcessingStageDates,
  type ApplicationProcessingStageId,
  type ApplicationProcessingTimelineStatus,
  type ApplicationProcessingTimelineStep,
} from '@/shared/types/applicationProcessingTimeline'

export interface BuildApplicationProcessingTimelineInput {
  stageDates?: ApplicationProcessingStageDates
  docsDone: boolean
  isSubmitted: boolean
  externalPortalSubmitted?: boolean
  allVerified?: boolean
  hasRejection?: boolean
}

export interface ProcessingStageDateSource {
  createdAt?: string
  submissionDate?: string
  appointmentDate?: string
  lastUpdated?: string
  operationalStatus?: string
  processingStage?: string
  processingStageDates?: ApplicationProcessingStageDates
}

export function formatProcessingStageDate(iso?: string): string | undefined {
  if (!iso?.trim()) return undefined
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function deriveProcessingStageDates(
  source: ProcessingStageDateSource,
): ApplicationProcessingStageDates {
  if (source.processingStageDates) {
    return { ...source.processingStageDates }
  }

  const dates: ApplicationProcessingStageDates = {}
  const stage = source.processingStage?.toLowerCase() ?? ''
  const operational = source.operationalStatus ?? ''

  if (source.createdAt) {
    dates.ready = source.createdAt
  }

  if (source.submissionDate) {
    dates.submitted = source.submissionDate
  }

  if (source.appointmentDate) {
    dates.appointment = source.appointmentDate
  }

  if (
    stage.includes('embassy') ||
    operational === 'Under Review' ||
    operational === 'Submitted' ||
    operational === 'Verification Pending'
  ) {
    dates.embassy = dates.embassy ?? source.lastUpdated ?? source.submissionDate
  }

  if (stage.includes('passport') || operational === 'Passport Ready') {
    dates['passport-ready'] = dates['passport-ready'] ?? source.lastUpdated
  }

  if (stage.includes('dispatch')) {
    dates.dispatch = dates.dispatch ?? source.lastUpdated
  }

  if (operational === 'Completed' || stage.includes('closed') || stage.includes('delivered')) {
    dates.delivered = dates.delivered ?? source.lastUpdated
  }

  if (operational === 'Appointment Booked' && !dates.appointment) {
    dates.appointment = source.appointmentDate ?? source.lastUpdated
  }

  return dates
}

function stageDateForStep(
  id: ApplicationProcessingStageId,
  status: ApplicationProcessingTimelineStatus,
  stageDates?: ApplicationProcessingStageDates,
): string | undefined {
  if (status === 'pending') return undefined
  return formatProcessingStageDate(stageDates?.[id])
}

export function buildApplicationProcessingTimeline(
  input: BuildApplicationProcessingTimelineInput,
): ApplicationProcessingTimelineStep[] {
  const {
    stageDates,
    docsDone,
    isSubmitted,
    externalPortalSubmitted = false,
    allVerified = false,
    hasRejection = false,
  } = input

  const submitted: ApplicationProcessingTimelineStatus =
    externalPortalSubmitted || isSubmitted ? 'completed' : docsDone ? 'active' : 'pending'
  const appointmentBooked =
    externalPortalSubmitted || (allVerified && isSubmitted && !hasRejection)
  const embassyStageActive = externalPortalSubmitted || appointmentBooked
  const passportReady = false
  const dispatch = false
  const delivered = false

  const statuses: Record<ApplicationProcessingStageId, ApplicationProcessingTimelineStatus> = {
    ready: docsDone ? 'completed' : 'active',
    submitted: externalPortalSubmitted || isSubmitted ? 'completed' : docsDone ? 'active' : 'pending',
    appointment: appointmentBooked ? 'completed' : submitted === 'completed' ? 'active' : 'pending',
    embassy: externalPortalSubmitted || appointmentBooked ? 'active' : 'pending',
    'passport-ready': passportReady ? 'completed' : embassyStageActive ? 'active' : 'pending',
    dispatch: dispatch ? 'completed' : passportReady ? 'active' : 'pending',
    delivered: delivered ? 'completed' : dispatch ? 'active' : 'pending',
  }

  return APPLICATION_PROCESSING_STAGE_ORDER.map((id) => {
    const status = statuses[id]
    return {
      id,
      label: APPLICATION_PROCESSING_STAGE_LABELS[id],
      status,
      date: stageDateForStep(id, status, stageDates),
    }
  })
}

export function buildProcessingTimelineFromQueueRow(
  row: {
    documents: Array<{ required: boolean; status: string }>
    processingStageDates?: ApplicationProcessingStageDates
  } | null,
  options: {
    isSubmitted?: boolean
    externalPortalSubmitted?: boolean
    docsDone?: boolean
    allVerified?: boolean
    hasRejection?: boolean
  } = {},
): ApplicationProcessingTimelineStep[] {
  const required = row?.documents.filter((doc) => doc.required) ?? []
  const docsDone =
    options.docsDone ??
    (required.length === 0 ||
      required.every((doc) => doc.status === 'uploaded' || doc.status === 'verified'))
  const allVerified =
    options.allVerified ??
    (required.length > 0 && required.every((doc) => doc.status === 'verified'))
  const hasRejection =
    options.hasRejection ??
    required.some((doc) => doc.status === 'rejected' || doc.status === 'needs_review')

  return buildApplicationProcessingTimeline({
    stageDates: row?.processingStageDates,
    docsDone,
    isSubmitted: options.isSubmitted ?? false,
    externalPortalSubmitted: options.externalPortalSubmitted ?? false,
    allVerified,
    hasRejection,
  })
}

export function mapProcessingTimelineToCustomerTracking(
  steps: ApplicationProcessingTimelineStep[],
): Array<{
  id: string
  title: string
  status: 'completed' | 'in_progress' | 'pending'
  date?: string
}> {
  return steps.map((step) => ({
    id: step.id,
    title: step.label,
    status:
      step.status === 'completed'
        ? 'completed'
        : step.status === 'active'
          ? 'in_progress'
          : 'pending',
    date: step.date,
  }))
}
