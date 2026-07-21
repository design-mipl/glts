import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'

interface FundSettlementKpiRowProps {
  summary: FundBankSettlementSummary
}

function formatSettlementAmount(amount: number): string {
  if (amount > 0) return `+${formatInr(amount)}`
  return formatInr(amount)
}

function settlementAmountHint(amount: number): string {
  if (amount > 0) return 'Finance reimburses Ground Ops'
  if (amount < 0) return 'Ground Ops returns excess to Finance'
  return 'Settlement completed'
}

function KpiCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'surplus' | 'deficit' | 'settled'
}) {
  const valueColor =
    tone === 'surplus'
      ? 'warning.main'
      : tone === 'deficit'
        ? 'success.main'
        : tone === 'settled'
          ? 'text.primary'
          : 'text.primary'

  return (
    <BaseCard sx={{ px: 1.75, py: 1.25, height: '100%' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        color={valueColor}
        sx={{ mt: 0.5, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}
      >
        {value}
      </Typography>
      {hint ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.35, fontSize: 10, fontWeight: 600, display: 'block', lineHeight: 1.3 }}
        >
          {hint}
        </Typography>
      ) : null}
    </BaseCard>
  )
}

export function FundSettlementKpiRow({ summary }: FundSettlementKpiRowProps) {
  const settlement = summary.settlementAmount
  const settlementTone: 'surplus' | 'deficit' | 'settled' =
    settlement > 0 ? 'surplus' : settlement < 0 ? 'deficit' : 'settled'

  return (
    <Grid container spacing={1.25}>
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="Allocated amount" value={formatInr(summary.allocatedAmount)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="Total withdrawn" value={formatInr(summary.totalWithdrawn)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="Available in bank" value={formatInr(summary.availableInBank)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="In hand cash" value={formatInr(summary.inHandCash)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="Expenses incurred" value={formatInr(summary.expensesIncurred)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard
          label="Settlement amount"
          value={formatSettlementAmount(settlement)}
          tone={settlementTone}
          hint={settlementAmountHint(settlement)}
        />
      </Grid>
    </Grid>
  )
}
