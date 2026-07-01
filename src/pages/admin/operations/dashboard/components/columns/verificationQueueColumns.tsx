import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { SlaStatus, VerificationQueueRow } from '../../data/operationsDashboardMock'

function slaColor(status: SlaStatus): 'success' | 'warning' | 'error' {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'error'
}

export interface VerificationQueueColumnHandlers {
  onView: (row: VerificationQueueRow) => void
}

export function buildVerificationQueueColumns({
  onView,
}: VerificationQueueColumnHandlers): Column<VerificationQueueRow>[] {
  return [
    {
      key: 'glNumber',
      label: 'GL Number',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: false,
      hideable: false,
    },
    {
      key: 'passenger',
      label: 'Passenger',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: false,
    },
    {
      key: 'company',
      label: 'Company',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: false,
    },
    {
      key: 'country',
      label: 'Country',
      widthSize: adminListingColumnWidthSize('country'),
      sortable: false,
    },
    {
      key: 'visaType',
      label: 'Visa Type',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: false,
    },
    {
      key: 'consultant',
      label: 'Consultant',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: false,
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: false,
    },
    {
      key: 'currentStage',
      label: 'Current Stage',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
    },
    {
      key: 'slaTimer',
      label: 'SLA Timer',
      widthSize: adminListingColumnWidthSize('sla'),
      sortable: false,
      render: (_, row) => (
        <Badge label={row.slaTimer} color={slaColor(row.slaStatus)} size="sm" />
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
