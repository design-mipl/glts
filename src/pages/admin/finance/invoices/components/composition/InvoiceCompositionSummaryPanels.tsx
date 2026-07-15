import { Divider, Grid, Stack, Typography } from '@mui/material'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type { InvoiceBillingAdjustmentSnapshot } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../../config/invoiceFeeCategoryLabels'
import type { InvoiceFeeCompositionSummary } from '../../types/invoiceFeeComposition.types'

const FEE = INVOICE_COMPOSITION_FEE_LABELS

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value}
      </Typography>
    </Grid>
  )
}

function formatUnitCount(count: number, unit: string): string {
  const label = count === 1 ? unit : `${unit}s`
  return `${count} ${label}`
}

function InvoiceSummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="baseline"
      spacing={2}
      sx={{ py: 0.625, minWidth: 0 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, flex: 1, minWidth: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ fontSize: 13, textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function InvoiceSummaryDivider() {
  return <Divider sx={{ my: 0.75 }} />
}

interface InvoiceCompositionTotalsPanelProps {
  categoryTotals: InvoiceFeeCompositionSummary
  subtotal: number
  gstTotal: number
  advanceAdjusted: number
  balancePayable: number
}

export function InvoiceCompositionTotalsPanel({
  categoryTotals,
  subtotal,
  gstTotal,
  advanceAdjusted,
  balancePayable,
}: InvoiceCompositionTotalsPanelProps) {
  return (
    <Stack spacing={0} sx={{ width: '100%' }}>
      <InvoiceSummaryLine
        label="Total Applications"
        value={formatUnitCount(categoryTotals.totalApplications, 'Application')}
      />
      <InvoiceSummaryLine
        label="Total Applicants"
        value={formatUnitCount(categoryTotals.totalApplicants, 'Applicant')}
      />

      <InvoiceSummaryDivider />

      <InvoiceSummaryLine label={FEE.billableServices.summaryTotal} value={formatInr(categoryTotals.servicesTotal)} />

      <InvoiceSummaryDivider />

      <InvoiceSummaryLine label="Subtotal" value={formatInr(subtotal)} />
      <InvoiceSummaryLine label="GST" value={formatInr(gstTotal)} />

      <InvoiceSummaryDivider />

      <InvoiceSummaryLine label="Advance Adjusted" value={formatInr(advanceAdjusted)} />
      <InvoiceSummaryLine label="Balance Payable" value={formatInr(balancePayable)} />
    </Stack>
  )
}

interface InvoiceCompositionBillingPanelProps {
  agreement?: CommercialAgreement
  snapshot: InvoiceBillingAdjustmentSnapshot
  dueDate: string
}

export function InvoiceCompositionBillingPanel({
  agreement,
  snapshot,
  dueDate,
}: InvoiceCompositionBillingPanelProps) {
  const billingType = snapshot.billingType

  if (billingType === 'advance') {
    return (
      <Grid container spacing={1.5}>
        <SummaryRow label="Advance Balance" value={formatInr(snapshot.advanceBalance ?? 0)} />
        <SummaryRow label="Advance Adjusted" value={formatInr(snapshot.advanceUtilized ?? 0)} />
        <SummaryRow label="Remaining Advance" value={formatInr(snapshot.remainingAdvance ?? 0)} />
        <SummaryRow label="Balance Payable" value={formatInr(snapshot.outstandingAmount ?? 0)} />
      </Grid>
    )
  }

  if (billingType === 'mixed') {
    return (
      <Grid container spacing={1.5}>
        <SummaryRow label="Advance Balance" value={formatInr(snapshot.advanceBalance ?? 0)} />
        <SummaryRow label="Advance Adjusted" value={formatInr(snapshot.advanceUtilized ?? 0)} />
        <SummaryRow label="Remaining Credit Period" value={`${snapshot.creditPeriodDays ?? agreement?.billingConfig.creditPeriodDays ?? 30} days`} />
        <SummaryRow label="Outstanding Amount" value={formatInr(snapshot.outstandingAmount ?? 0)} />
        <SummaryRow label="Balance Payable" value={formatInr(snapshot.outstandingAmount ?? 0)} />
      </Grid>
    )
  }

  return (
    <Grid container spacing={1.5}>
      <SummaryRow label="Credit Period" value={`${snapshot.creditPeriodDays ?? agreement?.billingConfig.creditPeriodDays ?? 30} days`} />
      <SummaryRow label="Credit Limit" value={formatInr(snapshot.creditLimit ?? 0)} />
      <SummaryRow label="Outstanding Amount" value={formatInr(snapshot.outstandingAmount ?? 0)} />
      <SummaryRow label="Due Date" value={dueDate} />
    </Grid>
  )
}
