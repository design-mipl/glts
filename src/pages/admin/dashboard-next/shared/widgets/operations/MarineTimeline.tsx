import type { Column } from '@/design-system/UIComponents'
import { ExecutiveTable } from '../../dashboard-ui-kit'
import { StatusBadge } from '../StatusBadge'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import {
  RAG_DAY_BAND_DESCRIPTION,
  RAG_STATUS_LABELS,
  type RagStatusId,
} from '../../config/ragStatus'
import type { DashboardStatusTone } from '../../types'

export interface MarineTimelineRow {
  id: string
  vessel: string
  crew: string
  joiningPort: string
  signOn: string
  /** Days remaining until sign-on — drives RAG bands. */
  daysRemaining?: number
  visaStatus: string
  priority: string
  ragStatus: RagStatusId
}

export interface MarineTimelineProps {
  title?: string
  subtitle?: string
  rows: MarineTimelineRow[]
  onRowClick?: (row: MarineTimelineRow) => void
  onViewAll?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

function ragTone(rag: RagStatusId): DashboardStatusTone {
  switch (rag) {
    case 'red':
      return 'error'
    case 'amber':
      return 'warning'
    case 'green':
    default:
      return 'success'
  }
}

export function MarineTimeline({
  title = 'Active Crew Changes',
  subtitle = RAG_DAY_BAND_DESCRIPTION,
  rows,
  onRowClick,
  onViewAll,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: MarineTimelineProps) {
  const columns: Column<MarineTimelineRow>[] = [
    { key: 'vessel', label: 'Vessel', widthSize: 'lg', sortable: false },
    { key: 'crew', label: 'Crew', widthSize: 'sm', sortable: false },
    { key: 'joiningPort', label: 'Joining Port', widthSize: 'md', sortable: false },
    { key: 'signOn', label: 'Sign On', widthSize: 'md', sortable: false },
    {
      key: 'daysRemaining',
      label: 'Days Left',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) =>
        typeof row.daysRemaining === 'number' ? String(row.daysRemaining) : '—',
    },
    { key: 'visaStatus', label: 'Visa Status', widthSize: 'md', sortable: false },
    {
      key: 'ragStatus',
      label: 'RAG',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => (
        <StatusBadge label={RAG_STATUS_LABELS[row.ragStatus]} tone={ragTone(row.ragStatus)} />
      ),
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
      emptyTitle="No active crew changes"
      emptyDescription="No vessel sign-ons match the current global filters."
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
