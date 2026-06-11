import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowRightCircle,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { PriorityQueueKpis } from '../utils/operationalCaseHandlingUtils'

interface PriorityQueueKpiRowProps {
  metrics: PriorityQueueKpis
}

function CompactKpi({
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
    <BaseCard sx={{ height: '100%', px: 1.5, py: 1.25 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Stack spacing={0.25} minWidth={0}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1.2, fontSize: 10 }}
            noWrap
          >
            {label}
          </Typography>
          <Typography variant="h6" component="p" fontWeight={700} sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 30,
            height: 30,
            borderRadius: 1.25,
            bgcolor: `${iconColor}14`,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <Icon size={15} />
        </Stack>
      </Stack>
    </BaseCard>
  )
}

export function PriorityQueueKpiRow({ metrics }: PriorityQueueKpiRowProps) {
  const theme = useTheme()

  const items = [
    { label: 'Pending Today', value: metrics.pendingToday, icon: Clock, color: theme.palette.warning.main },
    { label: 'In Operations', value: metrics.inOperations, icon: Layers, color: theme.palette.info.main },
    { label: 'Urgent Cases', value: metrics.urgentCases, icon: Zap, color: theme.palette.error.main },
    { label: 'Completed Today', value: metrics.completedToday, icon: CheckCircle2, color: theme.palette.success.main },
    { label: 'Moved to Next Day', value: metrics.movedToNextDay, icon: ArrowRightCircle, color: theme.palette.secondary.main },
    { label: 'Delayed Cases', value: metrics.delayedCases, icon: AlertTriangle, color: theme.palette.warning.dark },
  ]

  return (
    <Grid container spacing={1}>
      {items.map(item => (
        <Grid key={item.label} size={{ xs: 6, sm: 4, lg: 2 }}>
          <CompactKpi label={item.label} value={item.value} icon={item.icon} iconColor={item.color} />
        </Grid>
      ))}
    </Grid>
  )
}
