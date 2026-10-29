import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, FileText, ListChecks, Workflow } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { Order } from '@/shared/types/order'

interface OrderKpiRowProps {
  orders: Order[]
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string
  value: number
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

export function OrderKpiRow({ orders }: OrderKpiRowProps) {
  const theme = useTheme()
  const total = orders.length
  const draftCount = orders.filter((item) => item.status === 'draft').length
  const inProgressCount = orders.filter((item) => item.status === 'in-progress' || item.status === 'confirmed').length
  const completedCount = orders.filter((item) => item.status === 'completed').length

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Total orders" value={total} icon={ListChecks} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Draft orders" value={draftCount} icon={FileText} iconColor={theme.palette.info.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="In progress" value={inProgressCount} icon={Workflow} iconColor={theme.palette.warning.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard label="Completed orders" value={completedCount} icon={CheckCircle2} iconColor={theme.palette.success.main} />
      </Grid>
    </Grid>
  )
}
