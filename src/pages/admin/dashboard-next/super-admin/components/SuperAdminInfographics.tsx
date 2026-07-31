import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
import type { SuperAdminDashboardData } from '../types'

type AgeingTab = 'amount' | 'count'

function ChartPanel({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

function parseMarginPercent(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const n = Number.parseFloat(String(value).replace('%', ''))
  return Number.isFinite(n) ? n : 0
}

export interface SuperAdminInfographicsProps {
  data: SuperAdminDashboardData
  loading?: boolean
}

/** Overview infographics — verticals · pipeline · AR · margin · country · capacity. */
export function SuperAdminInfographics({ data, loading }: SuperAdminInfographicsProps) {
  const [ageingTab, setAgeingTab] = useState<AgeingTab>('amount')

  const verticalSlices = useMemo(
    () =>
      data.businessSegments.map((slice, index) => ({
        key: slice.id,
        label: slice.label,
        value: slice.value,
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [data.businessSegments],
  )
  const verticalTotal = verticalSlices.reduce((sum, s) => sum + s.value, 0)

  const pipelineSlices = useMemo(
    () =>
      data.pipelineStages
        .filter((stage) => stage.count > 0)
        .map((stage, index) => ({
          key: stage.id,
          label:
            APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ?? stage.id,
          value: stage.count,
          color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
        })),
    [data.pipelineStages],
  )
  const pipelineTotal = pipelineSlices.reduce((sum, s) => sum + s.value, 0)

  const ageingSlices = useMemo(() => {
    const colors = [
      SUPER_ADMIN_CHART_COLORS.green,
      SUPER_ADMIN_CHART_COLORS.amber,
      SUPER_ADMIN_CHART_COLORS.coral,
      SUPER_ADMIN_CHART_COLORS.navy,
    ]
    return data.ageingBuckets.map((bucket, index) => ({
      key: bucket.id,
      label: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
      value: ageingTab === 'amount' ? Math.round(bucket.amount / 100000) : (bucket.count ?? 0),
      color: colors[index % colors.length],
    }))
  }, [data.ageingBuckets, ageingTab])
  const ageingTotal = ageingSlices.reduce((sum, s) => sum + s.value, 0)

  const marginBars = useMemo(
    () =>
      data.marginByVertical.map((item) => ({
        vertical: item.primary,
        margin: parseMarginPercent(item.value),
      })),
    [data.marginByVertical],
  )

  const countryBars = useMemo(
    () =>
      data.countryDistribution.map((slice) => ({
        country: slice.label,
        share: slice.value,
      })),
    [data.countryDistribution],
  )

  const visaBars = useMemo(
    () =>
      data.visaDistribution.map((slice) => ({
        visa: slice.label,
        share: slice.value,
      })),
    [data.visaDistribution],
  )

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

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Revenue mix by vertical" description="Share of network revenue">
          <DonutChart
            data={
              verticalSlices.length > 0
                ? verticalSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={240}
            loading={loading}
            centerLabel="%"
            centerValue={String(verticalTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Pipeline by stage" description="Open applications across the network">
          <DonutChart
            data={
              pipelineSlices.length > 0
                ? pipelineSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={240}
            loading={loading}
            centerLabel="open"
            centerValue={String(pipelineTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="AR ageing"
          description={ageingTab === 'amount' ? 'Outstanding ₹L by bucket' : 'Invoice count by bucket'}
          action={
            <Tabs
              value={ageingTab}
              onChange={(v) => setAgeingTab(v as AgeingTab)}
              variant="underline"
              size="sm"
              items={[
                { value: 'amount', label: '₹' },
                { value: 'count', label: 'Count' },
              ]}
            />
          }
        >
          <DonutChart
            data={
              ageingSlices.length > 0
                ? ageingSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={240}
            loading={loading}
            centerLabel={ageingTab === 'amount' ? '₹L' : 'inv'}
            centerValue={String(ageingTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Gross margin by vertical" description="GP % this month">
          <BarChart
            data={marginBars}
            xKey="vertical"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'margin', label: 'Margin %', color: SUPER_ADMIN_CHART_COLORS.green }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Country mix" description="Application share by destination">
          <BarChart
            data={countryBars}
            xKey="country"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: SUPER_ADMIN_CHART_COLORS.blue }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Visa type mix" description="Application share by visa category">
          <BarChart
            data={visaBars}
            xKey="visa"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: SUPER_ADMIN_CHART_COLORS.violet }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ChartPanel title="Team capacity vs load" description="Open cases · capacity · completed today">
          <BarChart
            data={capacityBars}
            xKey="team"
            height={240}
            barSize={14}
            showLegend
            loading={loading}
            bars={[
              { key: 'open', label: 'Open', color: SUPER_ADMIN_CHART_COLORS.amber },
              { key: 'capacity', label: 'Capacity', color: SUPER_ADMIN_CHART_COLORS.navy },
              { key: 'done', label: 'Done today', color: SUPER_ADMIN_CHART_COLORS.teal },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

/** Bottom-row revenue vs collections trend for Overview. */
export function SuperAdminRevenueTrend({
  data,
  loading,
}: {
  data: SuperAdminDashboardData
  loading?: boolean
}) {
  const points = useMemo(
    () =>
      data.revenueTrend.map((p) => ({
        label: p.label,
        revenue: p.value,
        collected: p.secondary ?? 0,
      })),
    [data.revenueTrend],
  )

  return (
    <ChartPanel title="Revenue vs collections" description="Monthly billed vs collected (₹Cr)">
      <BarChart
        data={points}
        xKey="label"
        height={240}
        barSize={12}
        showLegend
        loading={loading}
        bars={[
          { key: 'revenue', label: 'Revenue', color: SUPER_ADMIN_CHART_COLORS.navy },
          { key: 'collected', label: 'Collected', color: SUPER_ADMIN_CHART_COLORS.green },
        ]}
      />
    </ChartPanel>
  )
}
