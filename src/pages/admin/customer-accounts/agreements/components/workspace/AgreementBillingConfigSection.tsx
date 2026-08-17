import { Box, Stack, Typography } from '@mui/material'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { advanceTypeLabel, processingBlockRuleLabel } from '../../config/agreementStatusConfig'
import { formatAgreementDate } from '../../utils/agreementFormUtils'
import { agreementFieldError } from '../agreementFormLayout'

interface AgreementBillingConfigSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}

export function AgreementBillingConfigSection({
  data,
  errors,
  onChange,
  readOnly = false,
}: AgreementBillingConfigSectionProps) {
  const updateBilling = (patch: Partial<CommercialAgreementFormData['billingConfig']>) => {
    onChange({ ...data, billingConfig: { ...data.billingConfig, ...patch } })
  }

  if (readOnly) {
    return (
      <Stack spacing={1.5}>
        <Typography variant="body2">Agreement start date: {formatAgreementDate(data.startDate)}</Typography>
        <Typography variant="body2">Agreement expiry date: {formatAgreementDate(data.endDate)}</Typography>
        <Typography variant="body2">Billing type: {data.billingType}</Typography>
        {data.billingType === 'credit' ? (
          <>
            <Typography variant="body2">Credit period: {data.billingConfig.creditPeriodDays} days</Typography>
            <Typography variant="body2">Credit limit: ₹{data.billingConfig.creditLimit.toLocaleString('en-IN')}</Typography>
            <Typography variant="body2">Grace period: {data.billingConfig.gracePeriodDays} days</Typography>
          </>
        ) : null}
        {data.billingType === 'advance' ? (
          <>
            <Typography variant="body2">Advance type: {advanceTypeLabel[data.billingConfig.advanceType]}</Typography>
            <Typography variant="body2">
              Processing block: {processingBlockRuleLabel[data.billingConfig.processingBlockRule]}
            </Typography>
          </>
        ) : null}
      </Stack>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      <FormField label="Billing type" required {...agreementFieldError(errors, 'billingType')}>
        <Select
          value={data.billingType}
          onChange={(v) => onChange({ ...data, billingType: v as CommercialAgreementFormData['billingType'] })}
          options={[
            { value: 'advance', label: 'Advance' },
            { value: 'credit', label: 'Credit' },
          ]}
          placeholder="Select billing type"
          fullWidth
        />
      </FormField>

      {data.billingType === 'advance' ? (
        <>
          <FormField label="Advance type" required {...agreementFieldError(errors, 'advanceType')}>
            <Select
              value={data.billingConfig.advanceType}
              onChange={(v) => updateBilling({ advanceType: v as typeof data.billingConfig.advanceType })}
              options={[
                { value: 'full', label: 'Full Advance' },
                { value: 'percentage', label: 'Percentage Advance' },
                { value: 'fixed', label: 'Fixed Advance' },
              ]}
              placeholder="Select advance type"
              fullWidth
            />
          </FormField>
          {data.billingConfig.advanceType === 'percentage' ? (
            <FormField label="Advance percentage">
              <Input
                type="number"
                value={String(data.billingConfig.advancePercentage)}
                onChange={(v) => updateBilling({ advancePercentage: Number(v) || 0 })}
                placeholder="Enter advance percentage"
                fullWidth
              />
            </FormField>
          ) : null}
          {data.billingConfig.advanceType === 'fixed' ? (
            <FormField label="Fixed advance amount (₹)">
              <Input
                type="number"
                value={String(data.billingConfig.fixedAdvanceAmount)}
                onChange={(v) => updateBilling({ fixedAdvanceAmount: Number(v) || 0 })}
                placeholder="Enter fixed advance amount"
                fullWidth
              />
            </FormField>
          ) : null}
          <FormField label="Processing block rule">
            <Select
              value={data.billingConfig.processingBlockRule}
              onChange={(v) => updateBilling({ processingBlockRule: v as typeof data.billingConfig.processingBlockRule })}
              options={Object.entries(processingBlockRuleLabel).map(([value, label]) => ({ value, label }))}
              placeholder="Select processing block rule"
              fullWidth
            />
          </FormField>
        </>
      ) : null}

      {data.billingType === 'credit' ? (
        <>
          <FormField label="Credit period (days)" required {...agreementFieldError(errors, 'creditPeriodDays')}>
            <Input
              type="number"
              value={String(data.billingConfig.creditPeriodDays)}
              onChange={(v) => updateBilling({ creditPeriodDays: Number(v) || 0 })}
              placeholder="Enter credit period in days"
              fullWidth
            />
          </FormField>
          <FormField label="Credit limit (₹)" required {...agreementFieldError(errors, 'creditLimit')}>
            <Input
              type="number"
              value={String(data.billingConfig.creditLimit)}
              onChange={(v) => updateBilling({ creditLimit: Number(v) || 0 })}
              placeholder="Enter credit limit"
              fullWidth
            />
          </FormField>
          <FormField label="Grace period (days)">
            <Input
              type="number"
              value={String(data.billingConfig.gracePeriodDays)}
              onChange={(v) => updateBilling({ gracePeriodDays: Number(v) || 0 })}
              placeholder="Enter grace period"
              fullWidth
            />
          </FormField>
        </>
      ) : null}
    </Box>
  )
}
