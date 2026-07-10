import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { EscalationRow } from '../../data/operationsDashboardMock'

export interface EscalationColumnHandlers {
  onView: (row: EscalationRow) => void
}

export function buildEscalationColumns({
  onView,
}: EscalationColumnHandlers): Column<EscalationRow>[] {
  return [
    {
      key: 'raisedBy',
      label: 'Raised By',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: false,
      hideable: false,
    },
    {
      key: 'escalationType',
      label: 'Escalation Type',
      widthSize: adminListingColumnWidthSize('country'),
      sortable: false,
    },
    {
      key: 'currentOwner',
      label: 'Current Owner',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: false,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      render: (_, row) => <Badge label={row.status} color="warning" size="sm" />,
    },
    {
      key: 'slaCountdown',
      label: 'SLA Countdown',
      widthSize: adminListingColumnWidthSize('sla'),
      sortable: false,
      render: (_, row) => <Badge label={row.slaCountdown} color="error" size="sm" />,
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
