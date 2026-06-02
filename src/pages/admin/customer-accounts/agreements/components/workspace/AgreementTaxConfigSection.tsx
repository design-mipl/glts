import { Checkbox, FormField, Input } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { agreementFieldError } from '../agreementFormLayout'

interface AgreementTaxConfigSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}

export function AgreementTaxConfigSection({
  data,
  errors,
  onChange,
  readOnly = false,
}: AgreementTaxConfigSectionProps) {
  const updateBilling = (patch: Partial<CommercialAgreementFormData['billingConfig']>) => {
    onChange({ ...data, billingConfig: { ...data.billingConfig, ...patch } })
  }

  if (readOnly) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
        <div>GST applicable: {data.billingConfig.gstApplicable ? 'Yes' : 'No'}</div>
        <div>GST %: {data.billingConfig.gstPercentage}</div>
        <div>TDS applicable: {data.billingConfig.tdsApplicable ? 'Yes' : 'No'}</div>
        <div>TDS %: {data.billingConfig.tdsPercentage}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      <Checkbox
        label="GST applicable"
        checked={data.billingConfig.gstApplicable}
        onChange={(checked) => updateBilling({ gstApplicable: checked })}
      />
      <FormField label="GST percentage" {...agreementFieldError(errors, 'gstPercentage')}>
        <Input
          type="number"
          value={String(data.billingConfig.gstPercentage)}
          onChange={(v) => updateBilling({ gstPercentage: Number(v) || 0 })}
          placeholder="Enter GST percentage"
          fullWidth
          disabled={!data.billingConfig.gstApplicable}
        />
      </FormField>
      <Checkbox
        label="TDS applicable"
        checked={data.billingConfig.tdsApplicable}
        onChange={(checked) => updateBilling({ tdsApplicable: checked })}
      />
      <FormField label="TDS percentage" {...agreementFieldError(errors, 'tdsPercentage')}>
        <Input
          type="number"
          value={String(data.billingConfig.tdsPercentage)}
          onChange={(v) => updateBilling({ tdsPercentage: Number(v) || 0 })}
          placeholder="Enter TDS percentage"
          fullWidth
          disabled={!data.billingConfig.tdsApplicable}
        />
      </FormField>
    </div>
  )
}
