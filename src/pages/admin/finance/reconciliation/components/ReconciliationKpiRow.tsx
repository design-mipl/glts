import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatReconciliationMoney } from '../utils/reconciliationListingUtils'

interface ReconciliationKpiRowProps {
  total: number
  pending: number
  submitted: number
  rejected: number
  totalAmount: number
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <BaseCard sx={{ px: 2, py: 1.5, height: '100%' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
      >
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.75 }}>
        {value}
      </Typography>
    </BaseCard>
  )
}

export function ReconciliationKpiRow({
  total,
  pending,
  submitted,
  rejected,
  totalAmount,
}: ReconciliationKpiRowProps) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <KpiCard label="Records" value={String(total)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <KpiCard label="Pending" value={String(pending)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <KpiCard label="Submitted" value={String(submitted)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <KpiCard label="Rejected" value={String(rejected)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 4 }}>
        <KpiCard label="Total amount" value={formatReconciliationMoney(totalAmount)} />
      </Grid>
    </Grid>
  )
}
