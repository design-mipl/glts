import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { NoMovementCaseRow } from '../../data/operationsDashboardMock'

export interface NoMovementColumnHandlers {
  onView: (row: NoMovementCaseRow) => void
}

export function buildNoMovementColumns({
  onView,
}: NoMovementColumnHandlers): Column<NoMovementCaseRow>[] {
  return [
    {
      key: 'applicationId',
      label: 'Application ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: false,
      hideable: false,
    },
    {
      key: 'applicant',
      label: 'Applicant',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: false,
    },
    {
      key: 'consultant',
      label: 'Consultant',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: false,
    },
    {
      key: 'currentStage',
      label: 'Current Stage',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: false,
    },
    {
      key: 'daysIdle',
      label: 'Days Idle',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: false,
      render: (_, row) => (
        <Badge
          label={`${row.daysIdle}d`}
          color={row.daysIdle >= 10 ? 'error' : row.daysIdle >= 7 ? 'warning' : 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions
          row={row}
          actions={[{ label: 'View', onClick: () => onView(row) }]}
        />
      ),
    },
  ]
}
