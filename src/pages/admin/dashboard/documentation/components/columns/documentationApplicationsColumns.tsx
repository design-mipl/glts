import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { DocumentationApplicationRow } from '../../data/documentationDashboardMock'
import { slaStatusColor, slaStatusLabel } from '../../utils/applyDocumentationDashboardFilters'

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

export interface DocumentationApplicationsColumnHandlers {
  onView: (row: DocumentationApplicationRow) => void
}

export function buildDocumentationApplicationsColumns({
  onView,
}: DocumentationApplicationsColumnHandlers): Column<DocumentationApplicationRow>[] {
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
    { key: 'nextAction', label: 'Next Action', widthSize: adminListingColumnWidthSize('description') },
    { key: 'waitingOn', label: 'Waiting On', widthSize: adminListingColumnWidthSize('assignee') },
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
