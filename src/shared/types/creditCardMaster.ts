import type { MasterAuditFields } from './masterCommon'

export interface CreditCardMaster extends MasterAuditFields {
  id: string
  cardName: string
  description: string
}

export interface CreditCardMasterFormData {
  cardName: string
  description: string
}
