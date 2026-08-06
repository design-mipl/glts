import { FormField, Select, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import {
  SLA_DOMAIN_OPTIONS,
  emptySlaHoursPlan,
  getDefaultSlaSubmodule,
  getSlaSubmoduleOptions,
  type SlaDomain,
  type SlaMasterFormData,
  type SlaSubmodule,
} from '@/shared/types/slaMaster'

interface SlaFormFieldsProps {
  formData: SlaMasterFormData
  onChange: (next: SlaMasterFormData) => void
  errors: Record<string, string>
  moduleDisabled?: boolean
  submoduleDisabled?: boolean
}

export function SlaFormFields({
  formData,
  onChange,
  errors,
  moduleDisabled = false,
  submoduleDisabled = false,
}: SlaFormFieldsProps) {
  const submoduleOptions = getSlaSubmoduleOptions(formData.domain).map((item) => ({
    value: item.value,
    label: item.label,
  }))

  const resetHours = (domain: SlaDomain, segment: SlaSubmodule): Pick<
    SlaMasterFormData,
    'single' | 'bulkBands'
  > => ({
    single: emptySlaHoursPlan(domain, segment),
    bulkBands: {
      '0_10': emptySlaHoursPlan(domain, segment),
      '11_20': emptySlaHoursPlan(domain, segment),
      '21_plus': emptySlaHoursPlan(domain, segment),
    },
  })

  const handleModuleChange = (value: string | number) => {
    const domain = value as SlaDomain
    const segment = getDefaultSlaSubmodule(domain)
    onChange({
      ...formData,
      domain,
      segment,
      ...resetHours(domain, segment),
    })
  }

  const handleSubmoduleChange = (value: string | number) => {
    const segment = value as SlaSubmodule
    onChange({
      ...formData,
      segment,
      ...resetHours(formData.domain, segment),
    })
  }

  return (
    <>
      <AdminFullPageFormFieldSpan>
        <FormField
          label="Module"
          required
          error={Boolean(errors.domain)}
          helperText={errors.domain || 'Matches admin sidebar module groups'}
        >
          <Select
            value={formData.domain}
            onChange={handleModuleChange}
            options={SLA_DOMAIN_OPTIONS}
            size="sm"
            fullWidth
            disabled={moduleDisabled}
          />
        </FormField>
      </AdminFullPageFormFieldSpan>

      <AdminFullPageFormFieldSpan>
        <FormField
          label="Submodule"
          required
          error={Boolean(errors.segment)}
          helperText={errors.segment || 'Nav items under the selected module'}
        >
          <Select
            value={formData.segment}
            onChange={handleSubmoduleChange}
            options={submoduleOptions}
            size="sm"
            fullWidth
            disabled={submoduleDisabled}
          />
        </FormField>
      </AdminFullPageFormFieldSpan>

      <AdminFullPageFormFieldSpan>
        <Toggle
          checked={formData.status === 'active'}
          onChange={(checked) =>
            onChange({ ...formData, status: checked ? 'active' : 'inactive' })
          }
          label="Active"
          size="sm"
        />
      </AdminFullPageFormFieldSpan>
    </>
  )
}
