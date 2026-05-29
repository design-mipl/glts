import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { CalendarClock, CheckCircle2, ListChecks, Sparkles, Workflow } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

interface EnquiryKpiRowProps {
  enquiries: EnquiryRecord[]
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

export function EnquiryKpiRow({ enquiries }: EnquiryKpiRowProps) {
  const theme = useTheme()
  const total = enquiries.length
  const newCount = enquiries.filter((item) => item.status === 'new').length
  const pendingFollowups = enquiries.filter((item) =>
    item.followups.some((entry) => entry.followupStatus === 'scheduled'),
  ).length
  const converted = enquiries.filter((item) => item.status === 'converted').length
  const activeCount = enquiries.filter((item) =>
    [
      'under_discussion',
      'requirement_gathering',
      'pending_customer_response',
      'internal_review',
      'quotation_in_progress',
      'on_hold',
    ].includes(item.status),
  ).length

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Total enquiries" value={total} icon={ListChecks} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="New enquiries" value={newCount} icon={Sparkles} iconColor={theme.palette.info.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Pending follow-ups" value={pendingFollowups} icon={CalendarClock} iconColor={theme.palette.warning.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Converted enquiries" value={converted} icon={CheckCircle2} iconColor={theme.palette.success.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Active enquiries" value={activeCount} icon={Workflow} iconColor={theme.palette.secondary.main} />
      </Grid>
    </Grid>
  )
}
