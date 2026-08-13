import { useMemo } from 'react'
import { Grid, Stack } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { BarChart, Button } from '@/design-system/UIComponents'
import {
  DASHBOARD_SPACING,
  SegmentComparisonSection,
  SegmentGrowthTrendSection,
  SegmentRevenueCollectionsSection,
  toSegmentComparisonRows,
} from '../../shared'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminSection,
  useSuperAdminChartColors,
} from '../components/SuperAdminChrome'
import type { SuperAdminDashboardTabProps, SuperAdminSegmentCard } from '../types'

/** Business — vertical comparison + revenue growth. */
export function BusinessTab({
  data,
  loading,
  onOpenTab,
}: SuperAdminDashboardTabProps) {
  const filterCtx = useDashboardFiltersOptional()
  const [, setSearchParams] = useSearchParams()
  const chart = useSuperAdminChartColors()
  const segments = data.segmentCards
  const comparisonRows = useMemo(() => toSegmentComparisonRows(segments), [segments])

  const openSegmentsWithFilter = (id?: SuperAdminSegmentCard['id']) => {
    const next = id ?? 'all'
    filterCtx?.setFilter('segment', next)
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        params.set('tab', 'segments')
        if (next === 'all') params.delete('segment')
        else params.set('segment', next)
        return params
      },
      { replace: true },
    )
    onOpenTab?.('segments')
  }

  const applicationBars = useMemo(
    () =>
      segments.map((s) => ({
        segment: s.label,
        active: s.activeApplications,
        completed: s.completedApplications,
        pending: s.pendingApplications,
      })),
    [segments],
  )

  const approvalBars = useMemo(
    () =>
      segments.map((s) => ({
        segment: s.label,
        approval: s.approvalRate,
      })),
    [segments],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SegmentComparisonSection
        rows={comparisonRows}
        loading={loading}
        action={
          <Button
            label="Open Segments"
            variant="outlined"
            size="sm"
            onClick={() => openSegmentsWithFilter()}
          />
        }
        onRowClick={(row) => openSegmentsWithFilter(row.id as SuperAdminSegmentCard['id'])}
      />

      <SegmentRevenueCollectionsSection
        rows={comparisonRows}
        loading={loading}
        onChartClick={() => openSegmentsWithFilter()}
      />

      <SuperAdminSection
        title="Applications & approval"
        description="Workload and embassy outcomes by segment"
      >
      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <SuperAdminPanel
            title="Active applications comparison"
            description="Active · completed · pending"
            onClick={() => openSegmentsWithFilter()}
          >
            <BarChart
              data={applicationBars}
              xKey="segment"
              height={SA_CHART_HEIGHT}
              barSize={14}
              showLegend
              loading={loading}
              bars={[
                { key: 'active', label: 'Active', color: chart.navy },
                { key: 'completed', label: 'Completed', color: chart.green },
                { key: 'pending', label: 'Pending', color: chart.amber },
              ]}
            />
          </SuperAdminPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SuperAdminPanel
            title="Visa approval rate"
            description="Embassy approved % by segment"
            onClick={() => openSegmentsWithFilter()}
          >
            <BarChart
              data={approvalBars}
              xKey="segment"
              height={SA_CHART_HEIGHT}
              barSize={22}
              showLegend={false}
              loading={loading}
              formatY={(value) => `${value}%`}
              bars={[
                { key: 'approval', label: 'Approval %', color: chart.green },
              ]}
            />
          </SuperAdminPanel>
        </Grid>
      </Grid>
      </SuperAdminSection>

      <SegmentGrowthTrendSection
        revenueTrend={data.segmentRevenueTrend}
        applicationTrend={data.segmentApplicationTrend}
        loading={loading}
        onChartClick={() => openSegmentsWithFilter()}
      />
    </Stack>
  )
}
