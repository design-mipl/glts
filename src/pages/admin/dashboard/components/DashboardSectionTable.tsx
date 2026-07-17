import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { Column, TableState } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { INITIAL_TABLE_STATE } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExecutiveSectionHeader } from './ExecutiveSectionHeader'
import { EXECUTIVE_TABLE_SX, executiveCardLevel2Sx } from './executiveDashboardTokens'

export interface DashboardSectionTableProps<T extends object> {
  title: string
  subtitle?: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T & string
  getCellValue: (row: T, key: string) => string
  loading?: boolean
  pageSize?: number
  actionLabel?: string
  onViewAll?: () => void
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
  embedded?: boolean
  tableSx?: SxProps<Theme>
}

export function DashboardSectionTable<T extends object>({
  title,
  subtitle,
  columns,
  data,
  rowKey,
  getCellValue,
  loading = false,
  pageSize = 6,
  actionLabel = 'View queue',
  onViewAll,
  onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust filters or check back later.',
  embedded = false,
  tableSx,
}: DashboardSectionTableProps<T>) {
  const colors = usePublicBrandColors()
  const [state, setState] = useState<TableState>({
    ...INITIAL_TABLE_STATE,
    pageSize,
  })
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const displayData = useMemo(() => data.slice(0, pageSize), [data, pageSize])

  const table = (
    <Box sx={[EXECUTIVE_TABLE_SX, ...(Array.isArray(tableSx) ? tableSx : tableSx ? [tableSx] : [])]}>
      <AdminListingTable
        columns={columns}
        data={displayData}
        filterSourceData={data}
        rowKey={rowKey}
        state={state}
        onStateChange={setState}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        getCellValue={getCellValue}
        onRowClick={onRowClick}
        loading={loading}
        enableColumnSort={false}
        enableColumnFilters={false}
        stickyHeader
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </Box>
  )

  if (embedded) {
    return table
  }

  return (
    <Box>
      <ExecutiveSectionHeader
        title={title}
        description={subtitle}
        actionLabel={actionLabel}
        onAction={onViewAll}
      />
      <Box sx={{ ...executiveCardLevel2Sx(colors), overflow: 'hidden' }}>{table}</Box>
    </Box>
  )
}
