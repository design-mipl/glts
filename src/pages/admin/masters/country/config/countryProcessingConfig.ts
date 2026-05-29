import type { CountryMasterStatus, ProcessingType } from '@/shared/types/countryMaster'

export const PROCESSING_TYPE_OPTIONS: { value: ProcessingType; label: string }[] = [
  { value: 'embassy', label: 'Embassy' },
  { value: 'e_visa', label: 'E-Visa' },
  { value: 'vfs', label: 'VFS' },
  { value: 'agent_submission', label: 'Agent submission' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const PROCESSING_TYPE_LABELS: Record<ProcessingType, string> = {
  embassy: 'Embassy',
  e_visa: 'E-Visa',
  vfs: 'VFS',
  agent_submission: 'Agent submission',
  hybrid: 'Hybrid',
}

export const COUNTRY_STATUS_OPTIONS: { value: CountryMasterStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'draft', label: 'Draft' },
]

export const COUNTRY_STATUS_LABELS: Record<CountryMasterStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
}

export const COUNTRY_STATUS_COLORS: Record<
  CountryMasterStatus,
  'success' | 'neutral' | 'warning'
> = {
  active: 'success',
  inactive: 'neutral',
  draft: 'warning',
}

export const VISA_CATEGORY_OPTIONS = [
  'Tourism',
  'Business',
  'Work',
  'Crew',
  'Transit',
  'Student',
  'Family',
]
