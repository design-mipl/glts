import type { MasterAuditFields, MasterRecordStatus } from '@/shared/types/masterCommon'

/** Answer option — documents are Document Master ids (0..N, optional). */
export interface RequirementQuestionOption {
  id: string
  label: string
  /** Document Master ids required when this option is selected. */
  documentIds: string[]
}

/** Single-select multiple-choice question. */
export interface RequirementQuestion {
  id: string
  prompt: string
  required: boolean
  options: RequirementQuestionOption[]
}

export interface RequirementMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
  questions: RequirementQuestion[]
}

export interface RequirementMasterFormData {
  name: string
  description: string
  status: MasterRecordStatus
  questions: RequirementQuestion[]
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

/** Unique Document Master ids referenced by option mappings in a pack. */
export function collectRequirementDocumentIds(pack: {
  questions: RequirementQuestion[]
}): string[] {
  const ids = new Set<string>()
  for (const question of pack.questions) {
    for (const option of question.options) {
      for (const documentId of option.documentIds) {
        ids.add(documentId)
      }
    }
  }
  return [...ids]
}
