import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, FileText, IndianRupee, Receipt } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface InvoiceKpiRowProps {
  invoices: Invoice[]
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor: string
}) {
  return (
    <BaseCard sx={{ height: '100%', px: 2, py: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Stack spacing={0.75}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.45, lineHeight: 1.2 }}
          >
            {label}
          </Typography>
          <Typography variant="h5" component="p" fontWeight={700} sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            bgcolor: `${iconColor}14`,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <Icon size={18} />
        </Stack>
      </Stack>
    </BaseCard>
  )
}

export function InvoiceKpiRow({ invoices }: InvoiceKpiRowProps) {
  const theme = useTheme()
  const total = invoices.length
  const draft = invoices.filter(i => i.invoiceStatus === 'draft').length
  const overdue = invoices.filter(i => i.invoiceStatus === 'overdue').length
  const outstanding = invoices
    .filter(i => i.invoiceStatus !== 'cancelled' && i.invoiceStatus !== 'paid')
    .reduce((sum, i) => sum + i.totals.finalAmount - i.payments.reduce((ps, p) => ps + p.amount, 0), 0)

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Total invoices" value={total} icon={FileText} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Draft" value={draft} icon={Receipt} iconColor={theme.palette.info.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Overdue" value={overdue} icon={AlertCircle} iconColor={theme.palette.error.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Outstanding" value={formatInr(outstanding)} icon={IndianRupee} iconColor={theme.palette.warning.main} />
      </Grid>
    </Grid>
  )
}
