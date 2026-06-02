import { useMemo } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import type { AdminPortalUserActivityLog } from '@/shared/types/adminPortalUser'
import { formatUserDateTime, getActivityLogCellValue } from '../utils/userListingUtils'

interface UserActivityLogTableProps {
  logs: AdminPortalUserActivityLog[]
}

type LogRow = AdminPortalUserActivityLog

function buildActivityColumns(): Column<LogRow>[] {
  return [
    {
      key: 'activity',
      label: 'Activity',
      minWidth: 220,
      sortable: false,
      filterable: true,
    },
    {
      key: 'doneBy',
      label: 'Done By',
      minWidth: 140,
      sortable: true,
      filterable: true,
    },
    {
      key: 'timestamp',
      label: 'Date & Time',
      width: 180,
      sortable: true,
      filterable: false,
      render: (_, row) => formatUserDateTime(row.timestamp),
    },
  ]
}

export function UserActivityLogTable({ logs }: UserActivityLogTableProps) {
  const rows = useMemo(
    () =>
      [...logs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [logs],
  )

  const listing = useCustomerListing({
    rows,
    getCellValue: (row, key) => {
      if (key === 'timestamp') return formatUserDateTime(row.timestamp)
      return getActivityLogCellValue(row, key)
    },
    searchMatch: () => true,
    initialPageSize: 10,
  })

  const columns = useMemo(() => buildActivityColumns(), [])

  return (
    <AdminListingTable
      columns={columns}
      data={listing.paginatedRows}
      filterSourceData={listing.filterSourceRows}
      rowKey="id"
      state={listing.tableState}
      onStateChange={listing.setTableState}
      columnFilters={listing.columnFilters}
      onColumnFiltersChange={listing.setColumnFilters}
      getCellValue={(row, key) => {
        if (key === 'timestamp') return formatUserDateTime(row.timestamp)
        return getActivityLogCellValue(row, key)
      }}
      stickyHeader
      emptyTitle="No activity recorded"
      emptyDescription="Login, updates, and permission changes will appear here."
    />
  )
}
