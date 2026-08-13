import { useMemo, useState } from 'react'
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { BarChart, DonutChart, Select, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../constants'
import {
  APPLICATION_PIPELINE_STAGE_IDS,
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../config/applicationPipeline'
import {
  OPS_QUEUE_AGEING_BUCKETS,
  type OpsOrgQueueSnapshot,
} from './opsOrgQueueTypes'

type MixView = 'all' | 'user' | 'vendor' | 'passenger' | 'unassigned'
type WorkloadMetric = 'all' | ApplicationPipelineStageId

const MIX_OPTIONS = [
  { label: 'All assignees', value: 'all' },
  { label: 'user', value: 'user' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Passenger', value: 'passenger' },
  { label: 'Unassigned', value: 'unassigned' },
] as const

const WORKLOAD_METRIC_OPTIONS = [
  { label: 'All queues', value: 'all' },
  ...APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
    label: APPLICATION_PIPELINE_STAGE_LABELS[id],
    value: id,
  })),
] as const

const WORKLOAD_STAGE_COLORS = [
  'navy',
  'amber',
  'teal',
  'coral',
  'blue',
  'violet',
  'green',
  'slate',
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
  slices: OpsOrgQueueSnapshot['assigneeMix'],
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

export function QueueAgeingTable({
  rows,
  loading,
  mode,
}: {
  rows: OpsOrgQueueSnapshot['ageingByQueue']
  loading?: boolean
  mode: 'count' | 'share'
}) {
  return (
    <Box
      sx={{
        maxHeight: 220,
        overflow: 'auto',
        opacity: loading ? 0.55 : 1,
        mx: -0.5,
        px: 0.5,
      }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="Queue ageing by wait time"
        sx={{
          tableLayout: 'fixed',
          '& .MuiTableCell-root': {
            borderColor: 'divider',
            py: 0.55,
            px: 0.5,
            fontSize: 11,
            lineHeight: 1.3,
          },
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: 'text.primary',
            bgcolor: 'background.paper',
            borderBottomWidth: 1,
          },
          '& .MuiTableBody .MuiTableRow-root:last-of-type .MuiTableCell-root': {
            borderBottom: 0,
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '46%', pl: 0 }}>Queue</TableCell>
            {OPS_QUEUE_AGEING_BUCKETS.map((bucket) => (
              <TableCell key={bucket} align="right" sx={{ width: '13.5%' }}>
                {bucket}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rows ?? []).map((row) => {
            const rowTotal = OPS_QUEUE_AGEING_BUCKETS.reduce(
              (sum, bucket) => sum + (row.counts[bucket] ?? 0),
              0,
            )
            return (
              <TableRow key={row.key}>
                <TableCell
                  sx={{
                    pl: 0,
                    color: 'text.primary',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={row.label}
                >
                  {row.label}
                </TableCell>
                {OPS_QUEUE_AGEING_BUCKETS.map((bucket) => {
                  const count = row.counts[bucket] ?? 0
                  const value =
                    mode === 'count'
                      ? count
                      : rowTotal
                        ? Math.round((count / rowTotal) * 100)
                        : 0
                  return (
                    <TableCell key={bucket} align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {mode === 'share' ? `${value}%` : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

/** Ground operation assignment · Queue ageing — Ops Overview + Admin Overview. */
export function OpsOrgInfographics({ data, loading, dense = false }: OpsOrgInfographicsProps) {
  const chart = useDashboardChartColors()
  const [mixView, setMixView] = useState<MixView>('all')
  const donutHeight = dense ? 180 : 240

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

  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Ground operation assignment"
          action={
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Filter ground operation assignment"
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

      <Grid size={{ xs: 12, md: 6 }}>
        <OpsOrgQueueAgeing rows={data.ageingByQueue} loading={loading} />
      </Grid>
    </Grid>
  )
}

export interface OpsOrgQueueAgeingProps {
  rows: OpsOrgQueueSnapshot['ageingByQueue']
  loading?: boolean
  mode?: 'count' | 'share'
  onModeChange?: (mode: 'count' | 'share') => void
  title?: string
  description?: string
}

/** Queue ageing matrix — same table used on Ops and Documentation Overview. */
export function OpsOrgQueueAgeing({
  rows,
  loading,
  mode: controlledMode,
  onModeChange,
  title = 'Queue ageing',
  description = 'Wait time buckets',
}: OpsOrgQueueAgeingProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState<'count' | 'share'>('count')
  const mode = controlledMode ?? uncontrolledMode
  const setMode = onModeChange ?? setUncontrolledMode

  return (
    <ChartPanel
      title={title}
      description={description}
      action={
        <Tabs
          value={mode}
          onChange={(value) => setMode(value as 'count' | 'share')}
          variant="underline"
          size="sm"
          items={[
            { value: 'count', label: 'Count' },
            { value: 'share', label: '%' },
          ]}
        />
      }
    >
      <QueueAgeingTable rows={rows} loading={loading} mode={mode} />
    </ChartPanel>
  )
}

export interface OpsOrgWorkloadBySegmentProps {
  data: Pick<OpsOrgQueueSnapshot, 'workloadBySegment'>
  loading?: boolean
  dense?: boolean
}

/** Workload by segment — Application Management tabs × Retail · Corporate · Marine · B2B. */
export function OpsOrgWorkloadBySegment({
  data,
  loading,
  dense = false,
}: OpsOrgWorkloadBySegmentProps) {
  const chart = useDashboardChartColors()
  const [workloadMetric, setWorkloadMetric] = useState<WorkloadMetric>('all')
  const chartHeight = dense ? 240 : 340

  const workloadBars = useMemo(() => {
    return data.workloadBySegment.map((row) => {
      if (workloadMetric === 'all') {
        return {
          segment: row.segment,
          draft: row.draft,
          verification_pending: row.verification_pending,
          online_submission_pending: row.online_submission_pending,
          pending_payment: row.pending_payment,
          vfs_submission_pending: row.vfs_submission_pending,
          collection_pending: row.collection_pending,
          collected: row.collected,
          dispatched: row.dispatched,
        }
      }
      return {
        segment: row.segment,
        value: row[workloadMetric],
      }
    })
  }, [data.workloadBySegment, workloadMetric])

  const stackedBars = APPLICATION_PIPELINE_STAGE_IDS.map((id, index) => ({
    key: id,
    label: APPLICATION_PIPELINE_STAGE_LABELS[id],
    color: chart[WORKLOAD_STAGE_COLORS[index % WORKLOAD_STAGE_COLORS.length]],
  }))

  const singleColor =
    workloadMetric === 'all'
      ? chart.navy
      : chart[
          WORKLOAD_STAGE_COLORS[
            Math.max(0, APPLICATION_PIPELINE_STAGE_IDS.indexOf(workloadMetric)) %
              WORKLOAD_STAGE_COLORS.length
          ]
        ]

  return (
    <ChartPanel
      title="Workload by segment"
      description="Application Management queues by channel"
      action={
        <Box sx={{ width: { xs: '100%', sm: 190 }, flexShrink: 0 }}>
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
          barSize={dense ? 10 : 14}
          showLegend
          loading={loading}
          bars={stackedBars}
        />
      ) : (
        <BarChart
          data={workloadBars}
          xKey="segment"
          height={chartHeight}
          barSize={dense ? 18 : 24}
          showLegend={false}
          loading={loading}
          bars={[
            {
              key: 'value',
              label:
                WORKLOAD_METRIC_OPTIONS.find((o) => o.value === workloadMetric)?.label ?? 'Count',
              color: singleColor,
            },
          ]}
        />
      )}
    </ChartPanel>
  )
}
