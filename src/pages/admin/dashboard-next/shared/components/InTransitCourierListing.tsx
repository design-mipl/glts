import { useMemo } from 'react'
import { Link, Typography } from '@mui/material'
import { ExternalLink } from 'lucide-react'
import {
  Badge,
  RowActions,
  type Column,
} from '@/design-system/UIComponents'
import type { LogisticsInTransitRow } from '../utils/mapLogisticsInTransitRows'
import { DashboardAdminListing } from './DashboardAdminListing'

function TrackingAwbCell({ row }: { row: LogisticsInTransitRow }) {
  const label = row.trackingNumber?.trim() || '—'
  if (row.trackingUrl?.trim() && label !== '—') {
    return (
      <Link
        href={row.trackingUrl}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        onClick={(event) => event.stopPropagation()}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
        <ExternalLink size={12} />
      </Link>
    )
  }
  return (
    <Typography variant="body2" sx={{ fontSize: 13 }}>
      {label}
    </Typography>
  )
}

export function getInTransitCourierCellValue(row: LogisticsInTransitRow, key: string): string {
  const value = row[key as keyof LogisticsInTransitRow]
  if (value == null) return ''
  return String(value)
}

export function buildInTransitCourierColumns(options: {
  onOpen: (row: LogisticsInTransitRow) => void
  openLabel?: string
  includeMethod?: boolean
}): Column<LogisticsInTransitRow>[] {
  const columns: Column<LogisticsInTransitRow>[] = [
    {
      key: 'applicationNumber',
      label: 'Application',
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
      key: 'courier',
      label: 'Courier',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'trackingNumber',
      label: 'AWB No',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
      render: (_value, row) => <TrackingAwbCell row={row} />,
    },
  ]

  if (options.includeMethod) {
    columns.push({
      key: 'deliveryMethod',
      label: 'Method',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
    })
  }

  columns.push(
    {
      key: 'eta',
      label: 'Dispatched',
      widthSize: 'md',
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: true,
      filterable: true,
      render: (_value, row) => <Badge label={row.status} color="info" />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      width: 56,
      render: (_value, row) => (
        <RowActions
          row={row}
          actions={[
            {
              label: options.openLabel ?? 'Open',
              onClick: () => options.onOpen(row),
            },
          ]}
        />
      ),
    },
  )

  return columns
}

export interface InTransitCourierListingProps {
  title?: string
  description?: string
  rows: LogisticsInTransitRow[]
  loading?: boolean
  onOpen: (row: LogisticsInTransitRow) => void
  onViewAll?: () => void
  viewAllLabel?: string
  openLabel?: string
  pageSize?: number
  includeMethod?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

/** AdminListingTable board for IN TRANSIT courier legs from Tracking & Logistics. */
export function InTransitCourierListing({
  title = 'IN TRANSIT',
  description = 'Courier name · AWB · tracking link — from Tracking & Logistics',
  rows,
  loading = false,
  onOpen,
  onViewAll,
  viewAllLabel = 'Open logistics',
  openLabel = 'Open',
  pageSize = 10,
  includeMethod = true,
  emptyTitle = 'No consignments in transit',
  emptyDescription = 'Dispatched passports with courier tracking appear here.',
}: InTransitCourierListingProps) {
  const columns = useMemo(
    () => buildInTransitCourierColumns({ onOpen, openLabel, includeMethod }),
    [onOpen, openLabel, includeMethod],
  )

  return (
    <DashboardAdminListing
      title={title}
      description={description}
      columns={columns}
      rows={rows}
      getCellValue={getInTransitCourierCellValue}
      loading={loading}
      onRowClick={onOpen}
      onViewAll={onViewAll}
      viewAllLabel={viewAllLabel}
      pageSize={pageSize}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  )
}
