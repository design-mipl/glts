/** Application-channel lens for Team productivity infographic. */
export const TEAM_PRODUCTIVITY_CHANNEL_IDS = [
  'all',
  'marine',
  'corporate',
  'retail',
] as const

export type TeamProductivityChannelId = (typeof TEAM_PRODUCTIVITY_CHANNEL_IDS)[number]

export const TEAM_PRODUCTIVITY_CHANNEL_TABS: ReadonlyArray<{
  value: TeamProductivityChannelId
  label: string
}> = [
  { value: 'all', label: 'All' },
  { value: 'marine', label: 'Marine' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'retail', label: 'Retail' },
]

/** Operating desks shown on the productivity infographic. */
export const TEAM_PRODUCTIVITY_TEAM_IDS = ['ops', 'docs', 'ground', 'accounts'] as const

export type TeamProductivityTeamId = (typeof TEAM_PRODUCTIVITY_TEAM_IDS)[number]

export const TEAM_PRODUCTIVITY_TEAM_LABELS: Record<TeamProductivityTeamId, string> = {
  ops: 'Operations',
  docs: 'Documentation',
  ground: 'Ground Ops',
  accounts: 'Accounts',
}

/** Relative volume of each channel vs All (mock scale). */
export const TEAM_PRODUCTIVITY_CHANNEL_SCALE: Record<
  Exclude<TeamProductivityChannelId, 'all'>,
  number
> = {
  marine: 0.28,
  corporate: 0.34,
  retail: 0.38,
}
