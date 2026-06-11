import type {
  CountryMasterStatus,
  ProcessingType,
  VisaApplicationWindow,
  VisaApplicationWindowUnit,
} from '@/shared/types/countryMaster'

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

export const VISA_CATEGORY_SELECT_OPTIONS = VISA_CATEGORY_OPTIONS.map((value) => ({
  value,
  label: value,
}))

export const PROCESSING_TIME_OPTIONS = [
  '3 business days',
  '5 business days',
  '7 business days',
  '10 business days',
  '12 business days',
  '14 business days',
  '15 business days',
  '21 business days',
  '30 business days',
] as const

export const PROCESSING_TIME_SELECT_OPTIONS = PROCESSING_TIME_OPTIONS.map((value) => ({
  value,
  label: value,
}))

export const DEFAULT_VISA_APPLICATION_WINDOW: VisaApplicationWindow = {
  unit: 'days',
  value: 30,
}

export const VISA_APPLICATION_WINDOW_UNIT_OPTIONS: {
  value: VisaApplicationWindowUnit
  label: string
}[] = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
]

export const VISA_APPLICATION_WINDOW_VALUE_OPTIONS = Array.from({ length: 60 }, (_, index) => {
  const value = String(index + 1)
  return { value, label: value }
})
