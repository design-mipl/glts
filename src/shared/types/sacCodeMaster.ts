import type { MasterApplicability, MasterAuditFields, MasterCategory, MasterRecordStatus } from './masterCommon'

export interface SacCodeMaster extends MasterAuditFields {
  id: string
  sacCode: string
  sacTitle: string
  description: string
  category: MasterCategory
  defaultGstRateId: string
  defaultTdsSectionId: string | null
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface SacCodeMasterFormData {
  sacCode: string
  sacTitle: string
  description: string
  category: MasterCategory | ''
  defaultGstRateId: string
  defaultTdsSectionId: string
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface SacCodeMasterListFilters {
  status?: MasterRecordStatus | 'all'
  category?: MasterCategory | 'all'
}
