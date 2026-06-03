import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { Checkbox, DatePicker, FormField, Input, Select, Toggle } from '@/design-system/UIComponents'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../config/agreementStatusConfig'

interface AgreementBillingConfigFieldsProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
  variant?: 'commercial' | 'creditTax'
}

export function AgreementBillingConfigFields({
  data,
  onChange,
  variant = 'commercial',
}: AgreementBillingConfigFieldsProps) {
  const updateBilling = (patch: Partial<CommercialAgreementFormData['billingConfig']>) => {
    onChange({ ...data, billingConfig: { ...data.billingConfig, ...patch } })
  }

  const setAgreementType = (agreementType: CommercialAgreementFormData['agreementType']) => {
    onChange(commercialAgreementService.syncDocumentsForAgreementType(data, agreementType))
  }

  if (variant === 'creditTax') {
    return (
      <>
        <AdminFullPageFormFieldSpan>
          <FormField label="Credit billing">
            <Toggle
              checked={data.billingConfig.creditBillingEnabled}
              onChange={(checked) => updateBilling({ creditBillingEnabled: checked })}
              label="Credit billing enabled"
              size="sm"
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
        <FormField label="Billing cycle">
          <Select
            value={data.billingConfig.billingCycle}
            onChange={(v) => updateBilling({ billingCycle: v as typeof data.billingConfig.billingCycle })}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'custom', label: 'Custom' },
            ]}
            fullWidth
          />
        </FormField>
        <FormField label="Credit period (days)">
          <Input
            type="number"
            value={String(data.billingConfig.creditPeriodDays)}
            onChange={(v) => updateBilling({ creditPeriodDays: Number(v) || 0 })}
            fullWidth
          />
        </FormField>
        <FormField label="Credit limit (₹)">
          <Input
            type="number"
            value={String(data.billingConfig.creditLimit)}
            onChange={(v) => updateBilling({ creditLimit: Number(v) || 0 })}
            fullWidth
          />
        </FormField>
        <Checkbox
          label="GST applicable"
          checked={data.billingConfig.gstApplicable}
          onChange={(checked) => updateBilling({ gstApplicable: checked })}
        />
        <FormField label="GST %">
          <Input
            type="number"
            value={String(data.billingConfig.gstPercentage)}
            onChange={(v) => updateBilling({ gstPercentage: Number(v) || 0 })}
            fullWidth
          />
        </FormField>
        <Checkbox
          label="TDS applicable"
          checked={data.billingConfig.tdsApplicable}
          onChange={(checked) => updateBilling({ tdsApplicable: checked })}
        />
        <FormField label="TDS %">
          <Input
            type="number"
            value={String(data.billingConfig.tdsPercentage)}
            onChange={(v) => updateBilling({ tdsPercentage: Number(v) || 0 })}
            fullWidth
          />
        </FormField>
      </>
    )
  }

  return (
    <>
      <FormField label="Agreement type" required>
        <Select
          value={data.agreementType}
          onChange={(v) => setAgreementType(v as CommercialAgreementFormData['agreementType'])}
          options={[
            { value: 'agreemented', label: 'Agreemented' },
            { value: 'non_agreemented', label: 'Non-agreemented' },
          ]}
          fullWidth
        />
      </FormField>
      <FormField label="Workflow type">
        <Select
          value={data.workflowType}
          onChange={(v) => onChange({ ...data, workflowType: v as CommercialAgreementFormData['workflowType'] })}
          options={AGREEMENT_WORKFLOW_OPTIONS}
          fullWidth
        />
      </FormField>
      <FormField label="Billing type">
        <Select
          value={data.billingType}
          onChange={(v) => onChange({ ...data, billingType: v as CommercialAgreementFormData['billingType'] })}
          options={[
            { value: 'credit', label: 'Credit' },
            { value: 'advance', label: 'Advance' },
            { value: 'mixed', label: 'Mixed' },
          ]}
          fullWidth
        />
      </FormField>
      <FormField label="Start date" required>
        <DatePicker
          value={data.startDate ? new Date(data.startDate) : null}
          onChange={(date) => onChange({ ...data, startDate: date ? date.toISOString().slice(0, 10) : '' })}
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="End date" required>
          <DatePicker
            value={data.endDate ? new Date(data.endDate) : null}
            onChange={(date) => onChange({ ...data, endDate: date ? date.toISOString().slice(0, 10) : '' })}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
