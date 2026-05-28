import { FormField, FormSection, Input, Select } from '@/design-system/UIComponents'
import type { TemplateDemoFormData } from '../config/demoEntity'

interface TemplateDemoFormFieldsProps {
  data: TemplateDemoFormData
  onChange: (next: TemplateDemoFormData) => void
  compact?: boolean
}

export function TemplateDemoFormFields({ data, onChange, compact = false }: TemplateDemoFormFieldsProps) {
  const patch = (partial: Partial<TemplateDemoFormData>) => onChange({ ...data, ...partial })

  return (
    <FormSection title="Record details" columns={compact ? 1 : 2}>
      <FormField label="Reference" required>
        <Input
          value={data.reference}
          onChange={(value) => patch({ reference: value })}
          placeholder="Enter reference"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Name" required>
        <Input
          value={data.name}
          onChange={(value) => patch({ name: value })}
          placeholder="Enter name"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Country">
        <Input
          value={data.country}
          onChange={(value) => patch({ country: value })}
          placeholder="Enter country"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Priority">
        <Select
          value={data.priority}
          onChange={(value) => patch({ priority: value as TemplateDemoFormData['priority'] })}
          placeholder="Select priority"
          size="sm"
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
          fullWidth
        />
      </FormField>
      <FormField label="Assignee">
        <Input
          value={data.assignee}
          onChange={(value) => patch({ assignee: value })}
          placeholder="Enter assignee"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Notes" optional>
        <Input
          value={data.notes}
          onChange={(value) => patch({ notes: value })}
          placeholder="Enter notes"
          size="sm"
          fullWidth
        />
      </FormField>
    </FormSection>
  )
}
