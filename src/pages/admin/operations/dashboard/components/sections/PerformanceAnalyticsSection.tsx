import { Box, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BarChart, LineChart, MetricCard } from '@/design-system/UIComponents'
import {
  EXECUTIVE_CHART_HEIGHT,
  ExecutiveChartPanel,
  ExecutiveSectionHeader,
  executiveCardLevel2Sx,
} from '@/pages/admin/dashboard/components'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type {
  SlaComplianceSegment,
  TeamProductivityMetric,
  WeeklyCompletionPoint,
} from '../../data/operationsDashboardMock'

export interface PerformanceAnalyticsSectionProps {
  slaCompliance: SlaComplianceSegment[]
  teamProductivity: TeamProductivityMetric[]
  weeklyCompletion: WeeklyCompletionPoint[]
}

export function PerformanceAnalyticsSection({
  slaCompliance,
  teamProductivity,
  weeklyCompletion,
}: PerformanceAnalyticsSectionProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()

  const slaChartData = slaCompliance.map((segment) => ({
    segment: segment.segment,
    compliance: segment.compliancePct,
  }))

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <ExecutiveSectionHeader
          title="Performance analytics"
          description="SLA compliance, team productivity, and weekly completion trends."
        />
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ExecutiveChartPanel title="SLA compliance" subtitle="By business segment" embedded>
            <BarChart
              data={slaChartData}
              bars={[{ key: 'compliance', label: 'Compliance %', color: theme.palette.primary.main }]}
              xKey="segment"
              height={EXECUTIVE_CHART_HEIGHT}
              showLegend={false}
            />
          </ExecutiveChartPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              height: '100%',
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              bgcolor: colors.surface,
            }}
          >
            <MetricCard
              title="Team productivity"
              subtitle="Weighted across operational teams"
              metrics={teamProductivity.map((m) => ({ label: m.label, value: m.value }))}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ExecutiveChartPanel title="Weekly completion trend" subtitle="Daily completed applications" embedded>
            <LineChart
              data={weeklyCompletion}
              lines={[{ key: 'completed', label: 'Completed', color: theme.palette.success.main }]}
              xKey="day"
              height={EXECUTIVE_CHART_HEIGHT}
              showLegend={false}
            />
          </ExecutiveChartPanel>
        </Grid>
      </Grid>
    </Box>
  )
}
