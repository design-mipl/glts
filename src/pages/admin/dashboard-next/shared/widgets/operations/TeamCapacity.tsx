import type { Column } from '@/design-system/UIComponents'
import { ProgressBar } from '@/design-system/UIComponents'
import { Box } from '@mui/material'
import { ExecutiveTable } from '../../dashboard-ui-kit'
import { StatusBadge } from '../StatusBadge'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import {
  TEAM_CAPACITY_STATUS_LABELS,
  resolveTeamCapacityStatus,
  type TeamCapacityStatusId,
} from '../../config/teamCapacity'
import type { DashboardStatusTone } from '../../types'

export interface TeamCapacityRow {
  id: string
  department: string
  openCases: number
  completedToday: number
  /** Absolute capacity units (e.g. seats / target open cases). */
  capacity: number
  slaPercent: number
  /** Optional override; otherwise derived from openCases/capacity. */
  status?: TeamCapacityStatusId
}

export interface TeamCapacityProps {
  title?: string
  subtitle?: string
  rows: TeamCapacityRow[]
  onRowClick?: (row: TeamCapacityRow) => void
  onViewAll?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

function statusTone(status: TeamCapacityStatusId): DashboardStatusTone {
  switch (status) {
    case 'overloaded':
      return 'error'
    case 'busy':
      return 'warning'
    case 'balanced':
    default:
      return 'success'
  }
}

export function TeamCapacity({
  title = 'Team capacity',
  subtitle = 'Workload by department',
  rows,
  onRowClick,
  onViewAll,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: TeamCapacityProps) {
  const columns: Column<TeamCapacityRow>[] = [
    { key: 'department', label: 'Department', widthSize: 'lg', sortable: false },
    { key: 'openCases', label: 'Open Cases', widthSize: 'sm', sortable: false },
    { key: 'completedToday', label: 'Completed Today', widthSize: 'sm', sortable: false },
    {
      key: 'capacity',
      label: 'Capacity',
      widthSize: 'md',
      sortable: false,
      render: (_value, row) => {
        const utilization =
          row.capacity > 0 ? Math.min(100, Math.round((row.openCases / row.capacity) * 100)) : 0
        return (
          <Box>
            <ProgressBar value={utilization} showValue size="sm" />
          </Box>
        )
      },
    },
    {
      key: 'slaPercent',
      label: 'SLA',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => `${Math.round(row.slaPercent)}%`,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => {
        const utilization =
          row.capacity > 0 ? Math.round((row.openCases / row.capacity) * 100) : 0
        const status = row.status ?? resolveTeamCapacityStatus(utilization)
        return (
          <StatusBadge label={TEAM_CAPACITY_STATUS_LABELS[status]} tone={statusTone(status)} />
        )
      },
    },
  ]

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? rows.length === 0}
      permission={permission}
      onRetry={onRetry}
      emptyTitle="No capacity data"
    >
      <ExecutiveTable
        title={title}
        subtitle={subtitle}
        columns={columns}
        data={rows}
        rowKey="id"
        onRowClick={onRowClick}
        actionLabel={onViewAll ? 'View all' : undefined}
        onAction={onViewAll}
        fullWidth
        loading={loading}
      />
    </BusinessWidgetFrame>
  )
}
