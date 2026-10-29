import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface ExpenseApplicationKpiRowProps {
  needsUpdate: number
  paid: number
  reconciled: number
  totalExpense: number
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <BaseCard sx={{ px: 2, py: 1.5, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.75 }}>
        {value}
      </Typography>
    </BaseCard>
  )
}

export function ExpenseApplicationKpiRow({
  needsUpdate,
  paid,
  reconciled,
  totalExpense,
}: ExpenseApplicationKpiRowProps) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Needs update" value={String(needsUpdate)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Paid" value={String(paid)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Reconciled" value={String(reconciled)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Total expense" value={formatInr(totalExpense)} />
      </Grid>
    </Grid>
  )
}
