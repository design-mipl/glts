import { Box, Typography } from '@mui/material'
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
import { formatSlaTimer, isSlaAtRisk } from '../utils/assignmentQueueListingUtils'
import type { AssignmentAdminAction } from './AssignmentActionMenu'
import { ASSIGN_USER_VENDOR_ACTION_LABEL } from '../config/assignmentActionConfig'
import { AssignmentFundStatusCell } from './AssignmentFundStatusCell'

export interface AssignmentTableColumnsParams {
  onAction: (action: AssignmentAdminAction, row: OperationalPassengerRow) => void
}

function operationalStatusBadgeColor(status: string): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
  const tone = getApplicationOperationalTone(status)
  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'critical') return 'error'
  if (tone === 'info') return 'info'
  return 'neutral'
}

function buildRowActions(
  params: AssignmentTableColumnsParams,
  row: OperationalPassengerRow,
) {
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

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function buildAssignmentTableColumns(params: AssignmentTableColumnsParams): Column<OperationalPassengerRow>[] {
  return [
    {
      key: 'passengerName',
      label: 'Passenger Name',
      widthSize: 'md',
      sortable: true,
      searchable: true,
      render: (value, row: OperationalPassengerRow) => (
        <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
          {String(value || row.passengerName)}
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
      key: 'applicationId',
      label: 'Application ID / GLTS Reference',
      widthSize: 'lg',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <StackCell primary={row.gltsApplicationId} secondary={row.gltsApplicantId} />
      ),
    },
    {
      key: 'companyName',
      label: 'Company Name',
      widthSize: 'lg',
      sortable: true,
    },
    {
      key: 'countryVisa',
      label: 'Visa Country + Visa Type',
      widthSize: 'md',
      sortable: true,
      searchable: true,
      render: (_value, row: OperationalPassengerRow) => <CountryVisaCell row={row} />,
    },
    {
      key: 'jurisdiction',
      label: 'Jurisdiction',
      widthSize: 'md',
      sortable: true,
    },
    {
      key: 'travelDate',
      label: 'Travel Date',
      widthSize: 'md',
      sortable: true,
    },
    {
      key: 'assignedTeam',
      label: 'Assigned Team',
      widthSize: 'md',
      sortable: true,
    },
    {
      key: 'assignedUser',
      label: 'Assigned User',
      widthSize: 'md',
      sortable: true,
    },
    {
      key: 'operationalDate',
      label: 'Operational Date',
      widthSize: 'md',
      sortable: true,
    },
    {
      key: 'passengerStatus',
      label: 'Current Status',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Badge
          label={passengerStatusLabel[row.passengerStatus]}
          color={passengerStatusBadgeColor(row.passengerStatus)}
        />
      ),
    },
    {
      key: 'submissionStatus',
      label: 'Submission Status',
      widthSize: 'md',
      sortable: true,
      render: (value, row: OperationalPassengerRow) => (
        <Badge
          label={String(value || row.submissionStatus)}
          color={operationalStatusBadgeColor(row.submissionStatus)}
        />
      ),
    },
    {
      key: 'fundStatus',
      label: 'Fund Status',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => <AssignmentFundStatusCell passengerId={row.id} />,
    },
    {
      key: 'slaTimer',
      label: 'SLA / Time Remaining',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row: OperationalPassengerRow) => (
        <Badge
          label={formatSlaTimer(row)}
          color={isSlaAtRisk(row) ? 'error' : 'neutral'}
        />
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      widthSize: 'md',
      sortable: true,
      render: (_value, row: OperationalPassengerRow) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {formatUpdated(row.lastUpdated)}
        </Typography>
      ),
    },
    {
      key: 'operationalRemarks',
      label: 'Operational Remarks',
      widthSize: 'lg',
      sortable: false,
      render: (_value, row: OperationalPassengerRow) => (
        <Typography variant="body2" color="text.secondary" noWrap title={row.operationalRemarks}>
          {row.operationalRemarks || '—'}
        </Typography>
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

function CountryVisaCell({ row }: { row: OperationalPassengerRow }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
        {row.country}
      </Typography>
      <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11, display: 'block' }}>
        {row.visaType}
      </Typography>
    </Box>
  )
}

function StackCell({ primary, secondary }: { primary: string; secondary?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" fontWeight={600} noWrap>
        {primary}
      </Typography>
      {secondary ? (
        <Typography variant="caption" color="text.secondary" noWrap>
          {secondary}
        </Typography>
      ) : null}
    </Box>
  )
}
