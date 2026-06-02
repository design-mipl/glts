import type { MasterApplicability, MasterAuditFields, MasterCategory, MasterRecordStatus } from './masterCommon'

export type ServiceCurrency = 'INR' | 'USD' | 'EUR' | 'GBP'

export interface ServiceMaster extends MasterAuditFields {
  id: string
  serviceCode: string
  serviceName: string
  description: string
  category: MasterCategory
  subcategory: string
  defaultPrice: number | null
  currency: ServiceCurrency
  mappedSacCodeId: string | null
  gstRateId: string | null
  tdsSectionId: string | null
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface ServiceMasterFormData {
  serviceCode: string
  serviceName: string
  description: string
  category: MasterCategory | ''
  subcategory: string
  defaultPrice: string
  currency: ServiceCurrency | ''
  mappedSacCodeId: string
  gstRateId: string
  tdsSectionId: string
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface ServiceMasterListFilters {
  status?: MasterRecordStatus | 'all'
  category?: MasterCategory | 'all'
  currency?: ServiceCurrency | 'all'
}
