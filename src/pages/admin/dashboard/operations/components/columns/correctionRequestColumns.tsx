import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { CorrectionRequestRow } from '../../data/operationsConsultantDashboardMock'

export interface CorrectionRequestColumnHandlers {
  onView: (row: CorrectionRequestRow) => void
}

export function buildCorrectionRequestColumns({
  onView,
}: CorrectionRequestColumnHandlers): Column<CorrectionRequestRow>[] {
  return [
    {
      key: 'applicationId',
      label: 'Application ID',
      widthSize: adminListingColumnWidthSize('code'),
      hideable: false,
      render: (_, row) => (
        <Badge
          label={row.applicationId}
          color={row.isOverdue ? 'error' : 'neutral'}
          size="sm"
          variant="soft"
        />
      ),
    },
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name') },
    { key: 'raisedBy', label: 'Raised By', widthSize: adminListingColumnWidthSize('assignee') },
    { key: 'reason', label: 'Reason', widthSize: adminListingColumnWidthSize('description') },
    {
      key: 'waitingSince',
      label: 'Waiting Since',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => (
        <Badge
          label={row.waitingSince}
          color={row.isOverdue ? 'error' : 'warning'}
          size="sm"
        />
      ),
    },
    { key: 'assignedTo', label: 'Assigned To', widthSize: adminListingColumnWidthSize('assignee') },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions row={row} actions={[{ label: 'View', onClick: () => onView(row) }]} />
      ),
    },
  ]
}
