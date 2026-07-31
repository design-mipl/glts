/** Multi-color chart palette — aligned with Ops / Accounts dashboard tokens. */
export const DOC_CHART_COLORS = {
  navy: '#001F3F',
  green: '#73C064',
  amber: '#F59E0B',
  coral: '#EF4444',
  blue: '#3B82F6',
  teal: '#14B8A6',
  violet: '#8B5CF6',
  slate: '#64748B',
} as const

export const DOC_CHART_SERIES = [
  DOC_CHART_COLORS.navy,
  DOC_CHART_COLORS.green,
  DOC_CHART_COLORS.amber,
  DOC_CHART_COLORS.coral,
  DOC_CHART_COLORS.blue,
  DOC_CHART_COLORS.teal,
  DOC_CHART_COLORS.violet,
  DOC_CHART_COLORS.slate,
] as const
