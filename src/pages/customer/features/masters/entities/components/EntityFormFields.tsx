import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { EntityMasterFormData } from '@/shared/types/entityMaster'

interface EntityFormFieldsProps {
  variant: 'primary' | 'secondary'
  formData: EntityMasterFormData
  errors: Record<string, string>
  countryOptions: string[]
  onUpdate: (patch: Partial<EntityMasterFormData>) => void
}

function buildCountryOptions(countryOptions: string[]) {
  return [
    { value: '', label: 'Select country' },
    ...countryOptions.map(c => ({ value: c, label: c })),
    { value: 'India', label: 'India' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'United Kingdom', label: 'United Kingdom' },
  ].filter((opt, i, arr) => arr.findIndex(o => o.value === opt.value) === i)
}

export function EntityFormFields({
  variant,
  formData,
  errors,
  countryOptions,
  onUpdate,
}: EntityFormFieldsProps) {
  if (variant === 'secondary') {
    return (
      <>
        <AdminFullPageFormFieldSpan>
          <FormField label="Location / address">
            <Textarea
              value={formData.location}
              onChange={v => onUpdate({ location: v })}
              placeholder="Street address"
              minRows={2}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
        <AdminFullPageFormFieldSpan>
          <FormField label="Notes" optional>
            <Textarea
              value={formData.notes}
              onChange={v => onUpdate({ notes: v })}
              placeholder="Optional notes"
              minRows={3}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </>
    )
  }

  return (
    <>
      <FormField label="Entity name" required error={!!errors.entityName} helperText={errors.entityName}>
        <Input
          value={formData.entityName}
          onChange={v => onUpdate({ entityName: v })}
          placeholder="Enter entity name"
          fullWidth
        />
      </FormField>
      <FormField label="Contact person name" required error={!!errors.contactPersonName} helperText={errors.contactPersonName}>
        <Input
          value={formData.contactPersonName}
          onChange={v => onUpdate({ contactPersonName: v })}
          placeholder="Full name"
          fullWidth
        />
      </FormField>
      <FormField label="Contact person email" error={!!errors.contactPersonEmail} helperText={errors.contactPersonEmail}>
        <Input
          value={formData.contactPersonEmail}
          onChange={v => onUpdate({ contactPersonEmail: v })}
          placeholder="email@company.com"
          fullWidth
        />
      </FormField>
      <FormField label="Contact person mobile" error={!!errors.contactPersonMobile} helperText={errors.contactPersonMobile}>
        <Input
          value={formData.contactPersonMobile}
          onChange={v => onUpdate({ contactPersonMobile: v })}
          placeholder="+91 98765 43210"
          fullWidth
        />
      </FormField>
      <FormField label="City">
        <Input value={formData.city} onChange={v => onUpdate({ city: v })} placeholder="City" fullWidth />
      </FormField>
      <FormField label="Country" required error={!!errors.country} helperText={errors.country}>
        <Select
          value={formData.country}
          onChange={v => onUpdate({ country: String(v) })}
          options={buildCountryOptions(countryOptions)}
          fullWidth
        />
      </FormField>
      <FormField label="Status" required>
        <Select
          value={formData.status}
          onChange={v => onUpdate({ status: v as typeof formData.status })}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          fullWidth
        />
      </FormField>
    </>
  )
}
