import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/dashboard/components'
import { buildReadyForSubmissionColumns } from '../columns/readyForSubmissionColumns'
import { buildSubmissionPendingColumns } from '../columns/submissionPendingColumns'
import { DOCUMENTATION_LISTING_TABLE_SX } from '../documentationTableTokens'
import type { ReadyForSubmissionRow, SubmissionPendingRow } from '../../data/documentationDashboardMock'

export interface SubmissionManagementSectionProps {
  readyForSubmission: ReadyForSubmissionRow[]
  submissionPending: SubmissionPendingRow[]
  getReadySubmissionCellValue: (row: ReadyForSubmissionRow, key: string) => string
  getSubmissionPendingCellValue: (row: SubmissionPendingRow, key: string) => string
  loading?: boolean
}

export function SubmissionManagementSection({
  readyForSubmission,
  submissionPending,
  getReadySubmissionCellValue,
  getSubmissionPendingCellValue,
  loading = false,
}: SubmissionManagementSectionProps) {
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
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Ready for submission"
          subtitle="Applications cleared for embassy filing"
          columns={readyColumns}
          data={readyForSubmission}
          rowKey="id"
          getCellValue={getReadySubmissionCellValue}
          loading={loading}
          tableSx={DOCUMENTATION_LISTING_TABLE_SX}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Submission pending"
          subtitle="Submissions scheduled or awaiting completion"
          columns={pendingColumns}
          data={submissionPending}
          rowKey="id"
          getCellValue={getSubmissionPendingCellValue}
          loading={loading}
          tableSx={DOCUMENTATION_LISTING_TABLE_SX}
        />
      </Grid>
    </Grid>
  )
}
