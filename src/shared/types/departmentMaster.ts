import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface DepartmentMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
}

export interface DepartmentMasterFormData {
  name: string
  description: string
  status: MasterRecordStatus
}

export interface DepartmentMasterListFilters {
  status?: MasterRecordStatus | 'all'
}
