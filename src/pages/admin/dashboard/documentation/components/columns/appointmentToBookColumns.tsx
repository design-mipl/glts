import { Badge, Button, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { AppointmentToBookRow } from '../../data/documentationDashboardMock'

export interface AppointmentToBookColumnHandlers {
  onBook: (row: AppointmentToBookRow) => void
}

export function buildAppointmentToBookColumns({
  onBook,
}: AppointmentToBookColumnHandlers): Column<AppointmentToBookRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'visaType', label: 'Visa Type', widthSize: adminListingColumnWidthSize('service') },
    { key: 'appointmentType', label: 'Appointment Type', widthSize: adminListingColumnWidthSize('status') },
    { key: 'preferredDate', label: 'Preferred Date', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => <Badge label={row.status} color="info" size="sm" />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 130,
      render: (_, row) => (
        <Button label="Book Appointment" variant="outlined" size="sm" onClick={() => onBook(row)} />
      ),
    },
  ]
}
