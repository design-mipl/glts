import { FormField, Input, Toggle } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'

interface VendorTaxFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorTaxFields({ data, onChange }: VendorTaxFieldsProps) {
  const patch = (partial: Partial<VendorFormData>) => onChange({ ...data, ...partial })

  return (
    <>
      <FormField label="PAN number">
        <Input
          size="sm"
          value={data.panNumber}
          onChange={v => patch({ panNumber: v })}
          placeholder="AAAAA9999A"
          fullWidth
        />
      </FormField>
      <FormField label="GST applicable">
        <Toggle
          checked={data.gstApplicable}
          onChange={checked => patch({ gstApplicable: checked, gstNumber: checked ? data.gstNumber : '' })}
          label={data.gstApplicable ? 'Yes' : 'No'}
        />
      </FormField>
      {data.gstApplicable ? (
        <FormField label="GST number" required>
          <Input
            size="sm"
            value={data.gstNumber}
            onChange={v => patch({ gstNumber: v })}
            placeholder="27AAAAA9999A1Z5"
            fullWidth
          />
        </FormField>
      ) : null}
    </>
  )
}
