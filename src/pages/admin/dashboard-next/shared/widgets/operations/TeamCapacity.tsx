import { useMemo } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { ProgressBar } from '@/design-system/UIComponents'
import { Box } from '@mui/material'
import { StatusBadge } from '../StatusBadge'
import {
  TEAM_CAPACITY_STATUS_LABELS,
  resolveTeamCapacityStatus,
  type TeamCapacityStatusId,
} from '../../config/teamCapacity'
import type { DashboardStatusTone } from '../../types'
import { DashboardAdminListing } from '../../components/DashboardAdminListing'

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

function resolveRowStatus(row: TeamCapacityRow): TeamCapacityStatusId {
  const utilization =
    row.capacity > 0 ? Math.round((row.openCases / row.capacity) * 100) : 0
  return row.status ?? resolveTeamCapacityStatus(utilization)
}

function getTeamCapacityCellValue(row: TeamCapacityRow, key: string): string {
  if (key === 'capacity') {
    const utilization =
      row.capacity > 0 ? Math.min(100, Math.round((row.openCases / row.capacity) * 100)) : 0
    return `${utilization}%`
  }
  if (key === 'slaPercent') {
    return `${Math.round(row.slaPercent)}%`
  }
  if (key === 'status') {
    return TEAM_CAPACITY_STATUS_LABELS[resolveRowStatus(row)]
  }
  const value = row[key as keyof TeamCapacityRow]
  if (value == null) return ''
  return String(value)
}

export function TeamCapacity({
  title = 'Team capacity',
  subtitle = 'Workload by department',
  rows,
  onRowClick,
  onViewAll,
  loading,
}: TeamCapacityProps) {
  const columns: Column<TeamCapacityRow>[] = useMemo(
    () => [
      {
        key: 'department',
        label: 'Department',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'openCases',
        label: 'Open Cases',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
      },
      {
        key: 'completedToday',
        label: 'Completed Today',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
      },
      {
        key: 'capacity',
        label: 'Capacity',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        render: (_value, row) => {
          const utilization =
            row.capacity > 0
              ? Math.min(100, Math.round((row.openCases / row.capacity) * 100))
              : 0
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
        sortable: true,
        filterable: true,
        render: (_value, row) => `${Math.round(row.slaPercent)}%`,
      },
      {
        key: 'status',
        label: 'Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => {
          const status = resolveRowStatus(row)
          return (
            <StatusBadge label={TEAM_CAPACITY_STATUS_LABELS[status]} tone={statusTone(status)} />
          )
        },
      },
    ],
    [],
  )

  return (
    <DashboardAdminListing
      title={title}
      description={subtitle}
      columns={columns}
      rows={rows}
      getCellValue={getTeamCapacityCellValue}
      loading={loading}
      onRowClick={onRowClick}
      onViewAll={onViewAll}
      viewAllLabel="View all"
      emptyTitle="No capacity data"
      emptyDescription="Team capacity appears when departments have open workload."
    />
  )
}
