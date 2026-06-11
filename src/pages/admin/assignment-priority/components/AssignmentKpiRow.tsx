import { Grid, Stack, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  ListChecks,
  UserCheck,
  Zap,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import { publicLightColors } from '@/shared/theme/publicBrand'
import type { AssignmentQueueKpis } from '../utils/assignmentQueueListingUtils'

interface AssignmentKpiRowProps {
  kpis: AssignmentQueueKpis
}

function SimpleKpiCard({
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
            sx={{ textTransform: 'uppercase', letterSpacing: 0.45, lineHeight: 1.2, fontSize: 11 }}
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

export function AssignmentKpiRow({ kpis }: AssignmentKpiRowProps) {
  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="Total pending" value={kpis.totalPending} icon={ListChecks} iconColor="#2563eb" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="High priority" value={kpis.highPriority} icon={Zap} iconColor="#d97706" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="Assigned today" value={kpis.assignedToday} icon={UserCheck} iconColor={publicLightColors.greenDark} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="Pending assignment" value={kpis.pendingAssignment} icon={Clock3} iconColor="#6366f1" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="Carry forward" value={kpis.carryForward} icon={ArrowRightLeft} iconColor="#dc2626" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="Completed today" value={kpis.completedToday} icon={CheckCircle2} iconColor={publicLightColors.greenDark} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <SimpleKpiCard label="SLA risk" value={kpis.slaRisk} icon={AlertTriangle} iconColor="#dc2626" />
      </Grid>
    </Grid>
  )
}
