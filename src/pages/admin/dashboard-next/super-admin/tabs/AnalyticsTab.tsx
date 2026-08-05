import { useMemo } from 'react'
import { Grid, Stack } from '@mui/material'
import { BarChart, LineChart } from '@/design-system/UIComponents'
import { QuickStats, DASHBOARD_SPACING } from '../../shared'
import { ExecutiveGrid, ProgressMetric } from '../../shared/dashboard-ui-kit'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminRankChart,
  SuperAdminSection,
  useSuperAdminChartColors,
} from '../components/SuperAdminChrome'
import type { SuperAdminDashboardTabProps } from '../types'

/**
 * Analytics — deep performance charts (trends, capacity, productivity).
 */
export function AnalyticsTab({ data, loading }: SuperAdminDashboardTabProps) {
  const chart = useSuperAdminChartColors()

  const capacityBars = useMemo(
    () =>
      data.teamCapacity.map((row) => ({
        team: row.department,
        open: row.openCases,
        capacity: row.capacity,
        done: row.completedToday,
      })),
    [data.teamCapacity],
  )

  const throughputPoints = useMemo(
    () =>
      data.processingTrend.map((p) => ({
        label: p.label,
        processed: p.value,
        completed: p.secondary ?? 0,
      })),
    [data.processingTrend],
  )

  const tatItems = useMemo(
    () =>
      data.processingTimeByCountry.map((p) => ({
        id: p.id,
        primary: p.label,
        value: p.value,
        progress: Math.round(p.value * 8),
      })),
    [data.processingTimeByCountry],
  )

  const jurisdictionItems = useMemo(
    () =>
      data.branchPerformance.map((p) => ({
        id: p.id,
        primary: p.label,
        value: p.value,
        progress: p.value,
      })),
    [data.branchPerformance],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection title="Throughput & TAT">
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="Avg TAT by country"
              items={tatItems}
              loading={loading}
              valueLabel="Days"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminPanel title="Throughput trend">
              <LineChart
                data={throughputPoints}
                xKey="label"
                height={SA_CHART_HEIGHT}
                showLegend
                loading={loading}
                lines={[
                  { key: 'processed', label: 'Processed', color: chart.navy },
                  { key: 'completed', label: 'Completed', color: chart.green },
                ]}
              />
            </SuperAdminPanel>
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection title="Capacity & jurisdiction">
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12 }}>
            <SuperAdminPanel title="Team capacity vs load">
              <BarChart
                data={capacityBars}
                xKey="team"
                height={SA_CHART_HEIGHT + 20}
                barSize={12}
                showLegend
                loading={loading}
                bars={[
                  { key: 'open', label: 'Open', color: chart.amber },
                  { key: 'capacity', label: 'Capacity', color: chart.navy },
                  { key: 'done', label: 'Done today', color: chart.teal },
                ]}
              />
            </SuperAdminPanel>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title="Jurisdiction health"
              items={jurisdictionItems}
              loading={loading}
              valueLabel="Score"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminPanel title="Staff productivity">
              <ExecutiveGrid columns={2} spacing={DASHBOARD_SPACING.field}>
                {data.staffProductivity.map((item) => (
                  <ProgressMetric
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    helperText={item.helperText}
                    loading={loading}
                  />
                ))}
              </ExecutiveGrid>
            </SuperAdminPanel>
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection title="Commercial snapshot">
        <QuickStats
          title="Pipeline signals"
          loading={loading}
          items={[
            {
              id: 'pipe',
              label: 'Pipeline value',
              value: data.salesPlaceholder.pipelineValue,
            },
            {
              id: 'win',
              label: 'Win rate',
              value: data.salesPlaceholder.winRate,
            },
            {
              id: 'deal',
              label: 'Average deal',
              value: data.salesPlaceholder.avgDeal,
            },
            {
              id: 'conv',
              label: 'Proposal conversion',
              value: data.salesPlaceholder.conversion,
            },
          ]}
        />
      </SuperAdminSection>
    </Stack>
  )
}
