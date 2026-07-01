import { FormField, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { VendorFormData } from '@/shared/types/vendor'

interface VendorInternalNotesFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorInternalNotesFields({ data, onChange }: VendorInternalNotesFieldsProps) {
  const patchCommercial = (partial: Partial<VendorFormData['commercial']>) =>
    onChange({ ...data, commercial: { ...data.commercial, ...partial } })

  return (
    <AdminFullPageFormFieldSpan>
      <FormField label="Notes" optional>
        <Textarea
          value={data.commercial.notes}
          onChange={v => patchCommercial({ notes: v })}
          placeholder="Internal notes for finance or operations"
          minRows={4}
          fullWidth
        />
      </FormField>
    </AdminFullPageFormFieldSpan>
  )
}
