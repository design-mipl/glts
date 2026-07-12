import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface CountryGroupMaster extends MasterAuditFields {
  id: string
  name: string
  countryIds: string[]
  status: MasterRecordStatus
}

export interface CountryGroupMasterFormData {
  name: string
  countryIds: string[]
  status: MasterRecordStatus
}

export interface CountryGroupMasterListFilters {
  status?: MasterRecordStatus | 'all'
}
