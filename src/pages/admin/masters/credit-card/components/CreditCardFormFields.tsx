import { FormField, Input, Textarea } from '@/design-system/UIComponents'
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
    <>
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
      <AdminFullPageFormFieldSpan>
        <FormField label="Description" optional>
          <Textarea
            value={formData.description}
            onChange={(v) => update({ description: v })}
            placeholder="Brief description of this credit card type"
            rows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
