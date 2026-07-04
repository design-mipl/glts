import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { MyApplicationRow } from '../../data/operationsConsultantDashboardMock'
import {
  priorityColor,
  priorityLabel,
  slaStatusColor,
  slaStatusLabel,
} from '../../utils/applyOperationsConsultantFilters'

function SlaAccentCell({ children, slaStatus }: { children: ReactNode; slaStatus: string }) {
  const theme = useTheme()
  const color =
    slaStatus === 'breached'
      ? theme.palette.error.main
      : slaStatus === 'at_risk'
        ? theme.palette.warning.main
        : theme.palette.success.main

  return (
    <Box sx={{ borderLeft: 3, borderColor: color, pl: 1, ml: -1 }}>
      {children}
    </Box>
  )
}

export interface MyApplicationsColumnHandlers {
  onView: (row: MyApplicationRow) => void
}

export function buildMyApplicationsColumns({
  onView,
}: MyApplicationsColumnHandlers): Column<MyApplicationRow>[] {
  return [
    {
      key: 'glNumber',
      label: 'GL Number',
      widthSize: adminListingColumnWidthSize('code'),
      hideable: false,
      render: (_, row) => (
        <SlaAccentCell slaStatus={row.slaStatus}>{row.glNumber}</SlaAccentCell>
      ),
    },
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name') },
    { key: 'company', label: 'Company', widthSize: adminListingColumnWidthSize('company') },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'visaType', label: 'Visa Type', widthSize: adminListingColumnWidthSize('service') },
    { key: 'currentStage', label: 'Current Stage', widthSize: adminListingColumnWidthSize('status') },
    {
      key: 'nextActionRequired',
      label: 'Next Action Required',
      widthSize: adminListingColumnWidthSize('description'),
    },
    { key: 'waitingOn', label: 'Waiting On', widthSize: adminListingColumnWidthSize('assignee') },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: adminListingColumnWidthSize('priority'),
      render: (_, row) => (
        <Badge label={priorityLabel(row.priority)} color={priorityColor(row.priority)} size="sm" />
      ),
    },
    {
      key: 'slaTimer',
      label: 'SLA Timer',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => (
        <Badge label={slaStatusLabel(row.slaStatus)} color={slaStatusColor(row.slaStatus)} size="sm" />
      ),
    },
    { key: 'dueDate', label: 'Due Date', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions row={row} actions={[{ label: 'Open', onClick: () => onView(row) }]} />
      ),
    },
  ]
}
