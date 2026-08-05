import { useMemo } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { RowActions } from '@/design-system/UIComponents'
import { StatusBadge } from '../StatusBadge'
import type { DashboardStatusTone } from '../../types'
import { DashboardAdminListing } from '../../components/DashboardAdminListing'

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

function getPendingVerificationCellValue(row: PendingVerificationRow, key: string): string {
  const value = row[key as keyof PendingVerificationRow]
  if (value == null) return ''
  return String(value)
}

export function PendingVerification({
  title = 'Pending verification',
  subtitle = 'Applications waiting for verification',
  rows,
  onRowClick,
  onViewAll,
  onAction,
  loading,
}: PendingVerificationProps) {
  const columns: Column<PendingVerificationRow>[] = useMemo(
    () => [
      {
        key: 'glNumber',
        label: 'GL Number',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'applicant',
        label: 'Applicant',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'company',
        label: 'Company',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'consultant',
        label: 'Consultant',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'priority',
        label: 'Priority',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <StatusBadge label={row.priority} tone={priorityTone(row.priority)} />
        ),
      },
      {
        key: 'waitingTime',
        label: 'Waiting Time',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'actions',
        label: '',
        hideable: false,
        sortable: false,
        filterable: false,
        searchable: false,
        width: 56,
        render: (_value, row) =>
          onAction ? (
            <RowActions
              row={row}
              actions={[{ label: 'Open', onClick: () => onAction(row) }]}
            />
          ) : null,
      },
    ],
    [onAction],
  )

  return (
    <DashboardAdminListing
      title={title}
      description={subtitle}
      columns={columns}
      rows={rows}
      getCellValue={getPendingVerificationCellValue}
      loading={loading}
      onRowClick={onRowClick}
      onViewAll={onViewAll}
      viewAllLabel="View queue"
      emptyTitle="No pending verifications"
      emptyDescription="Verification queue is clear for the current filters."
    />
  )
}
