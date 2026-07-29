import { FormField, Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { CardMasterFormData } from '@/shared/types/cardMaster'

interface CardMasterFormFieldsProps {
  formData: CardMasterFormData
  onChange: (next: CardMasterFormData) => void
  errors: Record<string, string>
}

export function CardMasterFormFields({
  formData,
  onChange,
  errors,
}: CardMasterFormFieldsProps) {
  const update = (patch: Partial<CardMasterFormData>) => onChange({ ...formData, ...patch })

  return (
    <AdminFullPageFormFieldSpan>
      <FormField
        label="Card Name"
        required
        error={Boolean(errors.cardName)}
        helperText={errors.cardName}
      >
        <Input
          value={formData.cardName}
          onChange={(v) => update({ cardName: v })}
          placeholder="e.g. Anna ICICI personal 0022 card – Master"
          size="sm"
          fullWidth
        />
      </FormField>
    </AdminFullPageFormFieldSpan>
  )
}
