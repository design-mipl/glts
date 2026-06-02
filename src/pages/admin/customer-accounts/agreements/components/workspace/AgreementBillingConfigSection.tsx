import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { getServicePresetOptions } from '../../utils/agreementMasterOptions'
import { advanceTypeLabel, processingBlockRuleLabel } from '../../config/agreementStatusConfig'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx, agreementFieldError } from '../agreementFormLayout'

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

  const serviceOptions = getServicePresetOptions(data.workflowType)

  const addServiceRule = () => {
    const first = serviceOptions[0]
    if (!first) return
    updateBilling({
      serviceWiseBillingRules: [
        ...data.billingConfig.serviceWiseBillingRules,
        { servicePresetId: first.value, servicePresetName: first.label, billingRule: 'advance' },
      ],
    })
  }

  if (readOnly) {
    return (
      <Stack spacing={1.5}>
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
            { value: 'mixed', label: 'Mixed' },
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

      {data.billingType === 'mixed' ? (
        <>
          <FormField label="Advance percentage" required {...agreementFieldError(errors, 'advancePercentage')}>
            <Input
              type="number"
              value={String(data.billingConfig.advancePercentage)}
              onChange={(v) => updateBilling({ advancePercentage: Number(v) || 0 })}
              placeholder="Enter advance percentage"
              fullWidth
            />
          </FormField>
          <FormField label="Remaining credit period (days)" required {...agreementFieldError(errors, 'creditPeriodDays')}>
            <Input
              type="number"
              value={String(data.billingConfig.creditPeriodDays)}
              onChange={(v) => updateBilling({ creditPeriodDays: Number(v) || 0 })}
              placeholder="Enter credit period for remaining balance"
              fullWidth
            />
          </FormField>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                Service-wise billing rules
              </Typography>
              <Button label="Add rule" size="sm" startIcon={<Plus size={14} />} onClick={addServiceRule} />
            </Stack>
            <Box sx={agreementEmbeddedTableSx}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service preset</TableCell>
                    <TableCell sx={agreementEmbeddedTableHeadCellSx}>Billing rule</TableCell>
                    <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.billingConfig.serviceWiseBillingRules.map((rule, index) => (
                    <TableRow key={`${rule.servicePresetId}-${index}`}>
                      <TableCell sx={{ fontSize: 13 }}>
                        <Select
                          value={rule.servicePresetId}
                          onChange={(v) => {
                            const servicePresetId = String(v)
                            const service = serviceOptions.find((s) => s.value === servicePresetId)
                            const next = [...data.billingConfig.serviceWiseBillingRules]
                            next[index] = {
                              ...rule,
                              servicePresetId,
                              servicePresetName: service?.label ?? '',
                            }
                            updateBilling({ serviceWiseBillingRules: next })
                          }}
                          options={serviceOptions.map((s) => ({ value: s.value, label: s.label }))}
                          fullWidth
                          size="sm"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        <Select
                          value={rule.billingRule}
                          onChange={(v) => {
                            const next = [...data.billingConfig.serviceWiseBillingRules]
                            next[index] = { ...rule, billingRule: v as 'advance' | 'credit' }
                            updateBilling({ serviceWiseBillingRules: next })
                          }}
                          options={[
                            { value: 'advance', label: 'Advance' },
                            { value: 'credit', label: 'Credit' },
                          ]}
                          fullWidth
                          size="sm"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          aria-label="Remove billing rule"
                          onClick={() =>
                            updateBilling({
                              serviceWiseBillingRules: data.billingConfig.serviceWiseBillingRules.filter((_, i) => i !== index),
                            })
                          }
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
