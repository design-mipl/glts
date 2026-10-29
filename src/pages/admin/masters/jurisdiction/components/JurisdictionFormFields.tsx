import { FormField, Input, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { JurisdictionMasterFormData } from '@/shared/types/jurisdictionMaster'

interface JurisdictionFormFieldsProps {
  formData: JurisdictionMasterFormData
  onChange: (next: JurisdictionMasterFormData) => void
  errors: Record<string, string>
}

export function JurisdictionFormFields({
  formData,
  onChange,
  errors,
}: JurisdictionFormFieldsProps) {
  const update = (patch: Partial<JurisdictionMasterFormData>) => onChange({ ...formData, ...patch })

  return (
    <>
      <FormField
        label="Jurisdiction name"
        required
        error={Boolean(errors.name)}
        helperText={errors.name}
      >
        <Input
          value={formData.name}
          onChange={(v) => update({ name: v })}
          placeholder="e.g. Mumbai — China Consulate"
          size="sm"
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Description" optional>
          <Textarea
            value={formData.description}
            onChange={(v) => update({ description: v })}
            placeholder="Brief description of this jurisdiction"
            rows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
