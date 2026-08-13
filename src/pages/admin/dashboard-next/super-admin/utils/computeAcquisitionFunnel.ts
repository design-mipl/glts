import type { SuperAdminAcquisitionFunnel } from '../types'

/**
 * Acquisition funnel math (cohort that reached each stage).
 *
 * Overall conversion rate:
 *   conversionRate = (exitCount / entryCount) × 100
 *   where entry = stages[0].count, exit = stages[last].count
 *
 * Step retention (kept into next stage):
 *   stepRetentionPct_i = (count_i / count_{i-1}) × 100
 *
 * Step drop-off (lost between i-1 → i):
 *   stepDropOffPct_i = ((count_{i-1} − count_i) / count_{i-1}) × 100
 *                    = 100 − stepRetentionPct_i
 *
 * Share of top-of-funnel still present at stage i:
 *   ofEntryPct_i = (count_i / entryCount) × 100
 *
 * Largest leak = transition with max stepDropOffPct (absolute lost volume used as tie-break).
 */

export interface ComputedAcquisitionStage {
  id: string
  label: string
  count: number
  href?: string
  /** % of entry still at this stage. */
  ofEntryPct: number
  /** Drop-off % from previous stage → this stage (undefined on first stage). */
  dropOffPct?: number
  /** Retention % from previous stage → this stage (undefined on first stage). */
  retentionPct?: number
  lostFromPrevious?: number
}

export interface ComputedAcquisitionFunnel {
  entryLabel: string
  exitLabel: string
  periodLabel?: string
  entryCount: number
  exitCount: number
  /** Overall conversion: exit / entry × 100. */
  conversionRatePct: number
  stages: ComputedAcquisitionStage[]
  /** Stage id that is the *destination* of the worst drop-off step. */
  leakStageId?: string
  leakDropOffPct?: number
  leakFromLabel?: string
  leakToLabel?: string
  leakLostCount?: number
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function computeAcquisitionFunnel(
  funnel: SuperAdminAcquisitionFunnel,
): ComputedAcquisitionFunnel {
  const stagesRaw = funnel.stages.filter((s) => s.count >= 0)
  const entryCount = stagesRaw[0]?.count ?? 0
  const exitCount = stagesRaw.length > 0 ? stagesRaw[stagesRaw.length - 1]!.count : 0
  const conversionRatePct =
    entryCount > 0 ? round1((exitCount / entryCount) * 100) : 0

  const stages: ComputedAcquisitionStage[] = stagesRaw.map((stage, index) => {
    const ofEntryPct = entryCount > 0 ? round1((stage.count / entryCount) * 100) : 0
    if (index === 0) {
      return {
        id: stage.id,
        label: stage.label,
        count: stage.count,
        href: stage.href,
        ofEntryPct,
      }
    }
    const prev = stagesRaw[index - 1]!.count
    const lost = Math.max(0, prev - stage.count)
    const dropOffPct = prev > 0 ? round1((lost / prev) * 100) : 0
    const retentionPct = prev > 0 ? round1((stage.count / prev) * 100) : 0
    return {
      id: stage.id,
      label: stage.label,
      count: stage.count,
      href: stage.href,
      ofEntryPct,
      dropOffPct,
      retentionPct,
      lostFromPrevious: lost,
    }
  })

  let leakStageId: string | undefined
  let leakDropOffPct: number | undefined
  let leakFromLabel: string | undefined
  let leakToLabel: string | undefined
  let leakLostCount: number | undefined

  for (let i = 1; i < stages.length; i += 1) {
    const stage = stages[i]!
    const drop = stage.dropOffPct ?? 0
    const lost = stage.lostFromPrevious ?? 0
    const better =
      leakDropOffPct == null ||
      drop > leakDropOffPct ||
      (drop === leakDropOffPct && lost > (leakLostCount ?? 0))
    if (better && drop > 0) {
      leakStageId = stage.id
      leakDropOffPct = drop
      leakFromLabel = stages[i - 1]!.label
      leakToLabel = stage.label
      leakLostCount = lost
    }
  }

  return {
    entryLabel: funnel.entryLabel,
    exitLabel: funnel.exitLabel,
    periodLabel: funnel.periodLabel,
    entryCount,
    exitCount,
    conversionRatePct,
    stages,
    leakStageId,
    leakDropOffPct,
    leakFromLabel,
    leakToLabel,
    leakLostCount,
  }
}
