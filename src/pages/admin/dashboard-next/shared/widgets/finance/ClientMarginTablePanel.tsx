import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Select, type Column, type TableState } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import type { DashboardClientMarginItem } from '../../types'

const TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 10', value: '10' },
  { label: 'Top 15', value: '15' },
  { label: 'Top 20', value: '20' },
  { label: 'Top 25', value: '25' },
] as const

type MarginTopN = '5' | '10' | '15' | '20' | '25'

function formatLakhs(value: number): string {
  return `₹${value.toFixed(1)}L`
}

function formatPct(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`
}

function createTableState(pageSize: number): TableState {
  return {
    page: 0,
    pageSize,
    sortKey: null,
    sortDirection: 'asc',
    filters: [],
    searchQuery: '',
    columnSearch: {},
    selectedRows: [],
    expandedRows: [],
    hiddenColumnKeys: [],
  }
}

function getCellValue(row: DashboardClientMarginItem, key: string): string {
  switch (key) {
    case 'client':
      return row.client
    case 'marginPercent':
      return String(row.marginPercent)
    case 'revenueMtdL':
      return formatLakhs(row.revenueMtdL)
    default:
      return ''
  }
}

const COLUMNS: Column<DashboardClientMarginItem>[] = [
  {
    key: 'client',
    label: 'Client',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => (
      <Box>
        <Box component="span" sx={{ display: 'block', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.client}
        </Box>
        <Box component="span" sx={{ display: 'block', fontSize: 11, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.segment}
        </Box>
      </Box>
    ),
  },
  {
    key: 'marginPercent',
    label: 'Margin',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => formatPct(row.marginPercent),
  },
  {
    key: 'revenueMtdL',
    label: 'MTD revenue',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => formatLakhs(row.revenueMtdL),
  },
]

export interface ClientMarginTablePanelProps {
  title: string
  description?: string
  items: DashboardClientMarginItem[]
  loading?: boolean
  sortDirection?: 'asc' | 'desc'
}

/** Client margin table — client, margin %, MTD revenue. */
export function ClientMarginTablePanel({
  title,
  description,
  items,
  loading,
  sortDirection = 'desc',
}: ClientMarginTablePanelProps) {
  const colors = usePublicBrandColors()
  const [topN, setTopN] = useState<MarginTopN>('5')
  const pageSize = Number(topN)

  const [tableState, setTableState] = useState<TableState>(() => createTableState(pageSize))
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const rows = useMemo(() => {
    const sorted = [...items].sort((a, b) =>
      sortDirection === 'asc' ? a.marginPercent - b.marginPercent : b.marginPercent - a.marginPercent,
    )
    return sorted.slice(0, pageSize)
  }, [items, pageSize, sortDirection])

  const handleTopNChange = (next: MarginTopN) => {
    setTopN(next)
    setTableState((prev) => ({ ...prev, pageSize: Number(next), page: 0 }))
  }

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <ExecutiveSectionHeader title={title} description={description} />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
            <Select
              size="sm"
              fullWidth
              aria-label={`${title} top N`}
              value={topN}
              options={[...TOP_N_OPTIONS]}
              onChange={(next) => handleTopNChange(String(next) as MarginTopN)}
            />
          </Box>
        </Stack>
      </Box>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <AdminListingTable
          columns={COLUMNS}
          data={rows}
          filterSourceData={rows}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          getCellValue={getCellValue}
          stickyHeader
          enableColumnSort={false}
          enableColumnFilters={false}
          showPagination={false}
          loading={loading}
          emptyTitle="No clients"
          emptyDescription="Nothing to show for this margin view."
        />
      </Box>
    </Box>
  )
}
