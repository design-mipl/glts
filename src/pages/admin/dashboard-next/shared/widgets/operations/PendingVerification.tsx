import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import { ExecutiveTable } from '../../dashboard-ui-kit'
import { StatusBadge } from '../StatusBadge'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import type { DashboardStatusTone } from '../../types'

export type VerificationPriority = 'low' | 'medium' | 'high' | 'critical'

export interface PendingVerificationRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  consultant: string
  priority: VerificationPriority
  waitingTime: string
}

export interface PendingVerificationProps {
  title?: string
  subtitle?: string
  rows: PendingVerificationRow[]
  onRowClick?: (row: PendingVerificationRow) => void
  onViewAll?: () => void
  onAction?: (row: PendingVerificationRow) => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

function priorityTone(priority: VerificationPriority): DashboardStatusTone {
  switch (priority) {
    case 'critical':
      return 'error'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
    default:
      return 'neutral'
  }
}

export function PendingVerification({
  title = 'Pending verification',
  subtitle = 'Applications waiting for verification',
  rows,
  onRowClick,
  onViewAll,
  onAction,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: PendingVerificationProps) {
  const columns: Column<PendingVerificationRow>[] = [
    { key: 'glNumber', label: 'GL Number', widthSize: 'md', sortable: false },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'company', label: 'Company', widthSize: 'lg', sortable: false },
    { key: 'consultant', label: 'Consultant', widthSize: 'md', sortable: false },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => (
        <StatusBadge label={row.priority} tone={priorityTone(row.priority)} />
      ),
    },
    { key: 'waitingTime', label: 'Waiting Time', widthSize: 'md', sortable: false },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) =>
        onAction ? (
          <Button label="Open" variant="text" size="sm" onClick={() => onAction(row)} />
        ) : null,
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
      emptyTitle="No pending verifications"
    >
      <ExecutiveTable
        title={title}
        subtitle={subtitle}
        columns={columns}
        data={rows}
        rowKey="id"
        onRowClick={onRowClick}
        actionLabel={onViewAll ? 'View queue' : undefined}
        onAction={onViewAll}
        fullWidth
        loading={loading}
      />
    </BusinessWidgetFrame>
  )
}
