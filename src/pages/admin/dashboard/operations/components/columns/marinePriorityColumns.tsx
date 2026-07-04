import { Box } from '@mui/material'
import { Badge, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { MarinePriorityRow } from '../../data/operationsConsultantDashboardMock'
import {
  marineDaysRemainingColor,
  priorityColor,
  priorityLabel,
} from '../../utils/applyOperationsConsultantFilters'

function DaysRemainingCell({ days }: { days: number }) {
  return (
    <Badge label={`${days} days`} color={marineDaysRemainingColor(days)} size="sm" />
  )
}

export function buildMarinePriorityColumns(): Column<MarinePriorityRow>[] {
  return [
    {
      key: 'vesselName',
      label: 'Vessel Name',
      widthSize: adminListingColumnWidthSize('company'),
      hideable: false,
      render: (_, row) => (
        <Box sx={{ fontWeight: row.daysRemaining < 7 ? 600 : 400 }}>{row.vesselName}</Box>
      ),
    },
    { key: 'crewName', label: 'Crew Name', widthSize: adminListingColumnWidthSize('name') },
    { key: 'joiningPort', label: 'Joining Port', widthSize: adminListingColumnWidthSize('jurisdiction') },
    { key: 'joiningDate', label: 'Joining Date', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'daysRemaining',
      label: 'Days Remaining',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => <DaysRemainingCell days={row.daysRemaining} />,
    },
    { key: 'visaStatus', label: 'Visa Status', widthSize: adminListingColumnWidthSize('status') },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: adminListingColumnWidthSize('priority'),
      render: (_, row) => (
        <Badge label={priorityLabel(row.priority)} color={priorityColor(row.priority)} size="sm" />
      ),
    },
  ]
}
