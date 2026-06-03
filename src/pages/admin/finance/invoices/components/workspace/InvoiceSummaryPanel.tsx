import { Collapse, Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { BaseCard, FormField, Input, Toggle } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type { InvoiceBillingAdjustmentSnapshot, InvoiceTaxConfig } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface InvoiceTaxConfigFieldsProps {
  taxConfig: InvoiceTaxConfig
  onChange: (config: InvoiceTaxConfig) => void
}

export function InvoiceTaxConfigFields({ taxConfig, onChange }: InvoiceTaxConfigFieldsProps) {
  const patch = (partial: Partial<InvoiceTaxConfig>) => onChange({ ...taxConfig, ...partial })

  return (
    <Stack spacing={1.5}>
      <FormField label="GST applicable">
        <Toggle checked={taxConfig.gstApplicable} onChange={v => patch({ gstApplicable: v })} label="Apply GST" />
      </FormField>
      {taxConfig.gstApplicable ? (
        <FormField label="GST percentage">
          <Input
            value={String(taxConfig.gstPercentage)}
            onChange={v => patch({ gstPercentage: Number(v) || 0 })}
            size="sm"
            fullWidth
          />
        </FormField>
      ) : null}
      <Divider />
      <FormField label="TDS applicable">
        <Toggle checked={taxConfig.tdsApplicable} onChange={v => patch({ tdsApplicable: v })} label="Apply TDS" />
      </FormField>
      {taxConfig.tdsApplicable ? (
        <FormField label="TDS percentage">
          <Input
            value={String(taxConfig.tdsPercentage)}
            onChange={v => patch({ tdsPercentage: Number(v) || 0 })}
            size="sm"
            fullWidth
          />
        </FormField>
      ) : null}
    </Stack>
  )
}

interface InvoiceSummaryPanelProps {
  subtotal: number
  gstTotal: number
  tdsAmount: number
  additionalCharges: number
  finalAmount: number
  advanceAvailable: number
  advanceAdjusted: number
  creditApplied: number
  balancePayable: number
  billingAdjustment?: InvoiceBillingAdjustmentSnapshot
  agreement?: CommercialAgreement
  taxConfig: InvoiceTaxConfig
  onTaxConfigChange: (config: InvoiceTaxConfig) => void
  onAdditionalChargesChange: (value: number) => void
  paymentTerms: string
  dueDate: string
  onPaymentTermsChange: (value: string) => void
  onDueDateChange: (value: string) => void
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary" fontWeight={bold ? 600 : 400}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={bold ? 700 : 500}>
        {value}
      </Typography>
    </Stack>
  )
}

function BillingTypeBlock({ snapshot }: { snapshot?: InvoiceBillingAdjustmentSnapshot }) {
  if (!snapshot) return null

  if (snapshot.billingType === 'credit') {
    return (
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Credit billing
        </Typography>
        <SummaryRow label="Credit limit" value={formatInr(snapshot.creditLimit ?? 0)} />
        <SummaryRow label="Credit used" value={formatInr(snapshot.creditUsed ?? 0)} />
        <SummaryRow label="Available credit" value={formatInr(snapshot.creditAvailable ?? 0)} />
        <SummaryRow label="Credit period" value={`${snapshot.creditPeriodDays ?? 30} days`} />
      </Stack>
    )
  }

  if (snapshot.billingType === 'advance') {
    return (
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Advance billing
        </Typography>
        <SummaryRow label="Advance balance" value={formatInr(snapshot.advanceBalance ?? 0)} />
        <SummaryRow label="Advance utilized" value={formatInr(snapshot.advanceUtilized ?? 0)} />
        <SummaryRow label="Remaining advance" value={formatInr(snapshot.remainingAdvance ?? 0)} />
      </Stack>
    )
  }

  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        Mixed billing
      </Typography>
      <SummaryRow label="Advance balance" value={formatInr(snapshot.advanceBalance ?? 0)} />
      <SummaryRow label="Advance adjusted" value={formatInr(snapshot.advanceUtilized ?? 0)} />
      <SummaryRow label="Outstanding (credit)" value={formatInr(snapshot.outstandingAmount ?? 0)} />
      <SummaryRow label="Credit period remaining" value={`${snapshot.creditPeriodDays ?? 30} days`} />
    </Stack>
  )
}

export function InvoiceSummaryPanel({
  subtotal,
  gstTotal,
  tdsAmount,
  additionalCharges,
  finalAmount,
  advanceAvailable,
  advanceAdjusted,
  creditApplied,
  balancePayable,
  billingAdjustment,
  taxConfig,
  onTaxConfigChange,
  onAdditionalChargesChange,
  paymentTerms,
  dueDate,
  onPaymentTermsChange,
  onDueDateChange,
}: InvoiceSummaryPanelProps) {
  const [showTaxConfig, setShowTaxConfig] = useState(false)

  return (
    <BaseCard sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="body2" fontWeight={700}>
          Invoice summary
        </Typography>
        <Stack spacing={1}>
          <SummaryRow label="Subtotal" value={formatInr(subtotal)} />
          <SummaryRow label="GST" value={formatInr(gstTotal)} />
          <SummaryRow label="TDS" value={formatInr(-tdsAmount)} />
          <FormField label="Additional charges">
            <Input
              value={String(additionalCharges)}
              onChange={v => onAdditionalChargesChange(Number(v) || 0)}
              size="sm"
              fullWidth
            />
          </FormField>
          <Divider />
          <SummaryRow label="Invoice total" value={formatInr(finalAmount)} bold />
          <SummaryRow label="Advance available" value={formatInr(advanceAvailable)} />
          <SummaryRow label="Advance adjusted" value={formatInr(advanceAdjusted)} />
          <SummaryRow label="Credit applied" value={formatInr(creditApplied)} />
          <SummaryRow label="Balance payable" value={formatInr(balancePayable)} bold />
        </Stack>
        <Divider />
        <BillingTypeBlock snapshot={billingAdjustment} />
        <FormField label="Due date">
          <Input value={dueDate} onChange={onDueDateChange} size="sm" fullWidth placeholder="YYYY-MM-DD" />
        </FormField>
        <FormField label="Payment terms">
          <Input value={paymentTerms} onChange={onPaymentTermsChange} size="sm" fullWidth />
        </FormField>
        <Typography
          variant="caption"
          color="primary"
          sx={{ cursor: 'pointer', fontWeight: 600 }}
          onClick={() => setShowTaxConfig(v => !v)}
        >
          {showTaxConfig ? 'Hide tax configuration' : 'Show tax configuration'}
        </Typography>
        <Collapse in={showTaxConfig}>
          <InvoiceTaxConfigFields taxConfig={taxConfig} onChange={onTaxConfigChange} />
        </Collapse>
      </Stack>
    </BaseCard>
  )
}
