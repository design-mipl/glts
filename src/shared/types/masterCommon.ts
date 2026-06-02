/** Shared types for lightweight admin master modules. */

export type MasterRecordStatus = 'active' | 'inactive'

export type MasterApplicability = 'marine' | 'corporate' | 'retail' | 'b2b'

export interface MasterAuditFields {
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export const MASTER_APPLICABILITY_OPTIONS: { value: MasterApplicability; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'retail', label: 'Retail' },
  { value: 'b2b', label: 'B2B' },
]

export const MASTER_CATEGORY_OPTIONS = [
  'Visa Services',
  'Documentation',
  'Consultation',
  'Attestation',
  'Travel Support',
] as const

export type MasterCategory = (typeof MASTER_CATEGORY_OPTIONS)[number]
