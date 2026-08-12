import { FormField, Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { BankMasterFormData } from '@/shared/types/bankMaster'

interface BankMasterFormFieldsProps {
  formData: BankMasterFormData
  onChange: (next: BankMasterFormData) => void
  errors: Record<string, string>
}

export function BankMasterFormFields({
  formData,
  onChange,
  errors,
}: BankMasterFormFieldsProps) {
  const update = (patch: Partial<BankMasterFormData>) => onChange({ ...formData, ...patch })

  return (
    <AdminFullPageFormFieldSpan>
      <FormField
        label="Bank Name"
        required
        error={Boolean(errors.bankName)}
        helperText={errors.bankName}
      >
        <Input
          value={formData.bankName}
          onChange={(v) => update({ bankName: v })}
          placeholder="e.g. HDFC Bank"
          size="sm"
          fullWidth
        />
      </FormField>
    </AdminFullPageFormFieldSpan>
  )
}
