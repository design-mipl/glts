import { useMemo } from 'react'
import { FormField, Input, MultiSelect } from '@/design-system/UIComponents'
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
    </>
  )
}
