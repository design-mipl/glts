import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { BarChart, Button, LineChart, type Column } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import { ExecutiveTable } from '../../shared/dashboard-ui-kit'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminRankChart,
  SuperAdminSection,
  useSuperAdminChartColors,
} from '../components/SuperAdminChrome'
import type {
  SuperAdminDashboardTabProps,
  SuperAdminSegmentCard,
} from '../types'

const SEGMENT_COMPARISON_COLUMNS: Column<SuperAdminSegmentCard>[] = [
  {
    key: 'label',
    label: 'Segment',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
    hideable: false,
    render: (_value, row) => (
      <Typography variant="body2" fontWeight={700}>
        {row.label}
      </Typography>
    ),
  },
  {
    key: 'revenue',
    label: 'Gross revenue',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'netRevenue',
    label: 'Net revenue',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'activeApplications',
    label: 'Active apps',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'approvalPercent',
    label: 'Approval',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'grossMarginPercent',
    label: 'Gross margin',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
  },
  {
    key: 'growthLabel',
    label: 'Growth',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => (
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{
          fontSize: 13,
          color: row.growthPercent >= 0 ? 'success.main' : 'error.main',
        }}
      >
        {row.growthLabel}
      </Typography>
    ),
  },
]

/**
 * Business — vertical comparison + revenue growth only.
 * Gross = invoiced · Net = profit · Approval = embassy approved.
 * Deep-dives → Segments. Country / jurisdiction / embassy analytics → Analytics / Ops.
 * Segment & Client filters do not shrink this view (compares all four verticals).
 */
export function BusinessTab({
  data,
  loading,
  onOpenTab,
}: SuperAdminDashboardTabProps) {
  const filterCtx = useDashboardFiltersOptional()
  const [, setSearchParams] = useSearchParams()
  const chart = useSuperAdminChartColors()
  const segments = data.segmentCards

  const segmentSeries = useMemo(
    () =>
      [
        { key: 'marine', label: 'Marine', color: chart.navy },
        { key: 'corporate', label: 'Corporate', color: chart.blue },
        { key: 'retail', label: 'Retail', color: chart.green },
        { key: 'b2b', label: 'B2B', color: chart.amber },
      ] as const,
    [chart],
  )

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

  const grossNetBars = useMemo(
    () =>
      segments.map((s) => ({
        segment: s.label,
        gross: s.grossRevenueL,
        net: s.netRevenueL,
      })),
    [segments],
  )

  const collectionsOutstanding = useMemo(
    () =>
      segments.map((s) => ({
        segment: s.label,
        collections: s.collectionsL,
        outstanding: s.outstandingL,
      })),
    [segments],
  )

  const marginRankItems = useMemo(
    () =>
      segments.map((s) => ({
        id: s.id,
        primary: s.label,
        value: s.marginPercent,
        progress: s.marginPercent,
      })),
    [segments],
  )

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

  const approvalRankItems = useMemo(
    () =>
      segments.map((s) => ({
        id: s.id,
        primary: s.label,
        value: s.approvalRate,
        progress: s.approvalRate,
      })),
    [segments],
  )

  const empty = !loading && segments.length === 0

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection
        title="Segment comparison"
        description="Gross = invoiced · Net = profit · Approval = embassy approved"
        action={
          <Button
            label="Open Segments"
            variant="outlined"
            size="sm"
            onClick={() => openSegmentsWithFilter()}
          />
        }
      >
        {empty ? (
          <Typography variant="body2" color="text.secondary">
            No segment comparison data for the selected filters.
          </Typography>
        ) : (
          <ExecutiveTable
            columns={SEGMENT_COMPARISON_COLUMNS}
            data={segments}
            rowKey="id"
            pageSize={4}
            loading={loading}
            fullWidth
            hideToolbar
            hidePagination
            showColumnSearch={false}
            enableColumnSort={false}
            onRowClick={(row) => openSegmentsWithFilter(row.id)}
          />
        )}
      </SuperAdminSection>

      <SuperAdminSection
        title="Revenue & collections"
        description="Commercial comparison by segment"
      >
      <SuperAdminPanel
        title="Gross vs net revenue"
        description="Gross = invoiced · Net = profit (₹L)"
        onClick={() => openSegmentsWithFilter()}
      >
        <BarChart
          data={grossNetBars}
          xKey="segment"
          height={SA_CHART_HEIGHT}
          barSize={18}
          showLegend
          loading={loading}
          bars={[
            { key: 'gross', label: 'Gross revenue', color: chart.navy },
            { key: 'net', label: 'Net revenue', color: chart.green },
          ]}
        />
      </SuperAdminPanel>

      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <SuperAdminPanel
            title="Collections vs outstanding"
            description="Financial health by segment (₹L)"
            onClick={() => openSegmentsWithFilter()}
          >
            <BarChart
              data={collectionsOutstanding}
              xKey="segment"
              height={SA_CHART_HEIGHT}
              barSize={22}
              stacked
              showLegend
              loading={loading}
              bars={[
                {
                  key: 'collections',
                  label: 'Collections',
                  color: chart.green,
                },
                {
                  key: 'outstanding',
                  label: 'Outstanding',
                  color: chart.amber,
                },
              ]}
            />
          </SuperAdminPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => openSegmentsWithFilter()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openSegmentsWithFilter()
              }
            }}
            sx={{ height: '100%', cursor: 'pointer' }}
          >
            <SuperAdminRankChart
              title="Gross margin comparison"
              items={marginRankItems}
              loading={loading}
              valueLabel="Gross margin %"
              initialTopN="5"
            />
          </Box>
        </Grid>
      </Grid>

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
          <Box
            role="button"
            tabIndex={0}
            onClick={() => openSegmentsWithFilter()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openSegmentsWithFilter()
              }
            }}
            sx={{ height: '100%', cursor: 'pointer' }}
          >
            <SuperAdminRankChart
              title="Visa approval rate"
              items={approvalRankItems}
              loading={loading}
              valueLabel="Approval %"
              initialTopN="5"
            />
          </Box>
        </Grid>
      </Grid>
      </SuperAdminSection>

      <SuperAdminSection
        title="Revenue & demand growth"
        description="Monthly trends by segment"
      >
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminPanel
              title="Revenue growth trend"
              description="Monthly gross (invoiced) revenue by segment (₹L)"
              onClick={() => openSegmentsWithFilter()}
            >
              <LineChart
                data={data.segmentRevenueTrend as unknown as Record<string, unknown>[]}
                xKey="label"
                height={SA_CHART_HEIGHT}
                showLegend
                loading={loading}
                lines={[...segmentSeries]}
              />
            </SuperAdminPanel>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminPanel
              title="Monthly application trend"
              description="Demand and workload by segment"
              onClick={() => openSegmentsWithFilter()}
            >
              <LineChart
                data={data.segmentApplicationTrend as unknown as Record<string, unknown>[]}
                xKey="label"
                height={SA_CHART_HEIGHT}
                showLegend
                loading={loading}
                lines={[...segmentSeries]}
              />
            </SuperAdminPanel>
          </Grid>
        </Grid>
      </SuperAdminSection>
    </Stack>
  )
}
