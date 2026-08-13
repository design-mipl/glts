import { useMemo } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { StatusBadge } from '../StatusBadge'
import {
  RAG_DAY_BAND_DESCRIPTION,
  RAG_STATUS_LABELS,
  type RagStatusId,
} from '../../config/ragStatus'
import type { DashboardStatusTone } from '../../types'
import { DashboardAdminListing } from '../../components/DashboardAdminListing'

export interface MarineTimelineRow {
  id: string
  vessel: string
  crew: string
  joiningPort: string
  /** Passenger joining date (YYYY-MM-DD or display date). */
  joiningDate: string
  /** Days left until joining date — drives RAG bands. */
  daysRemaining?: number
  visaStatus: string
  priority: string
  ragStatus: RagStatusId
  /** Destination filter key (uae, schengen, uk, us) for segment country scope. */
  destinationCountry?: string
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

function getMarineTimelineCellValue(row: MarineTimelineRow, key: string): string {
  if (key === 'daysRemaining') {
    return typeof row.daysRemaining === 'number' ? String(row.daysRemaining) : ''
  }
  if (key === 'ragStatus') {
    return RAG_STATUS_LABELS[row.ragStatus]
  }
  const value = row[key as keyof MarineTimelineRow]
  if (value == null) return ''
  return String(value)
}

export function MarineTimeline({
  title = 'Active Crew Changes',
  subtitle = RAG_DAY_BAND_DESCRIPTION,
  rows,
  onRowClick,
  onViewAll,
  loading,
}: MarineTimelineProps) {
  const columns: Column<MarineTimelineRow>[] = useMemo(
    () => [
      {
        key: 'vessel',
        label: 'Vessel',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'crew',
        label: 'Crew',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'joiningPort',
        label: 'Joining Port',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'joiningDate',
        label: 'Joining Date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'daysRemaining',
        label: 'Days Left',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) =>
          typeof row.daysRemaining === 'number' ? String(row.daysRemaining) : '—',
      },
      {
        key: 'visaStatus',
        label: 'Visa Status',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'ragStatus',
        label: 'RAG',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <StatusBadge label={RAG_STATUS_LABELS[row.ragStatus]} tone={ragTone(row.ragStatus)} />
        ),
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
      getCellValue={getMarineTimelineCellValue}
      loading={loading}
      onRowClick={onRowClick}
      onViewAll={onViewAll}
      viewAllLabel="View all"
      emptyTitle="No active crew changes"
      emptyDescription="No vessel joining dates match the current global filters."
    />
  )
}
