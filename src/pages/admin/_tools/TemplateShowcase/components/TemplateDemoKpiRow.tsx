import { Grid, Stack, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, CheckCircle2, ListChecks, UserX } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { TemplateDemoRecord } from '../config/demoEntity'

interface TemplateDemoKpiRowProps {
  rows: TemplateDemoRecord[]
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

export function TemplateDemoKpiRow({ rows }: TemplateDemoKpiRowProps) {
  const total = rows.length
  const active = rows.filter((row) => row.status === 'Active').length
  const atRisk = rows.filter((row) => row.slaRisk === 'at_risk' || row.slaRisk === 'breached').length
  const unassigned = rows.filter((row) => row.assignee === 'Unassigned').length

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SimpleKpiCard label="Total records" value={total} icon={ListChecks} iconColor="#2563eb" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SimpleKpiCard label="Active" value={active} icon={CheckCircle2} iconColor="#059669" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SimpleKpiCard label="SLA at risk" value={atRisk} icon={AlertTriangle} iconColor="#d97706" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SimpleKpiCard label="Unassigned" value={unassigned} icon={UserX} iconColor="#dc2626" />
      </Grid>
    </Grid>
  )
}
