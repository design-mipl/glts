import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { computeB2bListingKpis } from '../utils/B2bApplicationListingUtils'

interface B2bApplicationKpiRowProps {
  rows: B2bApplicationRow[]
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

export function B2bApplicationKpiRow({ rows }: B2bApplicationKpiRowProps) {
  const theme = useTheme()
  const metrics = computeB2bListingKpis(rows)

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Total applications"
          value={metrics.total}
          icon={FileText}
          iconColor={theme.palette.primary.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Verification Pending"
          value={metrics.verificationPending}
          icon={Clock}
          iconColor={theme.palette.info.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Pending corrections"
          value={metrics.pendingCorrections}
          icon={AlertTriangle}
          iconColor={theme.palette.warning.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Dispatched"
          value={metrics.dispatched}
          icon={CheckCircle2}
          iconColor={theme.palette.success.main}
        />
      </Grid>
    </Grid>
  )
}
