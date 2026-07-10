import { Grid } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface VendorBillingKpiRowProps {
  totalVendors: number
  awaitingInvoiceTotal: number
  totalOutstanding: number
  vendorsWithOutstanding: number
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <BaseCard sx={{ p: 2, height: '100%' }}>
      <Grid container direction="column" spacing={0.5}>
        <Grid>
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.45, opacity: 0.7 }}>
            {label}
          </span>
        </Grid>
        <Grid>
          <span style={{ fontSize: 20, fontWeight: 700 }}>{value}</span>
        </Grid>
      </Grid>
    </BaseCard>
  )
}

export function VendorBillingKpiRow({
  totalVendors,
  awaitingInvoiceTotal,
  totalOutstanding,
  vendorsWithOutstanding,
}: VendorBillingKpiRowProps) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Total vendors" value={String(totalVendors)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Charges awaiting invoice" value={String(awaitingInvoiceTotal)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Total outstanding" value={formatInr(totalOutstanding)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Vendors with outstanding" value={String(vendorsWithOutstanding)} />
      </Grid>
    </Grid>
  )
}
