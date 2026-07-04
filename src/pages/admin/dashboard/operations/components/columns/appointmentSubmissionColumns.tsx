import { Badge, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { AppointmentSubmissionRow } from '../../data/operationsConsultantDashboardMock'

export function buildAppointmentSubmissionColumns(): Column<AppointmentSubmissionRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    { key: 'appointmentDate', label: 'Appointment Date', widthSize: adminListingColumnWidthSize('date') },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'vfsLocation', label: 'VFS Location', widthSize: adminListingColumnWidthSize('jurisdiction') },
    {
      key: 'submissionStatus',
      label: 'Submission Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => <Badge label={row.submissionStatus} color="info" size="sm" />,
    },
    { key: 'assignedExecutive', label: 'Assigned Executive', widthSize: adminListingColumnWidthSize('assignee') },
  ]
}
