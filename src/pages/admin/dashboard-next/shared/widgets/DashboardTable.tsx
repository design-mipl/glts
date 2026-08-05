import { useMemo } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { isDashboardPermissionGranted } from '../utils/permission'
import { DASHBOARD_TABLE_DEFAULT_PAGE_SIZE } from '../constants'
import { DashboardAdminListing } from '../components/DashboardAdminListing'

export interface DashboardTableProps<T extends { id: string }> {
  title: string
  subtitle?: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T & string
  loading?: boolean
  empty?: boolean
  pageSize?: number
  actionLabel?: string
  onViewAll?: () => void
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
  permission?: boolean
  card?: boolean
}

function defaultGetCellValue<T extends object>(row: T, key: string): string {
  const value = row[key as keyof T]
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

/** Dashboard table using the product AdminListingTable pattern. */
export function DashboardTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  data,
  loading = false,
  pageSize = DASHBOARD_TABLE_DEFAULT_PAGE_SIZE,
  actionLabel = 'View all',
  onViewAll,
  onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust filters or check back later.',
  permission,
}: DashboardTableProps<T>) {
  const columnsMemo = useMemo(() => columns, [columns])

  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  return (
    <DashboardAdminListing
      title={title}
      description={subtitle}
      columns={columnsMemo}
      rows={data}
      getCellValue={defaultGetCellValue}
      loading={loading}
      onRowClick={onRowClick}
      onViewAll={onViewAll}
      viewAllLabel={actionLabel}
      pageSize={pageSize}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  )
}
