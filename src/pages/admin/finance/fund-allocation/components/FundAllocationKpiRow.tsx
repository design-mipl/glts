import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface FundAllocationKpiRowProps {
  totalPassengers: number
  pendingAllocation: number
  allocatedPassengers: number
  pendingAmount: number
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

export function FundAllocationKpiRow({
  totalPassengers,
  pendingAllocation,
  allocatedPassengers,
  pendingAmount,
}: FundAllocationKpiRowProps) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Total passengers" value={String(totalPassengers)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Pending allocation" value={String(pendingAllocation)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Allocated" value={String(allocatedPassengers)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label="Pending fund value"
          value={pendingAmount > 0 ? formatInr(pendingAmount) : '—'}
        />
      </Grid>
    </Grid>
  )
}
