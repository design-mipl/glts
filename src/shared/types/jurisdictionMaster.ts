import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface JurisdictionMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
}

export interface JurisdictionMasterFormData {
  name: string
  description: string
  status: MasterRecordStatus
}

export interface JurisdictionMasterListFilters {
  status?: MasterRecordStatus | 'all'
}
