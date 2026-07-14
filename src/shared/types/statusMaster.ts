import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface StatusMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
}
