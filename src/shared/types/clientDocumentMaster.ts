import type { MasterApplicability, MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface ClientDocumentMaster extends MasterAuditFields {
  id: string
  documentType: string
  description: string
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface ClientDocumentMasterFormData {
  documentType: string
  description: string
  applicableFor: MasterApplicability[]
  status: MasterRecordStatus
}

export interface ClientDocumentMasterListFilters {
  status?: MasterRecordStatus | 'all'
  applicability?: MasterApplicability | 'all'
}
