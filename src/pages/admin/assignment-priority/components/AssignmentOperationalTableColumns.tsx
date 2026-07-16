import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import {
  ArrowRightLeft,
  Eye,
  MessageSquarePlus,
  RefreshCw,
  Star,
  UserCog,
  UserPlus,
} from 'lucide-react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { getApplicationOperationalTone } from '@/pages/customer/features/applications/components/listing/applicationStatus'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import {
  assignmentPriorityBadgeColor,
  assignmentPriorityLabel,
} from '../config/assignmentPriorityConfig'
import { passengerStatusBadgeColor, passengerStatusLabel } from '../config/assignmentStatusConfig'
import {
  formatSlaDisplayLabel,
  formatTravelDateLabel,
  getSlaBadgeColor,
} from '../utils/assignmentQueueListingUtils'
import type { AssignmentTableColumnsParams } from './AssignmentTableColumns'
import { ASSIGN_USER_VENDOR_ACTION_LABEL } from '../config/assignmentActionConfig'
import { AssignmentFundStatusCell } from './AssignmentFundStatusCell'

function operationalStatusBadgeColor(status: string): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
  const tone = getApplicationOperationalTone(status)
  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'critical') return 'error'
  if (tone === 'info') return 'info'
  return 'neutral'
}

function buildRowActions(params: AssignmentTableColumnsParams, row: OperationalPassengerRow) {
  const { onAction } = params

  return [
    {
      label: ASSIGN_USER_VENDOR_ACTION_LABEL,
      icon: <UserPlus size={16} />,
      onClick: () => onAction('assign_user', row),
    },
    {
      label: 'Change priority',
      icon: <Star size={16} />,
      onClick: () => onAction('change_priority', row),
    },
    {
      label: 'Update status',
      icon: <RefreshCw size={16} />,
      onClick: () => onAction('update_status', row),
    },
    {
      label: 'Reassign',
      icon: <UserCog size={16} />,
      onClick: () => onAction('reassign', row),
    },
    {
      label: 'Add operational notes',
      icon: <MessageSquarePlus size={16} />,
      onClick: () => onAction('add_notes', row),
    },
    {
      label: 'Move to next date',
      icon: <ArrowRightLeft size={16} />,
      onClick: () => onAction('move_next_date', row),
      divider: true,
    },
    {
      label: 'View details',
      icon: <Eye size={16} />,
      onClick: () => onAction('view_details', row),
    },
  ]
}

const stackedLinePrimarySx = {
  fontSize: 13,
  lineHeight: 1.35,
  fontWeight: 600,
} as const

const stackedLineSecondarySx = {
  fontSize: 12,
  lineHeight: 1.35,
  color: 'text.secondary',
} as const

const stackedLineTertiarySx = {
  fontSize: 12,
  lineHeight: 1.35,
  color: 'text.secondary',
} as const

function ApplicationCell({ row }: { row: OperationalPassengerRow }) {
  return (
    <Box sx={{ minWidth: 0, py: 0.25 }}>
      <Typography variant="body2" noWrap sx={{ ...stackedLinePrimarySx, fontWeight: 500 }}>
        {row.country} • {row.visaType}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineSecondarySx}>
        {row.gltsApplicationId}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineTertiarySx}>
        {row.companyName || '—'}
      </Typography>
    </Box>
  )
}

function AssignmentCell({ row }: { row: OperationalPassengerRow }) {
  const secondary =
    row.assigneeType === 'vendor' && row.assignedVendor
      ? `${row.assignedVendor} · ${row.assignedUser || '—'}`
      : row.assigneeType === 'passenger'
        ? `Passenger · ${row.assignedUser || '—'}`
        : row.assignedUser || '—'

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" noWrap sx={{ ...stackedLinePrimarySx, fontWeight: 500 }}>
        {row.assignedTeam || 'Unassigned'}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineSecondarySx}>
        {secondary}
      </Typography>
    </Box>
  )
}

function StatusCell({ row }: { row: OperationalPassengerRow }) {
  return (
    <StackedStatus>
      <Badge
        label={passengerStatusLabel[row.passengerStatus]}
        color={passengerStatusBadgeColor(row.passengerStatus)}
      />
      <Badge
        label={row.submissionStatus}
        color={operationalStatusBadgeColor(row.submissionStatus)}
      />
    </StackedStatus>
  )
}

function StackedStatus({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, py: 0.25 }}>
      {children}
    </Box>
  )
}

export function buildOperationalAssignmentTableColumns(
  params: AssignmentTableColumnsParams,
): Column<OperationalPassengerRow>[] {
  return [
    {
      key: 'passenger',
      label: 'Passenger',
      widthSize: 'md',
      sortable: true,
      searchable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
          {row.passengerName}
        </Typography>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Badge label={assignmentPriorityLabel[row.priority]} color={assignmentPriorityBadgeColor(row.priority)} />
      ),
    },
    {
      key: 'application',
      label: 'Application',
      widthSize: 'lg',
      sortable: true,
      searchable: true,
      render: (_value, row: OperationalPassengerRow) => <ApplicationCell row={row} />,
    },
    {
      key: 'jurisdiction',
      label: 'Jurisdiction',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Badge label={row.jurisdiction || '—'} color="info" />
      ),
    },
    {
      key: 'travelDate',
      label: 'Travel Date',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
          {formatTravelDateLabel(row.travelDate)}
        </Typography>
      ),
    },
    {
      key: 'assignment',
      label: 'Assignment',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => <AssignmentCell row={row} />,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => <StatusCell row={row} />,
    },
    {
      key: 'fundStatus',
      label: 'Fund Status',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => <AssignmentFundStatusCell passengerId={row.id} />,
    },
    {
      key: 'sla',
      label: 'SLA',
      widthSize: 'sm',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Badge label={formatSlaDisplayLabel(row)} color={getSlaBadgeColor(row)} />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row: OperationalPassengerRow) => (
        <RowActions row={row} actions={buildRowActions(params, row)} />
      ),
    },
  ]
}
