import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  ArrowDownCircle,
  FileText,
  IndianRupee,
  Receipt,
  Send,
} from 'lucide-react'
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

function computeOutstanding(invoices: Invoice[]): number {
  return invoices
    .filter(i => i.invoiceStatus !== 'cancelled' && i.invoiceStatus !== 'paid' && i.invoiceType !== 'credit_note')
    .reduce((sum, i) => {
      const collected = i.payments.reduce((ps, p) => ps + p.amount, 0)
      return sum + Math.max(0, i.totals.balancePayable || i.totals.finalAmount - collected)
    }, 0)
}

function computeTotalBilled(invoices: Invoice[]): number {
  return invoices
    .filter(i => i.invoiceStatus !== 'draft' && i.invoiceStatus !== 'cancelled')
    .reduce((sum, i) => sum + i.totals.finalAmount, 0)
}

export function InvoiceKpiRow({ invoices }: InvoiceKpiRowProps) {
  const theme = useTheme()
  const total = invoices.length
  const draft = invoices.filter(i => i.invoiceStatus === 'draft').length
  const submitted = invoices.filter(
    i => i.invoiceStatus === 'submitted' && i.invoiceType !== 'credit_note',
  ).length
  const overdue = invoices.filter(i => i.invoiceStatus === 'overdue').length
  const outstanding = computeOutstanding(invoices)
  const totalBilled = computeTotalBilled(invoices)
  const advanceAdjusted = invoices.reduce((s, i) => s + i.totals.advanceAdjusted, 0)
  const creditNotes = invoices.filter(i => i.invoiceType === 'credit_note').length

  const primary = [
    { label: 'Total Invoices', value: total, icon: FileText, color: theme.palette.primary.main },
    { label: 'Draft Invoices', value: draft, icon: Receipt, color: theme.palette.info.main },
    { label: 'Submitted Invoices', value: submitted, icon: Send, color: theme.palette.success.main },
    { label: 'Overdue Invoices', value: overdue, icon: AlertCircle, color: theme.palette.error.main },
    { label: 'Outstanding Amount', value: formatInr(outstanding), icon: IndianRupee, color: theme.palette.warning.main },
    { label: 'Total Billed Amount', value: formatInr(totalBilled), icon: IndianRupee, color: theme.palette.primary.dark },
  ]

  const optional = [
    { label: 'Advance Adjusted', value: formatInr(advanceAdjusted), icon: ArrowDownCircle, color: theme.palette.info.dark },
    { label: 'Credit Notes', value: creditNotes, icon: ArrowDownCircle, color: theme.palette.secondary.main },
  ]

  return (
    <Stack spacing={1.5}>
      <Grid container spacing={1.5}>
        {primary.map(kpi => (
          <Grid key={kpi.label} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <KpiCard label={kpi.label} value={kpi.value} icon={kpi.icon} iconColor={kpi.color} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1.5}>
        {optional.map(kpi => (
          <Grid key={kpi.label} size={{ xs: 12, sm: 6 }}>
            <KpiCard label={kpi.label} value={kpi.value} icon={kpi.icon} iconColor={kpi.color} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
