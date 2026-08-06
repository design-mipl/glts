import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Anchor, Briefcase, Ship, Store, TrendingDown, TrendingUp } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { BarChart, Button, LineChart, Tooltip } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import { ExecutiveGrid, SegmentCard } from '../../shared/dashboard-ui-kit'
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

const SEGMENT_ICONS = {
  marine: <Ship size={20} />,
  corporate: <Briefcase size={20} />,
  retail: <Store size={20} />,
  b2b: <Anchor size={20} />,
} as const

function ComparisonSegmentCard({
  segment,
  loading,
  onOpen,
}: {
  segment: SuperAdminSegmentCard
  loading?: boolean
  onOpen: () => void
}) {
  const growing = segment.growthPercent >= 0
  const rows: Array<[string, string]> = [
    ['Gross revenue', segment.revenue],
    ['Net revenue', segment.netRevenue],
    ['Active apps', String(segment.activeApplications)],
    ['Approval', segment.approvalPercent],
    ['Gross margin', segment.grossMarginPercent],
    ['Growth', segment.growthLabel],
  ]

  return (
    <Tooltip
      content={`Open ${segment.label} segment dashboard`}
      placement="top"
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen()
          }
        }}
        sx={{
          height: '100%',
          cursor: 'pointer',
          borderRadius: 2,
          transition: 'transform 120ms ease',
          '&:hover': { transform: 'translateY(-1px)' },
        }}
      >
        <SegmentCard
          icon={SEGMENT_ICONS[segment.id] as ReactNode}
          title={segment.label}
          subtitle={segment.status === 'live' ? 'Live' : segment.label}
          hoverable
          loading={loading}
        >
          <Stack spacing={1.25}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.4 }}>
                {segment.revenue}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.35,
                  color: growing ? 'success.main' : 'error.main',
                }}
              >
                {growing ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <Typography variant="caption" fontWeight={700} sx={{ fontSize: 11 }}>
                  {segment.growthLabel}
                </Typography>
              </Box>
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0.75,
              }}
            >
              {rows.map(([label, value]) => (
                <Box key={label}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}
                  >
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </SegmentCard>
      </Box>
    </Tooltip>
  )
}

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

  const tatBars = useMemo(
    () =>
      segments.map((s) => ({
        segment: s.label,
        tat: s.avgTatDays,
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
          <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
            {segments.map((segment) => (
              <ComparisonSegmentCard
                key={segment.id}
                segment={segment}
                loading={loading}
                onOpen={() => openSegmentsWithFilter(segment.id)}
              />
            ))}
          </ExecutiveGrid>
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
            title="Average turnaround time"
            description="Processing TAT by segment (days)"
            onClick={() => openSegmentsWithFilter()}
          >
            <BarChart
              data={tatBars}
              xKey="segment"
              height={SA_CHART_HEIGHT}
              barSize={28}
              showLegend={false}
              loading={loading}
              bars={[{ key: 'tat', label: 'Avg TAT (days)' }]}
            />
          </SuperAdminPanel>
        </Grid>
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
      </Grid>

      <SuperAdminPanel
        title="Monthly application trend"
        description="Demand and workload by segment"
        onClick={() => openSegmentsWithFilter()}
      >
        <LineChart
          data={data.segmentApplicationTrend as unknown as Record<string, unknown>[]}
          xKey="label"
          height={SA_CHART_HEIGHT + 40}
          showLegend
          loading={loading}
          lines={[...segmentSeries]}
        />
      </SuperAdminPanel>
      </SuperAdminSection>
    </Stack>
  )
}
