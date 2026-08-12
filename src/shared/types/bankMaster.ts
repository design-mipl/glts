import type { MasterAuditFields } from './masterCommon'

export interface BankMaster extends MasterAuditFields {
  id: string
  bankName: string
}

export interface BankMasterFormData {
  bankName: string
}
