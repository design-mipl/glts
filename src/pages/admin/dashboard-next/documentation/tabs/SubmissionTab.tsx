import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardTable, DASHBOARD_SPACING } from '../../shared'
import { buildReadyForSubmissionColumns } from '@/pages/admin/dashboard/documentation/components/columns/readyForSubmissionColumns'
import { buildSubmissionPendingColumns } from '@/pages/admin/dashboard/documentation/components/columns/submissionPendingColumns'
import type { DocumentationDashboardTabProps } from '../types'

/** Submission — ready packs and pending embassy filing. */
export function SubmissionTab({ data, loading }: DocumentationDashboardTabProps) {
  const { showToast } = useToast()

  const readyColumns = useMemo(
    () =>
      buildReadyForSubmissionColumns({
        onPrepare: (row) =>
          showToast({ title: `Preparing submission for ${row.applicant}`, variant: 'info' }),
      }),
    [showToast],
  )

  const pendingColumns = useMemo(() => buildSubmissionPendingColumns(), [])

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardTable
          title="Ready for submission"
          subtitle="Applications cleared for embassy filing"
          columns={readyColumns}
          data={data.readyForSubmission}
          rowKey="id"
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardTable
          title="Submission pending"
          subtitle="Submissions scheduled or awaiting completion"
          columns={pendingColumns}
          data={data.submissionPending}
          rowKey="id"
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}
