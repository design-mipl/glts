import { Grid, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { GaugeChart, StatCard } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { DASHBOARD_SPACING } from '../../constants'

export interface OperationsHealthMetrics {
  overallHealth: number
  delayedCases: number
  completedToday: number
  criticalCases: number
  slaPercent: number
}

export interface OperationsHealthProps {
  title?: string
  subtitle?: string
  metrics: OperationsHealthMetrics
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function OperationsHealth({
  title = 'Operations health',
  subtitle = 'Live operational pulse',
  metrics,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: OperationsHealthProps) {
  const theme = useTheme()

  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty}
      permission={permission}
      onRetry={onRetry}
      skeletonHeightSpacing={20}
    >
      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack alignItems="center" spacing={DASHBOARD_SPACING.field}>
            <GaugeChart
              value={metrics.overallHealth}
              label="Overall health"
              valueFormat={(v) => `${Math.round(v)}%`}
              color={theme.palette.primary.main}
              size={180}
            />
            <Typography variant="body2" color="text.secondary">
              SLA {Math.round(metrics.slaPercent)}%
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={DASHBOARD_SPACING.field}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard label="Delayed cases" value={metrics.delayedCases} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard label="Completed today" value={metrics.completedToday} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard label="Critical cases" value={metrics.criticalCases} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard label="SLA %" value={`${Math.round(metrics.slaPercent)}%`} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BusinessWidgetFrame>
  )
}
