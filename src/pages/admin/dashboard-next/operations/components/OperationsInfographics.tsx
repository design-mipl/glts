import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, Select, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { OPS_CHART_COLORS } from '../data/operationsDashboardMock'
import type { OperationsDashboardData } from '../types'

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
  { label: 'Verification', value: 'verification' },
  { label: 'Payment', value: 'payment' },
  { label: 'Arrange Ticket/Insurance', value: 'arrange' },
  { label: 'Submission', value: 'submission' },
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

export interface OperationsInfographicsProps {
  data: OperationsDashboardData
  loading?: boolean
}

/** Overview infographics — queue mix · assignee mix · ageing. */
export function OperationsInfographics({ data, loading }: OperationsInfographicsProps) {
  const [mixView, setMixView] = useState<MixView>('all')
  const [ageingTab, setAgeingTab] = useState<'count' | 'share'>('count')

  const queueTotal = data.queueMix.reduce((sum, slice) => sum + slice.value, 0)

  const assigneeSlices = useMemo(() => {
    if (mixView === 'all') return data.assigneeMix
    return data.assigneeMix.filter((s) => s.key === mixView)
  }, [data.assigneeMix, mixView])

  const assigneeTotal = assigneeSlices.reduce((sum, slice) => sum + slice.value, 0)

  const ageingTotal = data.ageingBuckets.reduce((sum, b) => sum + b.count, 0)
  const ageingBars = data.ageingBuckets.map((b) => ({
    bucket: b.bucket,
    value: ageingTab === 'count' ? b.count : ageingTotal ? Math.round((b.count / ageingTotal) * 100) : 0,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="Queue mix"
          description="Verification · re-check · payment · Arrange Ticket/Insurance · submission"
        >
          <DonutChart
            data={data.queueMix}
            height={240}
            loading={loading}
            centerLabel="open"
            centerValue={String(queueTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="Assignee mix"
          description="How Ops assigned cases — user · vendor · passenger · unassigned"
          action={
            <Box sx={{ width: { xs: '100%', sm: 150 }, flexShrink: 0 }}>
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
            height={240}
            loading={loading}
            centerLabel="cases"
            centerValue={String(assigneeTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartPanel
          title="Queue ageing"
          description="How long cases have been waiting"
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
            height={220}
            barSize={22}
            showLegend={false}
            loading={loading}
            bars={[
              {
                key: 'value',
                label: ageingTab === 'count' ? 'Cases' : 'Share %',
                color: OPS_CHART_COLORS.amber,
              },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

export interface OperationsWorkloadBySegmentProps {
  data: OperationsDashboardData
  loading?: boolean
}

/** Workload by segment chart — used beside Recent activity on Overview. */
export function OperationsWorkloadBySegment({ data, loading }: OperationsWorkloadBySegmentProps) {
  const [workloadMetric, setWorkloadMetric] = useState<WorkloadMetric>('all')

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
        <Box sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
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
          height={260}
          barSize={18}
          showLegend
          loading={loading}
          bars={[
            { key: 'verification', label: 'Verification', color: OPS_CHART_COLORS.navy },
            { key: 'payment', label: 'Payment', color: OPS_CHART_COLORS.coral },
            { key: 'arrange', label: 'Arrange Ticket/Insurance', color: OPS_CHART_COLORS.blue },
            { key: 'submission', label: 'Submission', color: OPS_CHART_COLORS.teal },
          ]}
        />
      ) : (
        <BarChart
          data={workloadBars}
          xKey="segment"
          height={260}
          barSize={22}
          showLegend={false}
          loading={loading}
          bars={[
            {
              key: 'value',
              label: WORKLOAD_METRIC_OPTIONS.find((o) => o.value === workloadMetric)?.label ?? 'Count',
              color:
                workloadMetric === 'verification'
                  ? OPS_CHART_COLORS.navy
                  : workloadMetric === 'payment'
                    ? OPS_CHART_COLORS.coral
                    : workloadMetric === 'arrange'
                      ? OPS_CHART_COLORS.blue
                      : OPS_CHART_COLORS.teal,
            },
          ]}
        />
      )}
    </ChartPanel>
  )
}
