import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { type Column, type TableState } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  TopNSelect,
  sliceTopN,
  useTopN,
} from './SuperAdminChrome'
import type { SuperAdminDestinationMixItem } from '../types'

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

function getCellValue(row: SuperAdminDestinationMixItem, key: string): string {
  switch (key) {
    case 'label':
      return row.label
    case 'volume':
      return String(row.volume)
    case 'revenueL':
      return formatLakhs(row.revenueL)
    case 'grossProfitL':
      return formatLakhs(row.grossProfitL)
    case 'approvalPct':
      return formatPct(row.approvalPct)
    case 'rejectionPct':
      return formatPct(row.rejectionPct)
    default:
      return ''
  }
}

const COLUMNS: Column<SuperAdminDestinationMixItem>[] = [
  {
    key: 'label',
    label: 'Destination',
    widthSize: 'md',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => (
      <Box component="span" sx={{ fontWeight: 600 }}>
        {row.label}
      </Box>
    ),
  },
  {
    key: 'volume',
    label: 'Applications',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => row.volume.toLocaleString(),
  },
  {
    key: 'revenueL',
    label: 'Revenue',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => formatLakhs(row.revenueL),
  },
  {
    key: 'grossProfitL',
    label: 'Margin',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => formatLakhs(row.grossProfitL),
  },
  {
    key: 'approvalPct',
    label: 'Approval rate',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => formatPct(row.approvalPct),
  },
  {
    key: 'rejectionPct',
    label: 'Rejection rate',
    widthSize: 'sm',
    align: 'right',
    sortable: false,
    filterable: false,
    searchable: false,
    render: (_value, row) => formatPct(row.rejectionPct),
  },
]

export interface SegmentDestinationIntelligenceSectionProps {
  items: SuperAdminDestinationMixItem[]
  loading?: boolean
}

/**
 * Destination intelligence — single-card admin table (no sort / column filters).
 * Top 5–25 limit only.
 */
export function SegmentDestinationIntelligenceSection({
  items,
  loading,
}: SegmentDestinationIntelligenceSectionProps) {
  const colors = usePublicBrandColors()
  const top = useTopN('10')
  const pageSize = Number(top.topN)

  const [tableState, setTableState] = useState<TableState>(() => createTableState(pageSize))
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const rows = useMemo(
    () =>
      sliceTopN(
        [...items].sort((a, b) => b.volume - a.volume),
        top.topN,
      ),
    [items, top.topN],
  )

  const handleTopNChange = (next: typeof top.topN) => {
    top.setTopN(next)
    const nextSize = Number(next)
    setTableState((prev) => ({ ...prev, pageSize: nextSize, page: 0 }))
  }

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <ExecutiveSectionHeader title="Destination intelligence" />
          </Box>
          <TopNSelect
            value={top.topN}
            onChange={handleTopNChange}
            ariaLabel="Destination intelligence top N"
          />
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
          emptyTitle="No destination data"
          emptyDescription="Nothing to show for this segment yet."
        />
      </Box>
    </Box>
  )
}
