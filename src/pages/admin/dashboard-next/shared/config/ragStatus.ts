/** Shared RAG (red/amber/green) tones for marine and risk widgets. */
export const RAG_STATUS_IDS = ['red', 'amber', 'green'] as const

export type RagStatusId = (typeof RAG_STATUS_IDS)[number]

export const RAG_STATUS_LABELS: Record<RagStatusId, string> = {
  red: 'Red',
  amber: 'Amber',
  green: 'Green',
}

/**
 * Visa / crew joining-date RAG bands (days left until joining):
 * Green > 10 days · Amber 7–10 days · Red < 7 days.
 */
export function ragFromDaysRemaining(days: number): RagStatusId {
  if (days < 7) return 'red'
  if (days <= 10) return 'amber'
  return 'green'
}

export const RAG_DAY_BAND_DESCRIPTION =
  'Green >10 days · Amber 7–10 days · Red <7 days · Target: zero in any stage >7 days'
