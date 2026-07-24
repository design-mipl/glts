/** Receivables ageing bucket ids for AgeingAnalysis. */
export const AGEING_BUCKET_IDS = ['0-30', '31-60', '61-90', '90-plus'] as const

export type AgeingBucketId = (typeof AGEING_BUCKET_IDS)[number]

export const AGEING_BUCKET_LABELS: Record<AgeingBucketId, string> = {
  '0-30': '0–30',
  '31-60': '31–60',
  '61-90': '61–90',
  '90-plus': '90+',
}
