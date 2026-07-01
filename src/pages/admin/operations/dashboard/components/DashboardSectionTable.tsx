import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { Column, TableState } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { INITIAL_TABLE_STATE } from '@/pages/customer/features/shared/hooks/useCustomerListing'

export interface DashboardSectionTableProps<T extends object> {
  title: string
  subtitle?: string
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T & string
  getCellValue: (row: T, key: string) => string
  loading?: boolean
  pageSize?: number
  viewAllLabel?: string
  onViewAll?: () => void
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
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
  viewAllLabel = 'View all',
  onViewAll,
  onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust filters or check back later.',
}: DashboardSectionTableProps<T>) {
  const [state, setState] = useState<TableState>({
    ...INITIAL_TABLE_STATE,
    pageSize,
  })
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const displayData = useMemo(() => data.slice(0, pageSize), [data, pageSize])

  return (
    <BaseCard sx={{ overflow: 'hidden', height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1 }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {onViewAll ? (
          <Button label={viewAllLabel} variant="text" size="sm" onClick={onViewAll} />
        ) : null}
      </Stack>
      <Box sx={{ px: 0, pb: 0 }}>
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
    </BaseCard>
  )
}
