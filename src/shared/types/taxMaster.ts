import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export type TdsApplicableOn = 'customer_invoice' | 'vendor_payment' | 'both'

export interface GstRate extends MasterAuditFields {
  id: string
  slabName: string
  ratePercent: number
  description: string
  status: MasterRecordStatus
}

export interface TdsSection extends MasterAuditFields {
  id: string
  sectionCode: string
  ratePercent: number
  applicableOn: TdsApplicableOn
  thresholdLimit: number | null
  description: string
  status: MasterRecordStatus
}

export interface GstRateFormData {
  slabName: string
  ratePercent: string
  description: string
  status: MasterRecordStatus
}

export interface TdsSectionFormData {
  sectionCode: string
  ratePercent: string
  applicableOn: TdsApplicableOn
  thresholdLimit: string
  description: string
  status: MasterRecordStatus
}

export interface TaxMasterListFilters {
  status?: MasterRecordStatus | 'all'
  applicableOn?: TdsApplicableOn | 'all'
}

export interface SelectOption {
  value: string
  label: string
}
