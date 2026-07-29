import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardTable, DASHBOARD_SPACING } from '../../shared'
import { buildAppointmentToBookColumns } from '@/pages/admin/dashboard/documentation/components/columns/appointmentToBookColumns'
import { buildDocumentationApplicationsColumns } from '@/pages/admin/dashboard/documentation/components/columns/documentationApplicationsColumns'
import { buildFeeToPayColumns } from '@/pages/admin/dashboard/documentation/components/columns/feeToPayColumns'
import { buildFormToFillColumns } from '@/pages/admin/dashboard/documentation/components/columns/formToFillColumns'
import type { DocumentationDashboardTabProps } from '../types'

/** Processing — applications plus forms, fees, and appointments due today. */
export function ProcessingTab({
  data,
  loading,
  onNavigate,
  onOpenApplication,
}: DocumentationDashboardTabProps) {
  const { showToast } = useToast()

  const applicationColumns = useMemo(
    () =>
      buildDocumentationApplicationsColumns({
        onView: (row) => {
          onOpenApplication?.(row)
          onNavigate(row.applicationHref)
        },
      }),
    [onNavigate, onOpenApplication],
  )

  const formColumns = useMemo(
    () =>
      buildFormToFillColumns({
        onOpen: (row) =>
          showToast({ title: `Opening form for ${row.applicant}`, variant: 'info' }),
      }),
    [showToast],
  )

  const feeColumns = useMemo(() => buildFeeToPayColumns(), [])

  const appointmentColumns = useMemo(
    () =>
      buildAppointmentToBookColumns({
        onBook: (row) =>
          showToast({
            title: 'Appointment booking started',
            description: `Booking ${row.appointmentType} for ${row.applicant}.`,
            variant: 'success',
          }),
      }),
    [showToast],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="My applications"
          subtitle="Applications assigned to you — sorted by due date and priority"
          columns={applicationColumns}
          data={data.myApplications}
          rowKey="id"
          loading={loading}
          pageSize={8}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardTable
          title="Forms to be filled today"
          subtitle="Embassy and visa application forms due today"
          columns={formColumns}
          data={data.formsToFill}
          rowKey="id"
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardTable
          title="Fees to be paid today"
          subtitle="Embassy and VFS fee payments due today"
          columns={feeColumns}
          data={data.feesToPay}
          rowKey="id"
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardTable
          title="Appointments to be booked"
          subtitle="VAC and biometric slots to confirm"
          columns={appointmentColumns}
          data={data.appointmentsToBook}
          rowKey="id"
          loading={loading}
          pageSize={5}
        />
      </Grid>
    </Grid>
  )
}
