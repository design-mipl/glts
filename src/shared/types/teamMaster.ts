import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface TeamMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
}

export interface TeamMasterFormData {
  name: string
  description: string
  status: MasterRecordStatus
}

export interface TeamMasterListFilters {
  status?: MasterRecordStatus | 'all'
}
