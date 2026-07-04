import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type { CorporateWorkflowConfig } from '@/shared/types/corporateAccount'

export const CORPORATE_ACCOUNT_WORKFLOW_OPTIONS: { value: AgreementWorkflowType; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'retail', label: 'Retail' },
  { value: 'b2b_agent', label: 'B2B Agent' },
]

export function workflowConfigFromAgreementType(workflowType: AgreementWorkflowType): CorporateWorkflowConfig {
  if (workflowType === 'mixed') {
    return {
      marineWorkflowEnabled: true,
      bulkUploadEnabled: false,
      retailWorkflowEnabled: true,
      corporateWorkflowEnabled: true,
    }
  }
  return workflowConfigFromType(workflowType)
}

export function workflowConfigFromType(workflowType: AgreementWorkflowType): CorporateWorkflowConfig {
  return {
    marineWorkflowEnabled: workflowType === 'marine',
    bulkUploadEnabled: false,
    retailWorkflowEnabled: workflowType === 'retail',
    corporateWorkflowEnabled: workflowType === 'corporate' || workflowType === 'b2b_agent',
  }
}

export function accountTypeFromWorkflow(workflowType: AgreementWorkflowType): string {
  return workflowType === 'marine' ? 'marine' : 'corporate'
}

export function isSelectableCorporateWorkflowType(
  workflowType: string,
): workflowType is AgreementWorkflowType {
  return CORPORATE_ACCOUNT_WORKFLOW_OPTIONS.some((option) => option.value === workflowType)
}
