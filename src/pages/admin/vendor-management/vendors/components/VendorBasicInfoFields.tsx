import { FormField, Input, Select } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'
import { VENDOR_CATEGORY_OPTIONS } from '../config/vendorCategoryConfig'
import { VENDOR_STATUS_OPTIONS, VENDOR_TYPE_OPTIONS } from '../config/vendorStatusConfig'

interface VendorBasicInfoFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorBasicInfoFields({ data, onChange }: VendorBasicInfoFieldsProps) {
  const patch = (partial: Partial<VendorFormData>) => onChange({ ...data, ...partial })

  return (
    <>
      <FormField label="Vendor name" required>
        <Input
          size="sm"
          value={data.vendorName}
          onChange={v => patch({ vendorName: v })}
          placeholder="Enter vendor name"
          fullWidth
        />
      </FormField>
      <FormField label="Vendor category" required>
        <Select
          size="sm"
          value={data.vendorCategory}
          onChange={v => patch({ vendorCategory: v as VendorFormData['vendorCategory'] })}
          options={VENDOR_CATEGORY_OPTIONS}
          placeholder="Select category"
          fullWidth
        />
      </FormField>
      <FormField label="Vendor type" required>
        <Select
          size="sm"
          value={data.vendorType}
          onChange={v => patch({ vendorType: v as VendorFormData['vendorType'] })}
          options={VENDOR_TYPE_OPTIONS}
          placeholder="Select type"
          fullWidth
        />
      </FormField>
      <FormField label="Status">
        <Select
          size="sm"
          value={data.status}
          onChange={v => patch({ status: v as VendorFormData['status'] })}
          options={VENDOR_STATUS_OPTIONS}
          placeholder="Status"
          fullWidth
        />
      </FormField>
    </>
  )
}
