import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'

interface FundSettlementKpiRowProps {
  summary: FundBankSettlementSummary
}

function KpiCard({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
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
        fontWeight={emphasize ? 800 : 700}
        sx={{ mt: 0.5, fontSize: emphasize ? 18 : 16 }}
      >
        {value}
      </Typography>
    </BaseCard>
  )
}

export function FundSettlementKpiRow({ summary }: FundSettlementKpiRowProps) {
  return (
    <Grid container spacing={1.25}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard label="Allocated amount" value={formatInr(summary.allocatedAmount)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard label="Total withdrawn" value={formatInr(summary.totalWithdrawn)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard
          label="Available in bank"
          value={formatInr(summary.availableInBank)}
          emphasize
        />
      </Grid>
    </Grid>
  )
}
