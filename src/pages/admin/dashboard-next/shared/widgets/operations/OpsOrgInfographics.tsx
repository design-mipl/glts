import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, Select, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../constants'
import type { OpsOrgQueueSnapshot } from './opsOrgQueueTypes'
import {
  OPS_QUEUE_DISPLAY_LABELS,
  OPS_QUEUE_MIX_DESCRIPTION,
} from './opsQueueDisplayLabels'

type MixView = 'all' | 'user' | 'vendor' | 'passenger' | 'unassigned'
type WorkloadMetric = 'all' | 'verification' | 'payment' | 'arrange' | 'submission'

const MIX_OPTIONS = [
  { label: 'All assignees', value: 'all' },
  { label: 'Ops user', value: 'user' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Passenger', value: 'passenger' },
  { label: 'Unassigned', value: 'unassigned' },
] as const

const WORKLOAD_METRIC_OPTIONS = [
  { label: 'All queues', value: 'all' },
  { label: OPS_QUEUE_DISPLAY_LABELS.verification, value: 'verification' },
  { label: OPS_QUEUE_DISPLAY_LABELS.payment, value: 'payment' },
  { label: OPS_QUEUE_DISPLAY_LABELS.arrange, value: 'arrange' },
  { label: OPS_QUEUE_DISPLAY_LABELS.submissionCollection, value: 'submission' },
] as const

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

function withSliceColors(
  slices: OpsOrgQueueSnapshot['queueMix'],
  series: readonly string[],
) {
  return slices.map((slice, index) => ({
    ...slice,
    color: slice.color ?? series[index % series.length],
  }))
}

export interface OpsOrgInfographicsProps {
  data: OpsOrgQueueSnapshot
  loading?: boolean
  /** Shorter charts for denser dashboard compositions. */
  dense?: boolean
}

/** Org queue mix · assignee mix · ageing — Ops Overview + Admin Operations. */
export function OpsOrgInfographics({ data, loading, dense = false }: OpsOrgInfographicsProps) {
  const chart = useDashboardChartColors()
  const [mixView, setMixView] = useState<MixView>('all')
  const [ageingTab, setAgeingTab] = useState<'count' | 'share'>('count')
  const donutHeight = dense ? 180 : 240
  const barHeight = dense ? 170 : 220

  const queueMix = withSliceColors(
    data.queueMix.filter((slice) => slice.value > 0),
    [
      chart.navy,
      chart.green,
      chart.amber,
      chart.coral,
      chart.blue,
      chart.teal,
      chart.violet,
      chart.slate,
    ],
  )
  const queueTotal = data.queueMix.reduce((sum, slice) => sum + slice.value, 0)

  const assigneeMixColored = withSliceColors(data.assigneeMix, [
    chart.navy,
    chart.amber,
    chart.blue,
    chart.coral,
  ])

  const assigneeSlices = useMemo(() => {
    if (mixView === 'all') return assigneeMixColored
    return assigneeMixColored.filter((s) => s.key === mixView)
  }, [assigneeMixColored, mixView])

  const assigneeTotal = assigneeSlices.reduce((sum, slice) => sum + slice.value, 0)

  const ageingTotal = data.ageingBuckets.reduce((sum, b) => sum + b.count, 0)
  const ageingBars = data.ageingBuckets.map((b) => ({
    bucket: b.bucket,
    value: ageingTab === 'count' ? b.count : ageingTotal ? Math.round((b.count / ageingTotal) * 100) : 0,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="Queue mix"
          description={OPS_QUEUE_MIX_DESCRIPTION}
        >
          <DonutChart
            data={queueMix}
            height={donutHeight}
            loading={loading}
            centerLabel="open"
            centerValue={String(queueTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="Assignee mix"
          description="User · vendor · passenger · unassigned"
          action={
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Filter assignee mix"
                value={mixView}
                options={[...MIX_OPTIONS]}
                onChange={(v) => setMixView(String(v) as MixView)}
              />
            </Box>
          }
        >
          <DonutChart
            data={assigneeSlices}
            height={donutHeight}
            loading={loading}
            centerLabel="cases"
            centerValue={String(assigneeTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartPanel
          title="Queue ageing"
          description="Wait time buckets"
          action={
            <Tabs
              value={ageingTab}
              onChange={(value) => setAgeingTab(value as 'count' | 'share')}
              variant="underline"
              size="sm"
              items={[
                { value: 'count', label: 'Count' },
                { value: 'share', label: '%' },
              ]}
            />
          }
        >
          <BarChart
            data={ageingBars}
            xKey="bucket"
            height={barHeight}
            barSize={dense ? 18 : 22}
            showLegend={false}
            loading={loading}
            bars={[
              {
                key: 'value',
                label: ageingTab === 'count' ? 'Cases' : 'Share %',
                color: chart.amber,
              },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

export interface OpsOrgWorkloadBySegmentProps {
  data: OpsOrgQueueSnapshot
  loading?: boolean
  dense?: boolean
}

/** Workload by segment — Retail · Corporate · Marine · B2B. */
export function OpsOrgWorkloadBySegment({
  data,
  loading,
  dense = false,
}: OpsOrgWorkloadBySegmentProps) {
  const chart = useDashboardChartColors()
  const [workloadMetric, setWorkloadMetric] = useState<WorkloadMetric>('all')
  const chartHeight = dense ? 200 : 260

  const workloadBars = useMemo(() => {
    return data.workloadBySegment.map((row) => {
      if (workloadMetric === 'all') {
        return {
          segment: row.segment,
          verification: row.verification,
          payment: row.payment,
          arrange: row.arrange,
          submission: row.submission,
        }
      }
      return {
        segment: row.segment,
        value: row[workloadMetric],
      }
    })
  }, [data.workloadBySegment, workloadMetric])

  return (
    <ChartPanel
      title="Workload by segment"
      description="Retail · Corporate · Marine · B2B"
      action={
        <Box sx={{ width: { xs: '100%', sm: 150 }, flexShrink: 0 }}>
          <Select
            size="sm"
            fullWidth
            aria-label="Workload metric filter"
            value={workloadMetric}
            options={[...WORKLOAD_METRIC_OPTIONS]}
            onChange={(v) => setWorkloadMetric(String(v) as WorkloadMetric)}
          />
        </Box>
      }
    >
      {workloadMetric === 'all' ? (
        <BarChart
          data={workloadBars}
          xKey="segment"
          height={chartHeight}
          barSize={dense ? 14 : 18}
          showLegend
          loading={loading}
          bars={[
            { key: 'verification', label: OPS_QUEUE_DISPLAY_LABELS.verification, color: chart.navy },
            { key: 'payment', label: OPS_QUEUE_DISPLAY_LABELS.payment, color: chart.coral },
            { key: 'arrange', label: OPS_QUEUE_DISPLAY_LABELS.arrange, color: chart.blue },
            { key: 'submission', label: OPS_QUEUE_DISPLAY_LABELS.submissionCollection, color: chart.teal },
          ]}
        />
      ) : (
        <BarChart
          data={workloadBars}
          xKey="segment"
          height={chartHeight}
          barSize={dense ? 18 : 22}
          showLegend={false}
          loading={loading}
          bars={[
            {
              key: 'value',
              label: WORKLOAD_METRIC_OPTIONS.find((o) => o.value === workloadMetric)?.label ?? 'Count',
              color:
                workloadMetric === 'verification'
                  ? chart.navy
                  : workloadMetric === 'payment'
                    ? chart.coral
                    : workloadMetric === 'arrange'
                      ? chart.blue
                      : chart.teal,
            },
          ]}
        />
      )}
    </ChartPanel>
  )
}
