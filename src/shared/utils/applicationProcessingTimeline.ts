import { statusMasterService } from '@/shared/services/statusMasterService'
import {
  APPLICATION_PROCESSING_STAGE_LABELS,
  APPLICATION_PROCESSING_STAGE_ORDER,
  type ApplicationProcessingStageDates,
  type ApplicationProcessingStageId,
  type ApplicationProcessingTimelineStatus,
  type ApplicationProcessingTimelineStep,
} from '@/shared/types/applicationProcessingTimeline'
import type { WorkflowMaster, WorkflowStatusStep } from '@/shared/types/workflowMaster'
import { resolveApplicationWorkflow } from '@/shared/utils/countryWorkflowUtils'

export interface BuildApplicationProcessingTimelineInput {
  stageDates?: ApplicationProcessingStageDates
  docsDone: boolean
  isSubmitted: boolean
  externalPortalSubmitted?: boolean
  allVerified?: boolean
  hasRejection?: boolean
  /** Prefer explicit workflow; otherwise resolve from country / visa labels. */
  workflowId?: string
  countryId?: string
  countryName?: string
  visaTypeLabel?: string
  visaOfferingId?: string
  operationalStatus?: string
  processingStage?: string
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
  id: string,
  status: ApplicationProcessingTimelineStatus,
  stageDates?: ApplicationProcessingStageDates,
): string | undefined {
  if (status === 'pending') return undefined
  return formatProcessingStageDate(stageDates?.[id])
}

function buildLegacyApplicationProcessingTimeline(
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

function statusStepMatchesToken(statusId: string, statusName: string, token: string): boolean {
  const id = statusId.toLowerCase()
  const name = statusName.toLowerCase()
  const t = token.toLowerCase()
  return id.includes(t) || name.includes(t.replace(/-/g, ' '))
}

function progressTokensForWorkflow(input: BuildApplicationProcessingTimelineInput): string[] {
  const {
    docsDone,
    isSubmitted,
    externalPortalSubmitted = false,
    allVerified = false,
    hasRejection = false,
    operationalStatus = '',
    processingStage = '',
  } = input

  const stage = processingStage.toLowerCase()
  const operational = operationalStatus.toLowerCase()
  const submitted = externalPortalSubmitted || isSubmitted
  const appointmentBooked =
    externalPortalSubmitted ||
    (allVerified && isSubmitted && !hasRejection) ||
    operational === 'appointment booked' ||
    stage.includes('appointment')
  const embassyActive =
    submitted &&
    (externalPortalSubmitted ||
      appointmentBooked ||
      operational === 'under review' ||
      operational === 'submitted' ||
      stage.includes('embassy'))
  const visaDecided =
    operational === 'completed' ||
    operational === 'passport ready' ||
    stage.includes('passport') ||
    stage.includes('visa')
  const passportCollected =
    operational === 'passport ready' ||
    operational === 'completed' ||
    stage.includes('passport')
  const dispatchDone = stage.includes('dispatch') || operational === 'completed'
  const delivered =
    operational === 'completed' || stage.includes('delivered') || stage.includes('closed')

  const tokens: string[] = []
  if (docsDone) {
    tokens.push('all-documents-received')
    if (allVerified || submitted || operational.includes('review') || operational.includes('verification')) {
      tokens.push('documents-under-review')
    }
  }
  if (submitted) {
    tokens.push(
      'ready-for-online-submission',
      'online-submission-done',
      'ready-for-offline-submission',
      'offline-submission-done',
    )
  }
  if (appointmentBooked) tokens.push('appointment-scheduled')
  if (embassyActive) {
    tokens.push('awaiting-online-approval', 'under-embassy', 'embassy')
  }
  if (visaDecided) tokens.push('visa-status')
  if (passportCollected) tokens.push('passport-collected', 'passport-ready')
  if (dispatchDone) tokens.push('dispatch')
  if (delivered) tokens.push('delivered')
  if (hasRejection || operational.includes('refus') || operational.includes('correction')) {
    tokens.push('visa-status-refused', 'refused')
  }
  return tokens
}

function isStepCompletedByProgress(
  step: WorkflowStatusStep,
  tokens: string[],
): boolean {
  const statusName = statusMasterService.getById(step.statusId)?.name ?? step.statusId
  return tokens.some((token) => statusStepMatchesToken(step.statusId, statusName, token))
}

function workflowStepDate(
  statusId: string,
  status: ApplicationProcessingTimelineStatus,
  stageDates?: ApplicationProcessingStageDates,
): string | undefined {
  if (status === 'pending' || !stageDates) return undefined

  const direct = stageDates[statusId]
  if (direct) return formatProcessingStageDate(direct)

  const aliases: Array<[string, ApplicationProcessingStageId | string]> = [
    ['all-documents-received', 'ready'],
    ['documents-under-review', 'ready'],
    ['ready-for-online', 'submitted'],
    ['online-submission-done', 'submitted'],
    ['ready-for-offline', 'submitted'],
    ['offline-submission-done', 'submitted'],
    ['appointment', 'appointment'],
    ['embassy', 'embassy'],
    ['visa-status', 'embassy'],
    ['passport', 'passport-ready'],
    ['dispatch', 'dispatch'],
    ['delivered', 'delivered'],
  ]

  for (const [needle, key] of aliases) {
    if (statusId.includes(needle) && stageDates[key]) {
      return formatProcessingStageDate(stageDates[key])
    }
  }
  return undefined
}

function buildWorkflowDrivenTimeline(
  workflow: WorkflowMaster,
  input: BuildApplicationProcessingTimelineInput,
): ApplicationProcessingTimelineStep[] {
  const steps = [...workflow.steps].sort((a, b) => a.sequence - b.sequence)
  if (steps.length === 0) return buildLegacyApplicationProcessingTimeline(input)

  const tokens = progressTokensForWorkflow(input)
  let firstPendingIndex = steps.findIndex((step) => !isStepCompletedByProgress(step, tokens))
  if (firstPendingIndex < 0) firstPendingIndex = steps.length

  const allDone = firstPendingIndex >= steps.length

  return steps.map((step, index) => {
    const label = statusMasterService.getById(step.statusId)?.name ?? step.statusId
    let status: ApplicationProcessingTimelineStatus
    if (allDone || index < firstPendingIndex) {
      status = 'completed'
    } else if (index === firstPendingIndex) {
      status = 'active'
    } else {
      status = 'pending'
    }

    return {
      id: step.statusId,
      label,
      status,
      date: workflowStepDate(step.statusId, status, input.stageDates),
    }
  })
}

export function buildApplicationProcessingTimeline(
  input: BuildApplicationProcessingTimelineInput,
): ApplicationProcessingTimelineStep[] {
  const workflow = resolveApplicationWorkflow({
    workflowId: input.workflowId,
    countryId: input.countryId,
    countryName: input.countryName,
    visaTypeLabel: input.visaTypeLabel,
    visaOfferingId: input.visaOfferingId,
  })

  if (workflow?.steps.length) {
    return buildWorkflowDrivenTimeline(workflow, input)
  }

  return buildLegacyApplicationProcessingTimeline(input)
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
    workflowId?: string
    countryId?: string
    countryName?: string
    visaTypeLabel?: string
    visaOfferingId?: string
    operationalStatus?: string
    processingStage?: string
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
    workflowId: options.workflowId,
    countryId: options.countryId,
    countryName: options.countryName,
    visaTypeLabel: options.visaTypeLabel,
    visaOfferingId: options.visaOfferingId,
    operationalStatus: options.operationalStatus,
    processingStage: options.processingStage,
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
