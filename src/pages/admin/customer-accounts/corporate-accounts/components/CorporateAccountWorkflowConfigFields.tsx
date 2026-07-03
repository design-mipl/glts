import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import {
  CORPORATE_ACCOUNT_WORKFLOW_OPTIONS,
  accountTypeFromWorkflow,
  isSelectableCorporateWorkflowType,
  workflowConfigFromType,
} from '@/shared/utils/corporateAccountWorkflow'
import { FormField, Select } from '@/design-system/UIComponents'

interface CorporateAccountWorkflowConfigFieldsProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
}

export function CorporateAccountWorkflowConfigFields({
  data,
  onChange,
}: CorporateAccountWorkflowConfigFieldsProps) {
  const handleWorkflowChange = (value: string) => {
    const workflowType = value as AgreementWorkflowType
    onChange({
      ...data,
      workflowType,
      accountType: accountTypeFromWorkflow(workflowType),
      workflowConfig: workflowConfigFromType(workflowType),
      portalActivation: {
        ...data.portalActivation,
        bulkUploadAccess: false,
      },
    })
  }

  const selectValue = isSelectableCorporateWorkflowType(data.workflowType) ? data.workflowType : ''

  return (
    <FormField label="Workflow type" required>
      <Select
        value={selectValue}
        onChange={(v) => handleWorkflowChange(String(v))}
        options={CORPORATE_ACCOUNT_WORKFLOW_OPTIONS}
        placeholder="Select workflow…"
        disabled={!data.agreementId}
        fullWidth
      />
    </FormField>
  )
}
