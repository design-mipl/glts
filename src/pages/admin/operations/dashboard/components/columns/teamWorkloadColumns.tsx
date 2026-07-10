import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { TeamWorkloadRow, TeamWorkloadStatus } from '../../data/operationsDashboardMock'

function workloadStatusLabel(status: TeamWorkloadStatus): string {
  if (status === 'balanced') return 'Balanced'
  if (status === 'overloaded') return 'Overloaded'
  return 'Underutilized'
}

function workloadStatusColor(status: TeamWorkloadStatus): 'success' | 'warning' | 'error' {
  if (status === 'balanced') return 'success'
  if (status === 'overloaded') return 'error'
  return 'warning'
}

function capacityColor(pct: number): 'success' | 'warning' | 'error' {
  if (pct > 120) return 'error'
  if (pct > 100) return 'warning'
  return 'success'
}

export interface TeamWorkloadColumnHandlers {
  onView: (row: TeamWorkloadRow) => void
}

export function buildTeamWorkloadColumns({
  onView,
}: TeamWorkloadColumnHandlers): Column<TeamWorkloadRow>[] {
  return [
    {
      key: 'team',
      label: 'Team',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: false,
      hideable: false,
    },
    {
      key: 'openCases',
      label: 'Open Cases',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: false,
    },
    {
      key: 'completedToday',
      label: 'Completed Today',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: false,
    },
    {
      key: 'capacityPct',
      label: 'Capacity %',
      widthSize: adminListingColumnWidthSize('sla'),
      sortable: false,
      render: (_, row) => (
        <Badge label={`${row.capacityPct}%`} color={capacityColor(row.capacityPct)} size="sm" />
      ),
    },
    {
      key: 'slaPct',
      label: 'SLA %',
      widthSize: adminListingColumnWidthSize('sla'),
      sortable: false,
      render: (_, row) => <Badge label={`${row.slaPct}%`} color="info" size="sm" />,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      render: (_, row) => (
        <Badge
          label={workloadStatusLabel(row.status)}
          color={workloadStatusColor(row.status)}
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
