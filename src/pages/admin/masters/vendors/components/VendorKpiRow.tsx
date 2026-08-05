import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, Building2, CheckCircle2, IndianRupee, Users } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import { vendorService } from '@/shared/services/vendorService'
import type { Vendor } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'

function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
  isCurrency,
}: {
  label: string
  value: number
  icon: LucideIcon
  iconColor: string
  isCurrency?: boolean
}) {
  return (
    <BaseCard sx={{ height: '100%', px: 2, py: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: isCurrency ? '1.1rem' : undefined }}>
            {isCurrency ? formatInr(value) : value}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: `${iconColor}14`, color: iconColor }}
        >
          <Icon size={18} />
        </Stack>
      </Stack>
    </BaseCard>
  )
}

export function VendorKpiRow({ vendors }: { vendors: Vendor[] }) {
  const theme = useTheme()
  const aggregates = vendorService.getListingAggregates(vendors)

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Total vendors" value={aggregates.totalVendors} icon={Users} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Active vendors" value={aggregates.activeVendors} icon={CheckCircle2} iconColor={theme.palette.success.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Inactive vendors" value={aggregates.inactiveVendors} icon={Building2} iconColor={theme.palette.text.secondary} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard
          label="Total outstanding"
          value={aggregates.totalOutstanding}
          icon={IndianRupee}
          iconColor={theme.palette.warning.main}
          isCurrency
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard
          label="Pending payment"
          value={aggregates.vendorsPendingPayment}
          icon={AlertCircle}
          iconColor={theme.palette.error.main}
        />
      </Grid>
    </Grid>
  )
}
