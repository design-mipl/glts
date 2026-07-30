/** Multi-color chart palette — navy · green · amber · coral · blue · teal (aligned with ops). */
export const ACCOUNTS_CHART_COLORS = {
  navy: '#001F3F',
  green: '#73C064',
  amber: '#F59E0B',
  coral: '#EF4444',
  blue: '#3B82F6',
  teal: '#14B8A6',
  violet: '#8B5CF6',
  slate: '#64748B',
} as const

export const ACCOUNTS_CHART_SERIES = [
  ACCOUNTS_CHART_COLORS.navy,
  ACCOUNTS_CHART_COLORS.green,
  ACCOUNTS_CHART_COLORS.amber,
  ACCOUNTS_CHART_COLORS.coral,
  ACCOUNTS_CHART_COLORS.blue,
  ACCOUNTS_CHART_COLORS.teal,
  ACCOUNTS_CHART_COLORS.violet,
  ACCOUNTS_CHART_COLORS.slate,
] as const
