import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { VesselMasterFormData } from '@/shared/types/vesselMaster'
import { vesselTypeOptions } from '../config/vesselTypeConfig'

interface VesselFormFieldsProps {
  variant: 'primary' | 'secondary'
  formData: VesselMasterFormData
  errors: Record<string, string>
  flagOptions: string[]
  onUpdate: (patch: Partial<VesselMasterFormData>) => void
}

function buildFlagOptions(flagOptions: string[]) {
  return [
    { value: '', label: 'Select country' },
    ...flagOptions.map(c => ({ value: c, label: c })),
    { value: 'Panama', label: 'Panama' },
    { value: 'Liberia', label: 'Liberia' },
    { value: 'Marshall Islands', label: 'Marshall Islands' },
    { value: 'India', label: 'India' },
    { value: 'Norway', label: 'Norway' },
  ].filter((opt, i, arr) => arr.findIndex(o => o.value === opt.value) === i)
}

export function VesselFormFields({
  variant,
  formData,
  errors,
  flagOptions,
  onUpdate,
}: VesselFormFieldsProps) {
  if (variant === 'secondary') {
    return (
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
    )
  }

  return (
    <>
      <FormField label="Vessel name" required error={!!errors.vesselName} helperText={errors.vesselName}>
        <Input
          value={formData.vesselName}
          onChange={v => onUpdate({ vesselName: v })}
          placeholder="Enter vessel name"
          fullWidth
        />
      </FormField>
      <FormField label="IMO number" error={!!errors.imoNumber} helperText={errors.imoNumber}>
        <Input
          value={formData.imoNumber}
          onChange={v => onUpdate({ imoNumber: v.replace(/\D/g, '').slice(0, 7) })}
          placeholder="7-digit IMO"
          fullWidth
        />
      </FormField>
      <FormField label="Vessel type" error={!!errors.vesselType} helperText={errors.vesselType}>
        <Select
          value={formData.vesselType}
          onChange={v => onUpdate({ vesselType: v as typeof formData.vesselType })}
          options={vesselTypeOptions.map(o => ({ value: o.value, label: o.label }))}
          fullWidth
        />
      </FormField>
      <FormField label="Flag / registered country" error={!!errors.flagCountry} helperText={errors.flagCountry}>
        <Select
          value={formData.flagCountry}
          onChange={v => onUpdate({ flagCountry: String(v) })}
          options={buildFlagOptions(flagOptions)}
          fullWidth
        />
      </FormField>
      <FormField label="Port of registry">
        <Input
          value={formData.portOfRegistry}
          onChange={v => onUpdate({ portOfRegistry: v })}
          placeholder="e.g. Mumbai"
          fullWidth
        />
      </FormField>
      <FormField label="Status">
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
