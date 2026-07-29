import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { GaugeChart } from '@/design-system/UIComponents'
import {
  ComparisonLayout,
  ExecutiveGrid,
  ExecutiveMetric,
  UI_KIT_SPACING,
} from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'

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
      card={false}
      skeletonHeightSpacing={20}
    >
      <ComparisonLayout
        left={
          <Stack alignItems="center" spacing={UI_KIT_SPACING.field}>
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
        }
        right={
          <ExecutiveGrid columns={2}>
            <ExecutiveMetric label="Delayed cases" value={metrics.delayedCases} tone="warning" />
            <ExecutiveMetric label="Completed today" value={metrics.completedToday} tone="positive" />
            <ExecutiveMetric label="Critical cases" value={metrics.criticalCases} tone="negative" />
            <ExecutiveMetric
              label="SLA %"
              value={`${Math.round(metrics.slaPercent)}%`}
              tone="info"
            />
          </ExecutiveGrid>
        }
      />
    </BusinessWidgetFrame>
  )
}
