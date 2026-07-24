/** Shared RAG (red/amber/green) tones for marine and risk widgets. */
export const RAG_STATUS_IDS = ['red', 'amber', 'green'] as const

export type RagStatusId = (typeof RAG_STATUS_IDS)[number]

export const RAG_STATUS_LABELS: Record<RagStatusId, string> = {
  red: 'Critical',
  amber: 'At risk',
  green: 'Healthy',
}
