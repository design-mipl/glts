import { Divider, Stack, Typography } from '@mui/material'
import { BaseCard, FormField, Input, Toggle } from '@/design-system/UIComponents'
import type { InvoiceTaxConfig } from '@/shared/types/invoice'
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

export function InvoiceSummaryPanel({
  subtotal,
  gstTotal,
  tdsAmount,
  additionalCharges,
  finalAmount,
  taxConfig,
  onTaxConfigChange,
  onAdditionalChargesChange,
  paymentTerms,
  dueDate,
  onPaymentTermsChange,
  onDueDateChange,
}: InvoiceSummaryPanelProps) {
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
          <SummaryRow label="Final amount" value={formatInr(finalAmount)} bold />
        </Stack>
        <Divider />
        <InvoiceTaxConfigFields taxConfig={taxConfig} onChange={onTaxConfigChange} />
        <FormField label="Payment terms">
          <Input value={paymentTerms} onChange={onPaymentTermsChange} size="sm" fullWidth />
        </FormField>
        <FormField label="Due date">
          <Input value={dueDate} onChange={onDueDateChange} size="sm" fullWidth placeholder="YYYY-MM-DD" />
        </FormField>
      </Stack>
    </BaseCard>
  )
}
