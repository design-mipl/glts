import type { Column } from '@/design-system/UIComponents'
import { ExecutiveTable } from '../dashboard-ui-kit'
import { isDashboardPermissionGranted } from '../utils/permission'
import { DASHBOARD_TABLE_DEFAULT_PAGE_SIZE } from '../constants'

export interface DashboardTableProps<T extends object> {
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

export function DashboardTable<T extends object>({
  title,
  subtitle,
  columns,
  data,
  rowKey,
  loading = false,
  pageSize = DASHBOARD_TABLE_DEFAULT_PAGE_SIZE,
  actionLabel = 'View all',
  onViewAll,
  onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust filters or check back later.',
  permission,
}: DashboardTableProps<T>) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  return (
    <ExecutiveTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      data={data}
      rowKey={rowKey}
      pageSize={pageSize}
      loading={loading}
      empty={data.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      onRowClick={onRowClick}
      actionLabel={onViewAll ? actionLabel : undefined}
      onAction={onViewAll}
      fullWidth
      stickyHeader
    />
  )
}
