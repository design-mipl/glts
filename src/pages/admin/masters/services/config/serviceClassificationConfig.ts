import type { MasterCategory } from '@/shared/types/masterCommon'
import { MASTER_CATEGORY_OPTIONS } from '@/shared/types/masterCommon'

export const SERVICE_CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
] as const

export const SERVICE_SUBCATEGORIES_BY_CATEGORY: Record<MasterCategory, { value: string; label: string }[]> = {
  'Visa Services': [
    { value: 'Marine Visa', label: 'Marine Visa' },
    { value: 'Corporate Visa', label: 'Corporate Visa' },
    { value: 'Retail Visa', label: 'Retail Visa' },
  ],
  Documentation: [
    { value: 'Apostille', label: 'Apostille' },
    { value: 'Embassy Submission', label: 'Embassy Submission' },
    { value: 'Document Verification', label: 'Document Verification' },
  ],
  Consultation: [
    { value: 'Travel Advisory', label: 'Travel Advisory' },
    { value: 'Compliance Review', label: 'Compliance Review' },
  ],
  Attestation: [
    { value: 'Notary Attestation', label: 'Notary Attestation' },
    { value: 'MEA Attestation', label: 'MEA Attestation' },
  ],
  'Travel Support': [
    { value: 'Itinerary Planning', label: 'Itinerary Planning' },
    { value: 'Insurance Support', label: 'Insurance Support' },
  ],
}

export const SERVICE_CATEGORY_OPTIONS = MASTER_CATEGORY_OPTIONS.map((cat) => ({
  value: cat,
  label: cat,
}))

export function getServiceSubcategoryOptions(category: MasterCategory | ''): { value: string; label: string }[] {
  if (!category) return []
  return SERVICE_SUBCATEGORIES_BY_CATEGORY[category] ?? []
}
