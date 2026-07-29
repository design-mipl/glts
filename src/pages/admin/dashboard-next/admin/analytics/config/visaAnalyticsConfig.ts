/** Top-N ranking options used across Visa Analytics charts. */
export const VISA_ANALYTICS_TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 7', value: '7' },
  { label: 'Top 10', value: '10' },
  { label: 'Top 20', value: '20' },
  { label: 'All', value: 'all' },
] as const

export type VisaAnalyticsTopN = '5' | '7' | '10' | '20' | 'all'

export const VISA_ANALYTICS_SECTION_IDS = [
  'volume',
  'submission',
  'collection',
  'dispatch',
  'pan-india',
  'refusal',
  'approval',
  'sla',
  'rankings',
  'revenue',
] as const

export type VisaAnalyticsSectionId = (typeof VISA_ANALYTICS_SECTION_IDS)[number]

export const VISA_ANALYTICS_SECTION_TABS: ReadonlyArray<{
  value: VisaAnalyticsSectionId
  label: string
}> = [
  { value: 'volume', label: 'Visa volume' },
  { value: 'submission', label: 'Submission' },
  { value: 'collection', label: 'Collection' },
  { value: 'dispatch', label: 'Dispatch' },
  { value: 'pan-india', label: 'Pan India' },
  { value: 'refusal', label: 'Refusal' },
  { value: 'approval', label: 'Approval' },
  { value: 'sla', label: 'SLA & processing' },
  { value: 'rankings', label: 'Rankings' },
  { value: 'revenue', label: 'Revenue' },
]

export function sliceTopN<T>(rows: T[], topN: VisaAnalyticsTopN): T[] {
  if (topN === 'all') return rows
  return rows.slice(0, Number(topN))
}
