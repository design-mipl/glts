import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { statusToneFromOperational } from '@/pages/customer/features/applications/components/listing/applicationStatus'
import type { ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'
import { statusMasterService } from '@/shared/services/statusMasterService'
import { workflowMasterService } from '@/shared/services/workflowMasterService'
import type {
  ApplicationProcessingStatusState,
  ApplicationProcessingStatusTransitionOption,
  SetApplicationProcessingStatusInput,
} from '@/shared/types/applicationProcessingStatus'
import type { ApplicationProcessingStageDates } from '@/shared/types/applicationProcessingTimeline'
import { resolveApplicationWorkflow } from '@/shared/utils/countryWorkflowUtils'
import {
  isOnHoldStatus,
  isRejectEligibleStatus,
  mapProcessingStatusToOperational,
  PROCESSING_STATUS_IDS,
  REJECT_WORKFLOW_ID,
  TERMINAL_PROCESSING_STATUS_IDS,
} from '@/shared/utils/applicationProcessingStatusIds'

const DEFAULT_ACTOR = 'Admin User'

const store = new Map<string, ApplicationProcessingStatusState>()

function storeKey(applicationId: string, travelerRowId: string): string {
  return `${applicationId}::${travelerRowId}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function statusLabel(statusId: string): string {
  return statusMasterService.getById(statusId)?.name ?? statusId
}

function resolveWorkflowId(input: {
  storedWorkflowId?: string
  countryId?: string
  countryName?: string
  visaTypeLabel?: string
  visaOfferingId?: string
}): string | undefined {
  if (input.storedWorkflowId?.trim()) return input.storedWorkflowId.trim()
  return resolveApplicationWorkflow({
    countryId: input.countryId,
    countryName: input.countryName,
    visaTypeLabel: input.visaTypeLabel,
    visaOfferingId: input.visaOfferingId,
  })?.id
}

function sortedWorkflowStatusIds(workflowId: string | undefined): string[] {
  if (!workflowId) return []
  const workflow = workflowMasterService.getById(workflowId)
  if (!workflow?.steps.length) return []
  return [...workflow.steps].sort((a, b) => a.sequence - b.sequence).map((s) => s.statusId)
}

function syncListingRow(
  applicationId: string,
  statusId: string,
  stageDates?: ApplicationProcessingStageDates,
) {
  const name = statusLabel(statusId)
  const operational = mapProcessingStatusToOperational(statusId, name) as
    | ApplicationOperationalStatus
    | undefined
  const lastUpdated = nowIso().slice(0, 10)

  const single = mockSingleApplications.find((r) => r.id === applicationId)
  if (single) {
    single.processingStage = name
    single.lastUpdated = lastUpdated
    if (stageDates) {
      single.processingStageDates = { ...single.processingStageDates, ...stageDates }
    }
    if (operational) {
      single.operationalStatus = operational
      single.status = operational
      single.statusTone = statusToneFromOperational(operational)
    }
    return
  }

  const bulk = mockBulkBatches.find((r) => r.id === applicationId)
  if (bulk) {
    bulk.processingStage = name
    bulk.lastUpdated = lastUpdated
    if (stageDates) {
      bulk.processingStageDates = { ...bulk.processingStageDates, ...stageDates }
    }
    if (operational) {
      bulk.operationalStatus = operational
      bulk.status = operational
      bulk.statusTone = statusToneFromOperational(operational)
    }
  }
}

function inferInitialStatusId(docsDone: boolean, allVerified: boolean): string {
  if (allVerified || docsDone) return PROCESSING_STATUS_IDS.documentsUnderReview
  return PROCESSING_STATUS_IDS.allDocumentsReceived
}

export const applicationProcessingStatusService = {
  get(
    applicationId: string,
    travelerRowId: string,
  ): ApplicationProcessingStatusState | undefined {
    return store.get(storeKey(applicationId, travelerRowId))
  },

  /** Ensure a cursor exists so the Timeline tab can advance/reject/hold. */
  ensureState(input: {
    applicationId: string
    travelerRowId: string
    docsDone?: boolean
    allVerified?: boolean
    countryId?: string
    countryName?: string
    visaTypeLabel?: string
    visaOfferingId?: string
    inferredStatusId?: string
  }): ApplicationProcessingStatusState {
    const existing = this.get(input.applicationId, input.travelerRowId)
    if (existing) return existing

    const workflowId = resolveWorkflowId(input)
    const currentStatusId =
      input.inferredStatusId?.trim() ||
      inferInitialStatusId(Boolean(input.docsDone), Boolean(input.allVerified))
    const at = nowIso()
    const state: ApplicationProcessingStatusState = {
      applicationId: input.applicationId,
      travelerRowId: input.travelerRowId,
      currentStatusId,
      workflowId,
      history: [
        {
          statusId: currentStatusId,
          at,
          by: DEFAULT_ACTOR,
          action: 'advance',
          note: 'Initial processing status',
        },
      ],
      updatedAt: at,
      updatedBy: DEFAULT_ACTOR,
    }
    store.set(storeKey(input.applicationId, input.travelerRowId), state)
    return state
  },

  listTransitionOptions(input: {
    applicationId: string
    travelerRowId: string
    countryId?: string
    countryName?: string
    visaTypeLabel?: string
    visaOfferingId?: string
  }): ApplicationProcessingStatusTransitionOption[] {
    const state = this.get(input.applicationId, input.travelerRowId)
    if (!state) return []

    const options: ApplicationProcessingStatusTransitionOption[] = []

    if (isOnHoldStatus(state.currentStatusId) && state.heldFromStatusId) {
      options.push({
        statusId: state.heldFromStatusId,
        label: `Resume — ${statusLabel(state.heldFromStatusId)}`,
        action: 'resume',
      })
      return options
    }

    if (TERMINAL_PROCESSING_STATUS_IDS.has(state.currentStatusId)) {
      return options
    }

    const workflowId = resolveWorkflowId({
      storedWorkflowId: state.workflowId,
      ...input,
    })
    const steps = sortedWorkflowStatusIds(workflowId)
    const currentIndex = steps.indexOf(state.currentStatusId)
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextId = steps[currentIndex + 1]
      options.push({
        statusId: nextId,
        label: statusLabel(nextId),
        action: 'advance',
      })
    } else if (currentIndex < 0 && steps.length > 0) {
      // Cursor not in workflow (e.g. just switched to reject path) — offer first unmatched pending.
      const first = steps[0]
      options.push({
        statusId: first,
        label: statusLabel(first),
        action: 'advance',
      })
    }

    if (isRejectEligibleStatus(state.currentStatusId)) {
      const rejectTarget =
        state.currentStatusId === PROCESSING_STATUS_IDS.awaitingOnlineApproval
          ? PROCESSING_STATUS_IDS.awaitingOnlineApprovalRejected
          : PROCESSING_STATUS_IDS.visaStatusRefused
      options.push({
        statusId: rejectTarget,
        label: statusLabel(rejectTarget),
        action: 'reject',
      })
    }

    if (!isOnHoldStatus(state.currentStatusId)) {
      options.push({
        statusId: PROCESSING_STATUS_IDS.onHold,
        label: statusLabel(PROCESSING_STATUS_IDS.onHold),
        action: 'hold',
      })
    }

    return options
  },

  setStatus(
    input: SetApplicationProcessingStatusInput,
  ): { ok: true; state: ApplicationProcessingStatusState } | { ok: false; error: string } {
    const {
      applicationId,
      travelerRowId,
      nextStatusId,
      action,
      note,
      actor = DEFAULT_ACTOR,
    } = input

    let state = this.get(applicationId, travelerRowId)
    if (!state) {
      state = this.ensureState({
        applicationId,
        travelerRowId,
        countryId: input.countryId,
        countryName: input.countryName,
        visaTypeLabel: input.visaTypeLabel,
        visaOfferingId: input.visaOfferingId,
      })
    }

    const allowed = this.listTransitionOptions({
      applicationId,
      travelerRowId,
      countryId: input.countryId,
      countryName: input.countryName,
      visaTypeLabel: input.visaTypeLabel,
      visaOfferingId: input.visaOfferingId,
    })
    const match = allowed.find((o) => o.statusId === nextStatusId && o.action === action)
    if (!match) {
      return { ok: false, error: 'That status transition is not allowed from the current step.' }
    }

    const at = nowIso()
    let workflowId = state.workflowId
    let heldFromStatusId = state.heldFromStatusId

    if (action === 'reject') {
      workflowId = REJECT_WORKFLOW_ID
      heldFromStatusId = undefined
    } else if (action === 'hold') {
      heldFromStatusId = state.currentStatusId
    } else if (action === 'resume') {
      heldFromStatusId = undefined
    }

    const timelineStatusId =
      action === 'hold' ? (heldFromStatusId ?? state.currentStatusId) : nextStatusId
    const stageDates: ApplicationProcessingStageDates = {
      ...(action === 'hold' ? {} : { [nextStatusId]: at }),
      [timelineStatusId]: at,
    }

    const next: ApplicationProcessingStatusState = {
      ...state,
      currentStatusId: nextStatusId,
      workflowId,
      heldFromStatusId,
      history: [
        ...state.history,
        {
          statusId: nextStatusId,
          at,
          by: actor,
          action,
          note: note?.trim() || undefined,
        },
      ],
      updatedAt: at,
      updatedBy: actor,
    }

    store.set(storeKey(applicationId, travelerRowId), next)
    syncListingRow(applicationId, nextStatusId, stageDates)
    return { ok: true, state: next }
  },
}
