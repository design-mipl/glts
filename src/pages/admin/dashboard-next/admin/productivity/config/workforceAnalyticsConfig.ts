/** Top-N / bottom-N ranking options for workforce charts. */
export const WORKFORCE_TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 7', value: '7' },
  { label: 'Top 10', value: '10' },
  { label: 'Top 20', value: '20' },
  { label: 'All', value: 'all' },
] as const

export const WORKFORCE_BOTTOM_N_OPTIONS = [
  { label: 'Bottom 5', value: '5' },
  { label: 'Bottom 7', value: '7' },
  { label: 'Bottom 10', value: '10' },
] as const

export type WorkforceTopN = '5' | '7' | '10' | '20' | 'all'
export type WorkforceBottomN = '5' | '7' | '10'

/** Consolidated section tabs (grouped from the full 13-area workforce spec). */
export const WORKFORCE_SECTION_IDS = [
  'overview',
  'teams',
  'people',
  'sla-trends',
  'quality-activity',
  'insights',
] as const

export type WorkforceSectionId = (typeof WORKFORCE_SECTION_IDS)[number]

export const WORKFORCE_SECTION_TABS: ReadonlyArray<{
  value: WorkforceSectionId
  label: string
}> = [
  { value: 'overview', label: 'Overview' },
  { value: 'teams', label: 'Teams' },
  { value: 'people', label: 'People' },
  { value: 'sla-trends', label: 'SLA & trends' },
  { value: 'quality-activity', label: 'Quality & activity' },
  { value: 'insights', label: 'Insights' },
]

export const WORKFORCE_DEPARTMENT_IDS = [
  'ops',
  'docs',
  'ground',
  'accounts',
] as const

export type WorkforceDepartmentId = (typeof WORKFORCE_DEPARTMENT_IDS)[number]

export const WORKFORCE_DEPARTMENT_LABELS: Record<WorkforceDepartmentId, string> = {
  ops: 'Operations',
  docs: 'Documentation',
  ground: 'Ground Operations',
  accounts: 'Accounts',
}

export const WORKFORCE_TEAM_IDS = ['marine', 'corporate', 'retail', 'b2b'] as const

export type WorkforceTeamId = (typeof WORKFORCE_TEAM_IDS)[number]

export const WORKFORCE_TEAM_LABELS: Record<WorkforceTeamId, string> = {
  marine: 'Marine',
  corporate: 'Corporate',
  retail: 'Retail',
  b2b: 'B2B',
}

export function sliceTopN<T>(rows: T[], topN: WorkforceTopN): T[] {
  if (topN === 'all') return rows
  return rows.slice(0, Number(topN))
}

export function sliceBottomN<T>(rows: T[], bottomN: WorkforceBottomN): T[] {
  return rows.slice(-Number(bottomN))
}
