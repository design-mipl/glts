import { PROCESSING_TYPE_LABELS } from '@/shared/constants/countryProcessing'
import type {
  CountryMasterStatus,
  ProcessingType,
  VisaApplicationWindow,
  VisaApplicationWindowUnit,
  VisaMode,
} from '@/shared/types/countryMaster'

export { PROCESSING_TYPE_LABELS }

export const PROCESSING_TYPE_OPTIONS: { value: ProcessingType; label: string }[] = [
  { value: 'embassy', label: PROCESSING_TYPE_LABELS.embassy },
  { value: 'e_visa', label: PROCESSING_TYPE_LABELS.e_visa },
  { value: 'vfs', label: PROCESSING_TYPE_LABELS.vfs },
  { value: 'agent_submission', label: PROCESSING_TYPE_LABELS.agent_submission },
  { value: 'hybrid', label: PROCESSING_TYPE_LABELS.hybrid },
]

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

export const VISA_MODE_LABELS: Record<VisaMode, string> = {
  e_visa: 'e-Visa',
  sticker_visa: 'Sticker Visa',
  paper_visa: 'Paper Visa',
}

export const DEFAULT_VISA_MODE: VisaMode = 'e_visa'

export const VISA_MODE_SELECT_OPTIONS: { value: VisaMode; label: string }[] = [
  { value: 'e_visa', label: VISA_MODE_LABELS.e_visa },
  { value: 'sticker_visa', label: VISA_MODE_LABELS.sticker_visa },
  { value: 'paper_visa', label: VISA_MODE_LABELS.paper_visa },
]

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
