import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { slaMasterService } from '@/shared/services/slaMasterService'
import {
  SLA_OPS_STAGE_LABELS,
  type SlaOpsStage,
  type SlaSegment,
} from '@/shared/types/slaMaster'

export type ApplicationListingSlaRow = SingleApplicationRow | BulkBatchRow

export type ApplicationSlaDisplayState = 'on_track' | 'at_risk' | 'breached' | 'none'

export interface ApplicationSlaDisplay {
  state: ApplicationSlaDisplayState
  stage: SlaOpsStage
  stageLabel: string
  stageHours: number
  e2eHours: number
  stageDueAt: string
  e2eDueAt: string
  remainingLabel: string
  e2eRemainingLabel: string
}

const OPS_STAGES = new Set<SlaOpsStage>([
  'draft',
  'verification_pending',
  'online_submission_pending',
  'pending_payment',
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
])

const AT_RISK_MS = 4 * 60 * 60 * 1000

export function isSlaOpsStage(stage: string | null | undefined): stage is SlaOpsStage {
  return Boolean(stage && OPS_STAGES.has(stage as SlaOpsStage))
}

function parseTime(value?: string): number | null {
  if (!value?.trim()) return null
  const ms = new Date(value).getTime()
  return Number.isNaN(ms) ? null : ms
}

function formatRemaining(dueAtMs: number, now = Date.now()): string {
  const diff = dueAtMs - now
  const overdue = diff <= 0
  const absMs = Math.abs(diff)
  const totalHours = Math.floor(absMs / (60 * 60 * 1000))
  const mins = Math.floor((absMs % (60 * 60 * 1000)) / (60 * 1000))
  const prefix = overdue ? '-' : ''

  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    return `${prefix}${days}d ${hours}h`
  }

  return `${prefix}${totalHours}h ${mins}m`
}

function resolveState(dueAtMs: number, now = Date.now()): ApplicationSlaDisplayState {
  if (dueAtMs <= now) return 'breached'
  if (dueAtMs - now <= AT_RISK_MS) return 'at_risk'
  return 'on_track'
}

function resolveStageEnteredAt(row: ApplicationListingSlaRow, stage: SlaOpsStage): number {
  const dates = row.processingStageDates
  const mapped =
    stage === 'verification_pending'
      ? dates?.ready ?? dates?.submitted
      : stage === 'online_submission_pending'
        ? dates?.submitted
        : stage === 'vfs_submission_pending'
          ? dates?.appointment ?? dates?.embassy
          : undefined

  return (
    parseTime(mapped) ??
    parseTime(row.lastUpdated) ??
    parseTime(row.submissionDate) ??
    parseTime(row.createdAt) ??
    Date.now()
  )
}

function resolveE2eStartedAt(row: ApplicationListingSlaRow): number {
  return (
    parseTime(row.submissionDate) ??
    parseTime(row.processingStageDates?.ready) ??
    parseTime(row.createdAt) ??
    Date.now()
  )
}

/**
 * Resolve Application Management ops SLA for a listing row.
 * Returns null when the row is outside ops E2E stages or no active master exists.
 */
export function resolveApplicationOpsSlaDisplay(
  row: ApplicationListingSlaRow,
  segment: SlaSegment,
  queueStage: string | null,
): ApplicationSlaDisplay | null {
  if (!isSlaOpsStage(queueStage)) return null

  const master = slaMasterService.getActiveBySegment(segment, 'application_management')
  if (!master) return null

  const applicationType = row.recordType === 'bulk' ? 'bulk' : 'single'
  const totalApplicants =
    row.recordType === 'bulk' ? (row as BulkBatchRow).totalApplicants : 1
  const plan = slaMasterService.getPlanHours(master, applicationType, totalApplicants)
  const stageHours = plan.stages[queueStage] ?? 0
  if (stageHours <= 0 && plan.e2eHours <= 0) return null

  const now = Date.now()
  const stageEnteredAt = resolveStageEnteredAt(row, queueStage)
  const e2eStartedAt = resolveE2eStartedAt(row)
  const stageDueAtMs = stageEnteredAt + stageHours * 60 * 60 * 1000
  const e2eDueAtMs = e2eStartedAt + plan.e2eHours * 60 * 60 * 1000

  const stageState = resolveState(stageDueAtMs, now)
  const e2eState = resolveState(e2eDueAtMs, now)
  const state: ApplicationSlaDisplayState =
    stageState === 'breached' || e2eState === 'breached'
      ? 'breached'
      : stageState === 'at_risk' || e2eState === 'at_risk'
        ? 'at_risk'
        : 'on_track'

  return {
    state,
    stage: queueStage,
    stageLabel: SLA_OPS_STAGE_LABELS[queueStage],
    stageHours,
    e2eHours: plan.e2eHours,
    stageDueAt: new Date(stageDueAtMs).toISOString(),
    e2eDueAt: new Date(e2eDueAtMs).toISOString(),
    remainingLabel: formatRemaining(stageDueAtMs, now),
    e2eRemainingLabel: formatRemaining(e2eDueAtMs, now),
  }
}

export function applicationSlaBadgeColor(
  state: ApplicationSlaDisplayState,
): 'success' | 'warning' | 'error' | 'neutral' {
  if (state === 'breached') return 'error'
  if (state === 'at_risk') return 'warning'
  if (state === 'on_track') return 'success'
  return 'neutral'
}

export function applicationSlaBadgeLabel(display: ApplicationSlaDisplay): string {
  if (display.state === 'breached') return display.remainingLabel
  if (display.state === 'at_risk') return display.remainingLabel
  return display.remainingLabel
}
