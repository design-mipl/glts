import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { orderService } from '@/shared/services/orderService'
import type { Order } from '@/shared/types/order'
import { OrderKpiRow } from '../components/OrderKpiRow'
import { buildOrderColumns } from '../components/OrderTableColumns'
import {
  downloadOrderCsv,
  filterOrderRowsByTab,
  getOrderCellValue,
  getOrderEmptyState,
  mapOrderRowsToGridItems,
  matchesOrderSearch,
  type OrderListingTab,
} from '../utils/orderListingUtils'

const ORDER_LISTING_PATH = '/admin/order-management/orders'
const ORDER_TAB_VALUES: readonly OrderListingTab[] = [
  'all',
  'draft',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
]

export function OrderListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useListingTabParam(ORDER_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)

  const goFromListing = useCallback(
    (to: string) => navigateFromListing(navigate, to, listingReturnHref),
    [listingReturnHref, navigate],
  )

  const loadRows = async () => {
    setLoading(true)
    const data = await orderService.getOrders()
    setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    void loadRows()
  }, [])

  const columns = useMemo(
    () =>
      buildOrderColumns({
        onOpenDetail: (row) => goFromListing(`${ORDER_LISTING_PATH}/${row.id}`),
        onOpenEdit: (row) => goFromListing(`${ORDER_LISTING_PATH}/${row.id}/edit`),
      }),
    [goFromListing],
  )

  const tabFilteredRows = useMemo(() => filterOrderRowsByTab(rows, activeTab), [rows, activeTab])

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: getOrderCellValue,
    searchMatch: matchesOrderSearch,
    initialPageSize: 10,
  })

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    goFromListing(`${ORDER_LISTING_PATH}/new`)
  }, [goFromListing])

  const emptyState = useMemo(() => getOrderEmptyState(activeTab, handleCreate), [activeTab, handleCreate])

  const handleExport = useCallback(() => {
    downloadOrderCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your order export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: OrderListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState((state) => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const gridItems = useMemo(() => mapOrderRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <AdminListingShell
      stickyPageHeader={
        <AdminListingStickyHeader
          title="Order Management"
          description="Track customer orders, service line items, vendor assignment, and billing totals."
          actions={
            <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
              <Button label="Create Order" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<OrderKpiRow orders={rows} />}
      tabs={[
        { value: 'all', label: 'All Orders' },
        { value: 'draft', label: 'Draft' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ]}
      tabValue={activeTab}
      onTabChange={(value) => handleTabChange(value as OrderListingTab)}
      toolbar={
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search by order number, company, contact, or status…"
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={(keys) =>
            listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
          }
        />
      }
      listingContent={
        viewMode === 'table' ? (
          <AdminListingTable
            columns={columns}
            data={listing.paginatedRows}
            filterSourceData={listing.filterSourceRows}
            rowKey="id"
            state={listing.tableState}
            onStateChange={listing.setTableState}
            columnFilters={listing.columnFilters}
            onColumnFiltersChange={listing.setColumnFilters}
            getCellValue={getOrderCellValue}
            onRowClick={(row) => goFromListing(`${ORDER_LISTING_PATH}/${row.id}`)}
            loading={loading}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <AdminListingGrid items={gridItems} onItemClick={(id) => goFromListing(`${ORDER_LISTING_PATH}/${id}`)} />
        )
      }
      footer={
        <Box sx={{ bgcolor: footerBg }}>
          <Pagination
            page={listing.tableState.page}
            pageSize={listing.tableState.pageSize}
            total={listing.total}
            onPage={(page) => listing.setTableState((state) => ({ ...state, page }))}
            onPageSize={(pageSize) => listing.setTableState((state) => ({ ...state, pageSize, page: 0 }))}
          />
        </Box>
      }
    />
  )
}
