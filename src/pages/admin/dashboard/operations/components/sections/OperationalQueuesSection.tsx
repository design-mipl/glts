import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/dashboard/components'
import { buildAppointmentSubmissionColumns } from '../columns/appointmentSubmissionColumns'
import { buildReviewQcColumns } from '../columns/reviewQcColumns'
import type { AppointmentSubmissionRow, ReviewQcRow } from '../../data/operationsConsultantDashboardMock'

export interface OperationalQueuesSectionProps {
  reviewQcQueue: ReviewQcRow[]
  appointmentSubmissionQueue: AppointmentSubmissionRow[]
  getReviewQcCellValue: (row: ReviewQcRow, key: string) => string
  getAppointmentSubmissionCellValue: (row: AppointmentSubmissionRow, key: string) => string
  loading?: boolean
}

export function OperationalQueuesSection({
  reviewQcQueue,
  appointmentSubmissionQueue,
  getReviewQcCellValue,
  getAppointmentSubmissionCellValue,
  loading = false,
}: OperationalQueuesSectionProps) {
  const { showToast } = useToast()

  const reviewColumns = useMemo(
    () =>
      buildReviewQcColumns({
        onApprove: (row) =>
          showToast({ title: `Approved ${row.applicationId}`, variant: 'success' }),
        onRaiseCorrection: (row) =>
          showToast({ title: `Correction raised for ${row.applicationId}`, variant: 'info' }),
      }),
    [showToast],
  )

  const appointmentColumns = useMemo(() => buildAppointmentSubmissionColumns(), [])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Pending my review / QC"
          subtitle="Applications awaiting your review decision"
          columns={reviewColumns}
          data={reviewQcQueue}
          rowKey="id"
          getCellValue={getReviewQcCellValue}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Appointment & submission queue"
          subtitle="Upcoming appointments and submission readiness"
          columns={appointmentColumns}
          data={appointmentSubmissionQueue}
          rowKey="id"
          getCellValue={getAppointmentSubmissionCellValue}
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}
