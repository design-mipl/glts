import type { CountryJurisdictionDocumentRule } from '@/shared/types/countryMaster'
import type { MasterAuditFields, MasterRecordStatus } from '@/shared/types/masterCommon'

export type RequirementQuestionType = 'multiple_choice' | 'checkboxes'

export interface RequirementQuestionOption {
  id: string
  label: string
}

export interface RequirementQuestion {
  id: string
  prompt: string
  type: RequirementQuestionType
  options: RequirementQuestionOption[]
  required: boolean
}

export interface RequirementMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
  questions: RequirementQuestion[]
  documents: CountryJurisdictionDocumentRule[]
}

export interface RequirementMasterFormData {
  name: string
  description: string
  status: MasterRecordStatus
  questions: RequirementQuestion[]
  documents: CountryJurisdictionDocumentRule[]
}

export interface RequirementMasterListFilters {
  status?: MasterRecordStatus | 'all'
  query?: string
}

export interface RequirementMasterKpiCounts {
  total: number
  active: number
  inactive: number
}
