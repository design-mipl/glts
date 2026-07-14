import type { MasterAuditFields } from './masterCommon'

export interface CreditCardMaster extends MasterAuditFields {
  id: string
  cardName: string
}

export interface CreditCardMasterFormData {
  cardName: string
}
