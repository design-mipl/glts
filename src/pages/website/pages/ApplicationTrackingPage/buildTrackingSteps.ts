import type { StatusStepConfig, StatusStepState } from '@/pages/website/components/statusStepper/types'
import type {
  ApplicationTrackingStatus,
  TrackedApplication,
  TrackingStageId,
} from './data/applicationTrackingMock'

interface StageDefinition {
  id: TrackingStageId
  label: string
  pendingDescription: string
  /** Only included when requiresPhysicalDocuments is true (Collection Method path). */
  physicalOnly?: boolean
}

/**
 * Canonical tracking stages. Physical collect/return are gated by
 * `requiresPhysicalDocuments` — same gate as `allowsPhysicalOriginalDocuments`
 * on the retail journey / Collection Method step.
 */
const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    id: 'application_received',
    label: 'Application Received',
    pendingDescription: 'We confirm your payment and open your file',
  },
  {
    id: 'documents_verified',
    label: 'Documents Verified',
    pendingDescription: 'Our team checks every upload against the checklist',
  },
  {
    id: 'physical_documents_collected',
    label: 'Physical Documents Collected',
    pendingDescription: 'Originals are with GLTS for submission',
    physicalOnly: true,
  },
  {
    id: 'submitted',
    label: 'Submitted',
    pendingDescription: 'Filed with the application centre / consulate',
  },
  {
    id: 'processing',
    label: 'Processing',
    pendingDescription: 'Authority review is in progress',
  },
  {
    id: 'decision',
    label: 'Decision / Outcome',
    pendingDescription: 'You will be notified as soon as a decision is recorded',
  },
  {
    id: 'documents_returned',
    label: 'Documents Returned',
    pendingDescription: 'Originals are on their way back to you',
    physicalOnly: true,
  },
]

function resolveCurrentStageId(
  status: ApplicationTrackingStatus,
  applicable: StageDefinition[],
  app: TrackedApplication,
): TrackingStageId {
  const idForStatus: Record<ApplicationTrackingStatus, TrackingStageId> = {
    received: 'application_received',
    documents_verified: 'documents_verified',
    physical_collected: 'physical_documents_collected',
    submitted_to_authority: 'submitted',
    processing: 'processing',
    decision: 'decision',
  }

  if (status === 'decision') {
    const returnStage = applicable.find((s) => s.id === 'documents_returned')
    if (returnStage && !app.stageTimestamps.documents_returned) {
      return 'documents_returned'
    }
    return 'decision'
  }

  const target = idForStatus[status]
  if (applicable.some((s) => s.id === target)) return target

  // Physical status but stage filtered out → advance to Submitted
  if (status === 'physical_collected') return 'submitted'
  return applicable[0]?.id ?? 'application_received'
}

/** Map a tracked application into StatusStepper config (applicable stages only). */
export function buildTrackingSteps(app: TrackedApplication): StatusStepConfig[] {
  const applicable = STAGE_DEFINITIONS.filter(
    (s) => !s.physicalOnly || app.requiresPhysicalDocuments,
  )
  const currentId = resolveCurrentStageId(app.status, applicable, app)
  const currentIdx = Math.max(
    0,
    applicable.findIndex((s) => s.id === currentId),
  )
  const decisionDone = app.decisionOutcome === 'approved' || app.decisionOutcome === 'refused'

  return applicable.map((def, index) => {
    let state: StatusStepState
    if (index < currentIdx) {
      state = 'completed'
    } else if (index > currentIdx) {
      state = 'pending'
    } else if (def.id === 'decision' && decisionDone) {
      state = 'completed'
    } else if (def.id === 'documents_returned' && app.stageTimestamps.documents_returned) {
      state = 'completed'
    } else {
      state = 'current'
    }

    // When return is current, decision must already be completed.
    if (def.id === 'decision' && currentId === 'documents_returned') {
      state = 'completed'
    }

    const timestamp = app.stageTimestamps[def.id]
    const label =
      def.id === 'decision' && app.decisionOutcome === 'approved'
        ? 'Decision / Outcome — Approved'
        : def.id === 'decision' && app.decisionOutcome === 'refused'
          ? 'Decision / Outcome — Refused'
          : def.label

    let description: string | undefined
    if (state === 'completed' && timestamp) {
      description = timestamp
    } else if (state === 'current') {
      description = app.currentStageHint ?? def.pendingDescription
    } else if (state === 'pending') {
      description = def.pendingDescription
    }

    return {
      id: def.id,
      label,
      description,
      state,
    }
  })
}
