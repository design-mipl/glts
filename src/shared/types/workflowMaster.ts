import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export interface WorkflowStatusStep {
  statusId: string
  remarks: string
  sequence: number
}

export interface WorkflowMaster extends MasterAuditFields {
  id: string
  name: string
  description: string
  status: MasterRecordStatus
  steps: WorkflowStatusStep[]
}

export interface WorkflowStatusStepFormData {
  statusId: string
  remarks: string
}

export interface WorkflowMasterFormData {
  name: string
  description: string
  status: MasterRecordStatus
  steps: WorkflowStatusStepFormData[]
}

export interface WorkflowMasterListFilters {
  status?: MasterRecordStatus | 'all'
}
