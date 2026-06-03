import { Stack } from '@mui/material'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import { getCompanyOptions, getVesselOptions } from '@/shared/utils/invoiceBillingEngine'

interface CompanyWiseBillingFieldsProps {
  companyId: string
  billingEntity: string
  billingEntityOverride: string
  vesselId: string
  billingPeriodFrom: string
  billingPeriodTo: string
  poReference: string
  onCompanyChange: (companyId: string, companyName: string, billingEntity: string) => void
  onBillingEntityOverrideChange: (value: string) => void
  onVesselChange: (vesselId: string, vesselName: string) => void
  onBillingPeriodFromChange: (value: string) => void
  onBillingPeriodToChange: (value: string) => void
  onPoReferenceChange: (value: string) => void
}

export function CompanyWiseBillingFields({
  companyId,
  billingEntity,
  billingEntityOverride,
  vesselId,
  billingPeriodFrom,
  billingPeriodTo,
  poReference,
  onCompanyChange,
  onBillingEntityOverrideChange,
  onVesselChange,
  onBillingPeriodFromChange,
  onBillingPeriodToChange,
  onPoReferenceChange,
}: CompanyWiseBillingFieldsProps) {
  const companyOptions = getCompanyOptions()
  const vesselOptions = getVesselOptions()

  return (
    <Stack spacing={2}>
      <FormField label="Company" required>
        <Select
          value={companyId}
          onChange={v => {
            const opt = companyOptions.find(c => c.value === v)
            if (opt) onCompanyChange(opt.value, opt.label, opt.billingEntity)
          }}
          options={companyOptions.map(c => ({ value: c.value, label: c.label }))}
          placeholder="Select company"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Billing period from">
        <Input
          value={billingPeriodFrom}
          onChange={onBillingPeriodFromChange}
          placeholder="YYYY-MM-DD"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Billing period to">
        <Input
          value={billingPeriodTo}
          onChange={onBillingPeriodToChange}
          placeholder="YYYY-MM-DD"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Billing entity">
        <Input
          value={billingEntityOverride || billingEntity}
          onChange={onBillingEntityOverrideChange}
          placeholder="Optional billing entity override"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Vessel">
        <Select
          value={vesselId}
          onChange={v => {
            const opt = vesselOptions.find(o => o.value === v)
            if (opt) onVesselChange(opt.value, opt.label)
          }}
          options={vesselOptions}
          placeholder="Optional vessel"
          size="sm"
          clearable
          fullWidth
        />
      </FormField>
      <FormField label="PO reference">
        <Input value={poReference} onChange={onPoReferenceChange} placeholder="Optional PO reference" size="sm" fullWidth />
      </FormField>
    </Stack>
  )
}
