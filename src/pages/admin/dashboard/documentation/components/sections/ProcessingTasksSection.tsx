import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildAppointmentToBookColumns } from '../columns/appointmentToBookColumns'
import { buildFeeToPayColumns } from '../columns/feeToPayColumns'
import { buildFormToFillColumns } from '../columns/formToFillColumns'
import type {
  AppointmentToBookRow,
  FeeToPayRow,
  FormToFillRow,
} from '../../data/documentationDashboardMock'

export interface ProcessingTasksSectionProps {
  formsToFill: FormToFillRow[]
  feesToPay: FeeToPayRow[]
  appointmentsToBook: AppointmentToBookRow[]
  getFormCellValue: (row: FormToFillRow, key: string) => string
  getFeeCellValue: (row: FeeToPayRow, key: string) => string
  getAppointmentCellValue: (row: AppointmentToBookRow, key: string) => string
  loading?: boolean
}

export function ProcessingTasksSection({
  formsToFill,
  feesToPay,
  appointmentsToBook,
  getFormCellValue,
  getFeeCellValue,
  getAppointmentCellValue,
  loading = false,
}: ProcessingTasksSectionProps) {
  const { showToast } = useToast()

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
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Forms to be filled today"
          subtitle="Embassy and visa application forms due today"
          columns={formColumns}
          data={formsToFill}
          rowKey="id"
          getCellValue={getFormCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Fees to be paid today"
          subtitle="Embassy and VFS fee payments due today"
          columns={feeColumns}
          data={feesToPay}
          rowKey="id"
          getCellValue={getFeeCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Appointments to be booked"
          subtitle="VAC and biometric slots to confirm"
          columns={appointmentColumns}
          data={appointmentsToBook}
          rowKey="id"
          getCellValue={getAppointmentCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
    </Grid>
  )
}
