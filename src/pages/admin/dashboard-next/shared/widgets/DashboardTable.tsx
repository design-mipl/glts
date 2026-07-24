import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import {
  DataTable,
  type Column,
  type TableState,
} from '@/design-system/UIComponents'
import { DashboardSection } from '../components/DashboardSection'
import {
  DASHBOARD_SPACING,
  DASHBOARD_TABLE_DEFAULT_PAGE_SIZE,
  INITIAL_DASHBOARD_TABLE_STATE,
} from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'

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
  card = true,
}: DashboardTableProps<T>) {
  const [state, setState] = useState<TableState>({
    ...INITIAL_DASHBOARD_TABLE_STATE,
    pageSize,
  })

  const displayData = useMemo(() => data.slice(0, pageSize), [data, pageSize])

  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  return (
    <DashboardSection
      title={title}
      subtitle={subtitle}
      actionLabel={onViewAll ? actionLabel : undefined}
      onAction={onViewAll}
      card={card}
    >
      <Box sx={{ mx: card ? -DASHBOARD_SPACING.field : 0 }}>
        <DataTable
          columns={columns}
          data={displayData}
          rowKey={rowKey}
          state={state}
          onStateChange={setState}
          onRowClick={onRowClick}
          loading={loading}
          stickyHeader
          emptyState={{
            title: emptyTitle,
            description: emptyDescription,
          }}
        />
      </Box>
    </DashboardSection>
  )
}
