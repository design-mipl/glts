import { FormField, Input, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { WorkflowMasterFormData } from '@/shared/types/workflowMaster'

interface WorkflowFormFieldsProps {
  formData: WorkflowMasterFormData
  onChange: (next: WorkflowMasterFormData) => void
  errors: Record<string, string>
}

export function WorkflowFormFields({ formData, onChange, errors }: WorkflowFormFieldsProps) {
  const update = (patch: Partial<WorkflowMasterFormData>) => onChange({ ...formData, ...patch })

  return (
    <>
      <AdminFullPageFormFieldSpan>
        <FormField
          label="Workflow Name"
          required
          error={Boolean(errors.name)}
          helperText={errors.name}
        >
          <Input
            value={formData.name}
            onChange={(v) => update({ name: v })}
            placeholder="e.g. Standard Visa Processing"
            size="sm"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <AdminFullPageFormFieldSpan>
        <FormField label="Description" optional>
          <Textarea
            value={formData.description}
            onChange={(v) => update({ description: v })}
            placeholder="Brief description of this workflow"
            rows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <AdminFullPageFormFieldSpan>
        <Toggle
          checked={formData.status === 'active'}
          onChange={(checked) => update({ status: checked ? 'active' : 'inactive' })}
          label="Active"
          size="sm"
        />
      </AdminFullPageFormFieldSpan>
    </>
  )
}
