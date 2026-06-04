import { useMemo, useState } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { DashboardFiltersBar } from '../components/DashboardFiltersBar'
import { DashboardKpiRow } from '../components/DashboardKpiRow'
import { DashboardPipelineTracker } from '../components/DashboardPipelineTracker'
import { DashboardQueueTable } from '../components/DashboardQueueTable'
import { DashboardCriticalAlerts } from '../components/DashboardCriticalAlerts'
import { DashboardActivityPanel } from '../components/DashboardActivityPanel'
import { DashboardQuickActions } from '../components/DashboardQuickActions'
import { DashboardAnalyticsSection } from '../components/DashboardAnalyticsSection'
import { DashboardFinanceSnapshot } from '../components/DashboardFinanceSnapshot'
import {
  CHANNEL_DISTRIBUTION,
  CORRECTION_QUEUE,
  COUNTRY_APPLICATION_BARS,
  CRITICAL_ALERTS,
  DAILY_APPLICATION_TREND,
  DASHBOARD_KPIS,
  DEFAULT_DASHBOARD_FILTERS,
  FINANCE_KPIS,
  PIPELINE_STAGES,
  RECENT_ACTIVITY,
  RECENT_INVOICES,
  SUBMISSION_QUEUE,
  VERIFICATION_QUEUE,
  type DashboardFilters,
} from '../data/operationsDashboardMock'
import {
  filterChannelDistribution,
  filterCountryChartData,
  filterInvoices,
  filterQueueRows,
  scaleKpis,
  scalePipelineStages,
} from '../utils/applyDashboardFilters'

export function OperationsDashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_DASHBOARD_FILTERS)

  const kpis = useMemo(() => scaleKpis(DASHBOARD_KPIS, filters), [filters])
  const pipelineStages = useMemo(() => scalePipelineStages(PIPELINE_STAGES, filters), [filters])
  const verificationQueue = useMemo(() => filterQueueRows(VERIFICATION_QUEUE, filters), [filters])
  const submissionQueue = useMemo(() => filterQueueRows(SUBMISSION_QUEUE, filters), [filters])
  const correctionQueue = useMemo(() => filterQueueRows(CORRECTION_QUEUE, filters), [filters])
  const countryBars = useMemo(() => filterCountryChartData(COUNTRY_APPLICATION_BARS, filters), [filters])
  const channelSlices = useMemo(() => filterChannelDistribution(CHANNEL_DISTRIBUTION, filters), [filters])
  const invoices = useMemo(() => filterInvoices(RECENT_INVOICES, filters), [filters])

  return (
    <Box>
      <AdminPageHeader
        title="Dashboard"
        description="Real-time overview of applications, operations, and finance."
        actions={<DashboardFiltersBar filters={filters} onChange={setFilters} />}
      />

      <Stack spacing={2}>
        <DashboardKpiRow metrics={kpis} />

        <DashboardPipelineTracker stages={pipelineStages} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={2}>
              <DashboardQueueTable
                title="Pending verification queue"
                subtitle="Document QC and compliance review"
                rows={verificationQueue}
              />
              <DashboardQueueTable
                title="Submission queue"
                subtitle="Ready for embassy filing"
                rows={submissionQueue}
              />
              <DashboardQueueTable
                title="Correction requests"
                subtitle="Applicant or ops corrections pending"
                rows={correctionQueue}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <DashboardCriticalAlerts alerts={CRITICAL_ALERTS} />
              <DashboardActivityPanel items={RECENT_ACTIVITY} />
              <DashboardQuickActions />
            </Stack>
          </Grid>
        </Grid>

        <DashboardAnalyticsSection
          dailyTrend={DAILY_APPLICATION_TREND}
          countryBars={countryBars}
          channelSlices={channelSlices}
        />

        <DashboardFinanceSnapshot kpis={FINANCE_KPIS} invoices={invoices} />
      </Stack>
    </Box>
  )
}
