/** Segment filters for Admin Application Funnel — mirrors application-management channels. */
export const APPLICATION_FUNNEL_SEGMENT_IDS = [
  'all',
  'b2b',
  'corporate',
  'marine',
  'retail',
] as const

export type ApplicationFunnelSegmentId = (typeof APPLICATION_FUNNEL_SEGMENT_IDS)[number]

export const APPLICATION_FUNNEL_SEGMENT_TABS: ReadonlyArray<{
  value: ApplicationFunnelSegmentId
  label: string
}> = [
  { value: 'all', label: 'All' },
  { value: 'b2b', label: 'B2B Agent' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'marine', label: 'Marine' },
  { value: 'retail', label: 'Retail' },
]

/** Approximate share of total pipeline volume by segment (mock). */
export const APPLICATION_FUNNEL_SEGMENT_SCALE: Record<
  Exclude<ApplicationFunnelSegmentId, 'all'>,
  number
> = {
  retail: 0.36,
  corporate: 0.28,
  marine: 0.22,
  b2b: 0.14,
}

export const APPLICATION_FUNNEL_SEGMENT_ROUTES: Record<ApplicationFunnelSegmentId, string> = {
  all: '/admin/application-management/retail',
  retail: '/admin/application-management/retail',
  corporate: '/admin/application-management/corporate',
  marine: '/admin/application-management/marine',
  b2b: '/admin/application-management/retail',
}
