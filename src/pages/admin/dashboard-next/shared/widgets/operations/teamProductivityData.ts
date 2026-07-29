import type {
  TeamProductivityChannelId,
  TeamProductivityTeamId,
} from '../../config/teamProductivity'
import {
  TEAM_PRODUCTIVITY_CHANNEL_SCALE,
  TEAM_PRODUCTIVITY_TEAM_IDS,
  TEAM_PRODUCTIVITY_TEAM_LABELS,
} from '../../config/teamProductivity'

export interface TeamProductivityMetric {
  teamId: TeamProductivityTeamId
  label: string
  openCases: number
  completedToday: number
  capacity: number
  slaPercent: number
}

export type TeamProductivityByChannel = Record<
  TeamProductivityChannelId,
  TeamProductivityMetric[]
>

function scaleMetric(row: TeamProductivityMetric, scale: number): TeamProductivityMetric {
  const round = (n: number) => Math.max(0, Math.round(n * scale))
  return {
    ...row,
    openCases: round(row.openCases),
    completedToday: round(row.completedToday),
    capacity: Math.max(1, round(row.capacity)),
    slaPercent: Math.min(99, Math.max(70, Math.round(row.slaPercent + (scale - 0.5) * 4))),
  }
}

/** Build All + per-channel productivity rows from an All baseline (Ops / Docs / Ground / Accounts). */
export function buildTeamProductivityByChannel(
  allTeams: TeamProductivityMetric[],
): TeamProductivityByChannel {
  const all = TEAM_PRODUCTIVITY_TEAM_IDS.map((teamId) => {
    const found = allTeams.find((row) => row.teamId === teamId)
    return (
      found ?? {
        teamId,
        label: TEAM_PRODUCTIVITY_TEAM_LABELS[teamId],
        openCases: 0,
        completedToday: 0,
        capacity: 1,
        slaPercent: 90,
      }
    )
  })

  return {
    all,
    marine: all.map((row) => scaleMetric(row, TEAM_PRODUCTIVITY_CHANNEL_SCALE.marine)),
    corporate: all.map((row) => scaleMetric(row, TEAM_PRODUCTIVITY_CHANNEL_SCALE.corporate)),
    retail: all.map((row) => scaleMetric(row, TEAM_PRODUCTIVITY_CHANNEL_SCALE.retail)),
  }
}
