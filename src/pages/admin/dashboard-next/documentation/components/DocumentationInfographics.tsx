import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, Select, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { DOC_CHART_COLORS } from '../data/documentationChartColors'
import type { DocumentationDashboardData } from '../types'

type TopN = 5 | 7 | 10

const TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 7', value: '7' },
  { label: 'Top 10', value: '10' },
] as const

function toTopBars(
  rows: DocumentationDashboardData['topClients'],
  limit: TopN,
) {
  return rows.slice(0, limit).map((row) => ({
    name: row.name,
    share: row.sharePercent,
  }))
}

function topChartHeight(count: number): number {
  return Math.max(260, count * 44 + 56)
}

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

export interface DocumentationInfographicsProps {
  data: DocumentationDashboardData
  loading?: boolean
}

/** Overview infographics — desk mix · QC outcomes · ageing · top clients/countries · visibility. */
export function DocumentationInfographics({ data, loading }: DocumentationInfographicsProps) {
  const [ageingTab, setAgeingTab] = useState<'count' | 'share'>('count')
  const [clientTopN, setClientTopN] = useState<TopN>(5)
  const [countryTopN, setCountryTopN] = useState<TopN>(5)

  const deskTotal = data.deskMix.reduce((sum, s) => sum + s.value, 0)
  const qcTotal = data.qcOutcomeMix.reduce((sum, s) => sum + s.value, 0)

  const ageingTotal = data.ageingBuckets.reduce((sum, b) => sum + b.count, 0)
  const ageingBars = data.ageingBuckets.map((b) => ({
    bucket: b.bucket,
    value: ageingTab === 'count' ? b.count : ageingTotal ? Math.round((b.count / ageingTotal) * 100) : 0,
  }))

  const topClientBars = useMemo(
    () => toTopBars(data.topClients, clientTopN),
    [data.topClients, clientTopN],
  )

  const topCountryBars = useMemo(
    () => toTopBars(data.topCountries, countryTopN),
    [data.topCountries, countryTopN],
  )

  const visibilityBars = data.visibilityFunnel.map((s) => ({
    stage: s.label,
    value: s.value,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Desk mix" description="Submission Pending · Payment · Waiting on Ops">
          <DonutChart
            data={data.deskMix}
            height={240}
            loading={loading}
            centerLabel="open"
            centerValue={String(deskTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="QC outcomes"
          description="Pending · Verified & ready · Correction · Blocked"
        >
          <DonutChart
            data={data.qcOutcomeMix}
            height={240}
            loading={loading}
            centerLabel="cases"
            centerValue={String(qcTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartPanel
          title="Submission Pending ageing"
          description="How long cases have been waiting for Docs"
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
                color: DOC_CHART_COLORS.amber,
              },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Top clients"
          description="Share of applications (%)"
          action={
            <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Top clients count"
                value={String(clientTopN)}
                options={[...TOP_N_OPTIONS]}
                onChange={(v) => setClientTopN(Number(v) as TopN)}
              />
            </Box>
          }
        >
          <BarChart
            data={topClientBars}
            xKey="name"
            height={topChartHeight(clientTopN)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: DOC_CHART_COLORS.violet }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Top countries"
          description="Share of applications (%)"
          action={
            <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Top countries count"
                value={String(countryTopN)}
                options={[...TOP_N_OPTIONS]}
                onChange={(v) => setCountryTopN(Number(v) as TopN)}
              />
            </Box>
          }
        >
          <BarChart
            data={topCountryBars}
            xKey="name"
            height={topChartHeight(countryTopN)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: DOC_CHART_COLORS.blue }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ChartPanel
          title="Post-submission visibility"
          description="Embassy/VFS · Collection · Collected · Dispatched — KPI only; open Application Management"
        >
          <BarChart
            data={visibilityBars}
            xKey="stage"
            height={200}
            barSize={28}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'value', label: 'Count', color: DOC_CHART_COLORS.violet }]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

type WorkloadMetric = 'all' | 'submissionPending' | 'pendingPayment' | 'waitingOnOps'

const WORKLOAD_METRIC_OPTIONS = [
  { label: 'All desks', value: 'all' },
  { label: 'Submission Pending', value: 'submissionPending' },
  { label: 'Pending Payment', value: 'pendingPayment' },
  { label: 'Waiting on Ops', value: 'waitingOnOps' },
] as const

export interface DocumentationWorkloadBySegmentProps {
  data: DocumentationDashboardData
  loading?: boolean
}

/** Workload by segment — used beside Recent activity on Overview. */
export function DocumentationWorkloadBySegment({
  data,
  loading,
}: DocumentationWorkloadBySegmentProps) {
  const [workloadMetric, setWorkloadMetric] = useState<WorkloadMetric>('all')

  const workloadBars = useMemo(() => {
    return data.workloadBySegment.map((row) => {
      if (workloadMetric === 'all') {
        return {
          segment: row.segment,
          submissionPending: row.submissionPending,
          pendingPayment: row.pendingPayment,
          waitingOnOps: row.waitingOnOps,
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
      description="Retail · Corporate · Marine · B2B agent"
      action={
        <Box sx={{ width: { xs: '100%', sm: 180 }, flexShrink: 0 }}>
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
            { key: 'submissionPending', label: 'Submission Pending', color: DOC_CHART_COLORS.navy },
            { key: 'pendingPayment', label: 'Pending Payment', color: DOC_CHART_COLORS.amber },
            { key: 'waitingOnOps', label: 'Waiting on Ops', color: DOC_CHART_COLORS.coral },
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
              label:
                WORKLOAD_METRIC_OPTIONS.find((o) => o.value === workloadMetric)?.label ?? 'Count',
              color:
                workloadMetric === 'submissionPending'
                  ? DOC_CHART_COLORS.navy
                  : workloadMetric === 'pendingPayment'
                    ? DOC_CHART_COLORS.amber
                    : DOC_CHART_COLORS.coral,
            },
          ]}
        />
      )}
    </ChartPanel>
  )
}
