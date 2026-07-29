import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, CheckCircle2, Clock3, Headset, Loader2, MessageCircleWarning } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicket } from '@/shared/types/supportTicket'

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
            sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}
          >
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
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

export function SupportTicketKpiRow({ tickets }: { tickets: SupportTicket[] }) {
  const theme = useTheme()
  const aggregates = supportTicketService.getListingAggregates(tickets)

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
        <KpiCard label="Total" value={aggregates.total} icon={Headset} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
        <KpiCard label="Open" value={aggregates.open} icon={AlertCircle} iconColor={theme.palette.info.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
        <KpiCard
          label="In progress"
          value={aggregates.inProgress}
          icon={Loader2}
          iconColor={theme.palette.primary.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
        <KpiCard
          label="Waiting"
          value={aggregates.waitingForCustomer}
          icon={Clock3}
          iconColor={theme.palette.warning.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
        <KpiCard
          label="Critical"
          value={aggregates.critical}
          icon={MessageCircleWarning}
          iconColor={theme.palette.error.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
        <KpiCard
          label="Resolved"
          value={aggregates.resolved}
          icon={CheckCircle2}
          iconColor={theme.palette.success.main}
        />
      </Grid>
    </Grid>
  )
}
