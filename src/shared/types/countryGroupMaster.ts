import type { MasterRecordStatus } from './masterCommon'

export interface CountryGroupMaster {
  id: string
  name: string
  countryIds: string[]
  status: MasterRecordStatus
}
