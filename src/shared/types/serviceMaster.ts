import type { MasterApplicability, MasterAuditFields, MasterCategory, MasterRecordStatus } from './masterCommon'

export type ServiceType = 'glts' | 'vendor' | 'vfs'

export interface ServiceMaster extends MasterAuditFields {
  id: string
  serviceCode: string
  serviceName: string
  description: string
  serviceType: ServiceType
  category: MasterCategory
  subcategory: string
  defaultPrice: number | null
  mappedSacCodeId: string | null
  gstRateId: string | null
  tdsSectionId: string | null
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface ServiceMasterFormData {
  serviceName: string
  description: string
  serviceType: ServiceType | ''
  defaultPrice: string
  mappedSacCodeId: string
  gstRateId: string
  tdsSectionId: string
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface ServiceMasterListFilters {
  status?: MasterRecordStatus | 'all'
  category?: MasterCategory | 'all'
  serviceType?: ServiceType | 'all'
}
