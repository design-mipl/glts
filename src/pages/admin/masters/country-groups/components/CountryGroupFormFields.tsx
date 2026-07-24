import { useMemo } from 'react'
import { FormField, Input, MultiSelect, Select } from '@/design-system/UIComponents'
import { MASTER_STATUS_FILTER_OPTIONS } from '@/pages/admin/masters/config/masterStatusConfig'
import { countryGroupMasterService } from '@/shared/services/countryGroupMasterService'
import type { CountryGroupMasterFormData } from '@/shared/types/countryGroupMaster'

interface CountryGroupFormFieldsProps {
  formData: CountryGroupMasterFormData
  onChange: (next: CountryGroupMasterFormData) => void
  errors: Record<string, string>
}

export function CountryGroupFormFields({
  formData,
  onChange,
  errors,
}: CountryGroupFormFieldsProps) {
  const update = (patch: Partial<CountryGroupMasterFormData>) => onChange({ ...formData, ...patch })

  const statusOptions = MASTER_STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'all').map(
    (o) => ({ value: o.value, label: o.label }),
  )

  const countryOptions = useMemo(() => countryGroupMasterService.listCountryOptions(), [])

  return (
    <>
      <FormField
        label="Group name"
        required
        error={Boolean(errors.name)}
        helperText={errors.name}
      >
        <Input
          value={formData.name}
          onChange={(v) => update({ name: v })}
          placeholder="e.g. Schengen Countries"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField
        label="Countries"
        required
        error={Boolean(errors.countryIds)}
        helperText={errors.countryIds}
      >
        <MultiSelect
          value={formData.countryIds}
          onChange={(value) => update({ countryIds: value.map(String) })}
          options={countryOptions}
          placeholder="Select countries"
          searchable
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Status" required error={Boolean(errors.status)} helperText={errors.status}>
        <Select
          value={formData.status}
          onChange={(v) => update({ status: String(v) as CountryGroupMasterFormData['status'] })}
          options={statusOptions}
          placeholder="Select status"
          size="sm"
          fullWidth
        />
      </FormField>
    </>
  )
}
