import { useMemo } from 'react'
import { Grid, Stack } from '@mui/material'
import { Alert } from '@/design-system/UIComponents'
import {
  AlertCenter,
  DashboardTable,
  MetricComparison,
  DASHBOARD_SPACING,
} from '../../shared'
import { buildDocumentationActivityColumns } from '@/pages/admin/dashboard/documentation/components/columns/documentationActivityColumns'
import type { DocumentationDashboardTabProps } from '../types'

/** Activity — critical alerts, inactivity notice, audit trail, performance. */
export function ActivityTab({ data, loading, onRetry }: DocumentationDashboardTabProps) {
  const activityColumns = useMemo(() => buildDocumentationActivityColumns(), [])

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <AlertCenter
          title="Critical alerts"
          subtitle="Queues needing documentation attention"
          alerts={data.criticalAlerts}
          loading={loading}
          maxItems={8}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Stack spacing={DASHBOARD_SPACING.dense}>
          {data.showInactivityWarning ? (
            <Alert severity="warning" title="Inactivity notice">
              {`No activity recorded in the last ${data.minutesSinceLastActivity ?? 60}+ minutes during business hours (Mon–Fri, 9:00–18:00).`}
            </Alert>
          ) : null}
          <DashboardTable
            title="My activity today"
            subtitle="Read-only audit trail of your documentation actions"
            columns={activityColumns}
            data={data.activityRows}
            rowKey="id"
            loading={loading}
            pageSize={8}
            emptyTitle="No activity yet"
            emptyDescription="Your documentation actions today will appear here."
          />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MetricComparison
          title="Performance metrics"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
