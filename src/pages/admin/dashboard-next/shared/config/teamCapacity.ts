/** Team capacity load bands — thresholds are percentages of capacity used. */
export const TEAM_CAPACITY_STATUS_IDS = ['balanced', 'busy', 'overloaded'] as const

export type TeamCapacityStatusId = (typeof TEAM_CAPACITY_STATUS_IDS)[number]

export const TEAM_CAPACITY_STATUS_LABELS: Record<TeamCapacityStatusId, string> = {
  balanced: 'Balanced',
  busy: 'Busy',
  overloaded: 'Overloaded',
}

/** Inclusive upper bounds (percent of capacity utilized). */
export const TEAM_CAPACITY_THRESHOLDS = {
  balancedMax: 70,
  busyMax: 90,
} as const

export function resolveTeamCapacityStatus(utilizationPercent: number): TeamCapacityStatusId {
  if (utilizationPercent <= TEAM_CAPACITY_THRESHOLDS.balancedMax) return 'balanced'
  if (utilizationPercent <= TEAM_CAPACITY_THRESHOLDS.busyMax) return 'busy'
  return 'overloaded'
}
