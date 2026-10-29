import { useMemo } from 'react'
import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { OrganizationLocationMasterFormData } from '@/shared/types/organizationLocationMaster'
import {
  getCompanyAddressCountryOptions,
  getCompanyCityOptions,
  getCompanyStateOptions,
} from '@/shared/utils/companyAddressOptions'
import { ORGANIZATION_TYPE_OPTIONS } from '../config/organizationTypeConfig'

type FormSection = 'organization' | 'address'

interface OrganizationLocationFormFieldsProps {
  formData: OrganizationLocationMasterFormData
  onChange: (next: OrganizationLocationMasterFormData) => void
  errors: Record<string, string>
  section: FormSection
}

export function OrganizationLocationFormFields({
  formData,
  onChange,
  errors,
  section,
}: OrganizationLocationFormFieldsProps) {
  const patch = (partial: Partial<OrganizationLocationMasterFormData>) =>
    onChange({ ...formData, ...partial })

  const countryOptions = useMemo(() => getCompanyAddressCountryOptions(), [])
  const stateOptions = useMemo(
    () => getCompanyStateOptions(formData.country),
    [formData.country],
  )
  const cityOptions = useMemo(
    () => getCompanyCityOptions(formData.country, formData.state),
    [formData.country, formData.state],
  )
  const addressDropdownsEnabled = Boolean(formData.country)

  if (section === 'organization') {
    return (
      <>
        <AdminFullPageFormFieldSpan>
          <FormField
            label="Organization / location name"
            required
            error={Boolean(errors.name)}
            helperText={errors.name}
          >
            <Input
              value={formData.name}
              onChange={(v) => patch({ name: v })}
              placeholder="e.g. GLTS Mumbai"
              size="sm"
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
        <FormField
          label="Organization type"
          required
          error={Boolean(errors.organizationType)}
          helperText={errors.organizationType}
        >
          <Select
            value={formData.organizationType}
            onChange={(v) =>
              patch({ organizationType: v as OrganizationLocationMasterFormData['organizationType'] })
            }
            options={ORGANIZATION_TYPE_OPTIONS}
            placeholder="Select type"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="Contact person"
          required
          error={Boolean(errors.contactPerson)}
          helperText={errors.contactPerson}
        >
          <Input
            value={formData.contactPerson}
            onChange={(v) => patch({ contactPerson: v })}
            placeholder="Contact person name"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="Mobile number"
          required
          error={Boolean(errors.mobileNumber)}
          helperText={errors.mobileNumber}
        >
          <Input
            value={formData.mobileNumber}
            onChange={(v) => patch({ mobileNumber: v })}
            placeholder="+91 …"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="Email address"
          required
          error={Boolean(errors.emailAddress)}
          helperText={errors.emailAddress}
        >
          <Input
            value={formData.emailAddress}
            onChange={(v) => patch({ emailAddress: v })}
            placeholder="email@company.com"
            size="sm"
            fullWidth
          />
        </FormField>
      </>
    )
  }

  return (
    <>
      <AdminFullPageFormFieldSpan>
        <FormField
          label="Address"
          required
          error={Boolean(errors.address)}
          helperText={errors.address}
        >
          <Textarea
            value={formData.address}
            onChange={(v) => patch({ address: v })}
            placeholder="Street address"
            rows={2}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <FormField
        label="Country"
        required
        error={Boolean(errors.country)}
        helperText={errors.country}
      >
        <Select
          value={formData.country}
          onChange={(v) => {
            const country = String(v)
            const option = countryOptions.find((c) => c.value === country)
            patch({
              countryId: country,
              country: option?.countryName ?? country,
              state: '',
              city: '',
            })
          }}
          options={countryOptions.map((c) => ({ value: c.value, label: c.label }))}
          placeholder="Select country"
          size="sm"
          clearable
          fullWidth
        />
      </FormField>
      <FormField
        label="State"
        required
        error={Boolean(errors.state)}
        helperText={errors.state || (!formData.country ? 'Select a country first' : undefined)}
      >
        <Select
          value={formData.state}
          onChange={(v) => {
            const state = String(v)
            const nextCity = getCompanyCityOptions(formData.country, state).some(
              (option) => option.value === formData.city,
            )
              ? formData.city
              : ''
            patch({ state, city: nextCity })
          }}
          options={stateOptions}
          placeholder="Select state"
          size="sm"
          clearable
          fullWidth
          disabled={!addressDropdownsEnabled}
        />
      </FormField>
      <FormField
        label="City"
        required
        error={Boolean(errors.city)}
        helperText={errors.city || (!formData.state ? 'Select a state first' : undefined)}
      >
        <Select
          value={formData.city}
          onChange={(v) => patch({ city: String(v) })}
          options={cityOptions}
          placeholder="Select city"
          size="sm"
          clearable
          fullWidth
          disabled={!addressDropdownsEnabled || !formData.state}
        />
      </FormField>
      <FormField
        label="Pincode"
        required
        error={Boolean(errors.pincode)}
        helperText={errors.pincode}
      >
        <Input
          value={formData.pincode}
          onChange={(v) => patch({ pincode: v })}
          placeholder="Enter pincode"
          size="sm"
          fullWidth
        />
      </FormField>
    </>
  )
}
