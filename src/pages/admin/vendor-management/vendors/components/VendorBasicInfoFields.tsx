import { useMemo } from 'react'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'
import { VENDOR_CATEGORY_OPTIONS } from '../config/vendorCategoryConfig'
import { VENDOR_STATUS_OPTIONS, VENDOR_TYPE_OPTIONS } from '../config/vendorStatusConfig'
import { getVendorServiceCountryOptions, getVendorVisaTypeOptions } from '../utils/vendorMasterOptions'

interface VendorBasicInfoFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorBasicInfoFields({ data, onChange }: VendorBasicInfoFieldsProps) {
  const patch = (partial: Partial<VendorFormData>) => onChange({ ...data, ...partial })

  const countryOptions = useMemo(() => getVendorServiceCountryOptions(), [])
  const visaTypeOptions = useMemo(
    () => getVendorVisaTypeOptions(data.serviceCountry),
    [data.serviceCountry],
  )

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
      <FormField label="Country">
        <Select
          size="sm"
          value={data.serviceCountry}
          onChange={v => patch({ serviceCountry: String(v), visaType: '' })}
          options={[{ value: '', label: 'Select country' }, ...countryOptions]}
          placeholder="Select country"
          fullWidth
        />
      </FormField>
      <FormField
        label="Visa type"
        helperText={
          !data.serviceCountry
            ? 'Select a country first'
            : visaTypeOptions.length === 0
              ? 'No visa types configured for this country'
              : undefined
        }
      >
        <Select
          size="sm"
          value={data.visaType}
          onChange={v => patch({ visaType: String(v) })}
          options={[{ value: '', label: 'Select visa type' }, ...visaTypeOptions]}
          placeholder="Select visa type"
          fullWidth
          disabled={!data.serviceCountry || visaTypeOptions.length === 0}
        />
      </FormField>
    </>
  )
}
