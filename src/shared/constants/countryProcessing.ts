import type { ProcessingType } from '@/shared/types/countryMaster'

export const PROCESSING_TYPE_LABELS: Record<ProcessingType, string> = {
  embassy: 'Embassy',
  e_visa: 'E-Visa',
  vfs: 'VFS',
  agent_submission: 'Agent submission',
  hybrid: 'Hybrid',
}
