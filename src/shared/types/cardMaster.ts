import type { MasterAuditFields } from './masterCommon'

export interface CardMaster extends MasterAuditFields {
  id: string
  cardName: string
}

export interface CardMasterFormData {
  cardName: string
}
