import { FormField, Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { CreditCardMasterFormData } from '@/shared/types/creditCardMaster'

interface CreditCardFormFieldsProps {
  formData: CreditCardMasterFormData
  onChange: (next: CreditCardMasterFormData) => void
  errors: Record<string, string>
}

export function CreditCardFormFields({
  formData,
  onChange,
  errors,
}: CreditCardFormFieldsProps) {
  const update = (patch: Partial<CreditCardMasterFormData>) => onChange({ ...formData, ...patch })

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
          placeholder="e.g. Visa"
          size="sm"
          fullWidth
        />
      </FormField>
    </AdminFullPageFormFieldSpan>
  )
}
