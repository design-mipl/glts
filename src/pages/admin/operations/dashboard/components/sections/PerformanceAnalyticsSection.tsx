import { Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BarChart, ChartCard, LineChart, MetricCard } from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
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
  const ct = useChartTheme()

  const slaChartData = slaCompliance.map((segment, index) => ({
    segment: segment.segment,
    compliance: segment.compliancePct,
    color: ct.colors[index % ct.colors.length],
  }))

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartCard title="SLA compliance" subtitle="By business segment">
          <BarChart
            data={slaChartData}
            bars={[{ key: 'compliance', label: 'Compliance %', color: theme.palette.primary.main }]}
            xKey="segment"
            height={200}
            showLegend={false}
          />
        </ChartCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <MetricCard
          title="Team productivity"
          subtitle="Weighted across operational teams"
          metrics={teamProductivity.map((m) => ({ label: m.label, value: m.value }))}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartCard title="Weekly completion trend" subtitle="Daily completed applications">
          <LineChart
            data={weeklyCompletion}
            lines={[{ key: 'completed', label: 'Completed', color: theme.palette.success.main }]}
            xKey="day"
            height={200}
            showLegend={false}
          />
        </ChartCard>
      </Grid>
    </Grid>
  )
}
