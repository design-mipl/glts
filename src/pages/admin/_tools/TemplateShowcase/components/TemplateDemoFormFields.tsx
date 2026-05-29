import { FormField, FormSection, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { TemplateDemoFormData } from '../config/demoEntity'

interface TemplateDemoFormFieldsProps {
  data: TemplateDemoFormData
  onChange: (next: TemplateDemoFormData) => void
  compact?: boolean
  /** Omit FormSection wrapper when fields sit inside AdminFullPageFormShell section cards */
  bare?: boolean
  /** Primary = full field set; secondary = supplemental; modal = short dialog field set */
  variant?: 'primary' | 'secondary' | 'modal'
}

export function TemplateDemoFormFields({
  data,
  onChange,
  compact = false,
  bare = false,
  variant = 'primary',
}: TemplateDemoFormFieldsProps) {
  const patch = (partial: Partial<TemplateDemoFormData>) => onChange({ ...data, ...partial })

  if (variant === 'modal') {
    const modalFields = (
      <>
        <FormField label="Reference" required>
          <Input
            value={data.reference}
            onChange={(value) => patch({ reference: value })}
            placeholder="Enter reference"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Name" required>
            <Input
              value={data.name}
              onChange={(value) => patch({ name: value })}
              placeholder="Enter name"
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
        <FormField label="Country">
          <Input
            value={data.country}
            onChange={(value) => patch({ country: value })}
            placeholder="Enter country"
            fullWidth
          />
        </FormField>
        <FormField label="Priority">
          <Select
            value={data.priority}
            onChange={(value) => patch({ priority: value as TemplateDemoFormData['priority'] })}
            placeholder="Select priority"
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]}
            fullWidth
          />
        </FormField>
      </>
    )

    if (bare) {
      return modalFields
    }

    return (
      <FormSection title="Details" columns={2} description="2–8 fields; 2-column grid (stacks on small viewports)">
        {modalFields}
      </FormSection>
    )
  }

  if (variant === 'secondary') {
    const secondaryFields = (
      <>
        <FormField label="Assignee">
          <Input
            value={data.assignee}
            onChange={(value) => patch({ assignee: value })}
            placeholder="Enter assignee"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Notes" optional>
            <Textarea
              value={data.notes}
              onChange={(value) => patch({ notes: value })}
              placeholder="Enter notes"
              minRows={3}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </>
    )

    if (bare) {
      return secondaryFields
    }

    return (
      <FormSection title="Additional details" columns={1}>
        {secondaryFields}
      </FormSection>
    )
  }

  const fields = (
    <>
      <FormField label="Reference" required>
        <Input
          value={data.reference}
          onChange={(value) => patch({ reference: value })}
          placeholder="Enter reference"
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Name" required>
          <Input
            value={data.name}
            onChange={(value) => patch({ name: value })}
            placeholder="Enter name"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <FormField label="Country">
        <Input
          value={data.country}
          onChange={(value) => patch({ country: value })}
          placeholder="Enter country"
          fullWidth
        />
      </FormField>
      <FormField label="Priority">
        <Select
          value={data.priority}
          onChange={(value) => patch({ priority: value as TemplateDemoFormData['priority'] })}
          placeholder="Select priority"
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
          fullWidth
        />
      </FormField>
    </>
  )

  if (bare) {
    return fields
  }

  return (
    <FormSection title="Record details" columns={compact ? 1 : 2}>
      {fields}
    </FormSection>
  )
}
