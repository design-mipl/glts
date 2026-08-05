/** Top-N ranking options used across Visa Analytics charts. */
export const VISA_ANALYTICS_TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 10', value: '10' },
  { label: 'Top 15', value: '15' },
  { label: 'Top 20', value: '20' },
] as const

export type VisaAnalyticsTopN = '5' | '10' | '15' | '20'

/** Deep-dive sections only — executive snapshot lives on Admin Overview. */
export const VISA_ANALYTICS_SECTION_IDS = [
  'pipeline',
  'outcomes',
  'sla',
  'jurisdictions',
] as const

export type VisaAnalyticsSectionId = (typeof VISA_ANALYTICS_SECTION_IDS)[number]

export const VISA_ANALYTICS_SECTION_TABS: ReadonlyArray<{
  value: VisaAnalyticsSectionId
  label: string
}> = [
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'outcomes', label: 'Outcomes' },
  { value: 'sla', label: 'SLA' },
  { value: 'jurisdictions', label: 'Jurisdictions' },
]

export function sliceTopN<T>(rows: T[], topN: VisaAnalyticsTopN): T[] {
  return rows.slice(0, Number(topN))
}
