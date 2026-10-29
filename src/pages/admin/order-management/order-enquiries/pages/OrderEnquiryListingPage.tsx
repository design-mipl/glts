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
import { orderEnquiryService } from '@/shared/services/orderEnquiryService'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { OrderEnquiryKpiRow } from '../components/OrderEnquiryKpiRow'
import { buildOrderEnquiryColumns } from '../components/OrderEnquiryTableColumns'
import { orderCreateFromEnquiryHref } from '../utils/orderEnquiryNavigation'
import {
  downloadOrderEnquiryCsv,
  filterOrderEnquiryRowsByTab,
  getOrderEnquiryCellValue,
  getOrderEnquiryEmptyState,
  mapOrderEnquiryRowsToGridItems,
  matchesOrderEnquirySearch,
  type OrderEnquiryListingTab,
} from '../utils/orderEnquiryListingUtils'

const LISTING_PATH = '/admin/order-management/order-enquiries'
const TAB_VALUES: readonly OrderEnquiryListingTab[] = ['all', 'new', 'website', 'in_review', 'converted']

export function OrderEnquiryListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<OrderEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useListingTabParam(TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)

  const goFromListing = useCallback(
    (to: string) => navigateFromListing(navigate, to, listingReturnHref),
    [listingReturnHref, navigate],
  )

  const loadRows = async () => {
    setLoading(true)
    const data = await orderEnquiryService.getEnquiries()
    setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    void loadRows()
  }, [])

  const handleConvert = useCallback(
    (row: OrderEnquiry) => {
      goFromListing(orderCreateFromEnquiryHref(row.id))
    },
    [goFromListing],
  )

  const columns = useMemo(
    () =>
      buildOrderEnquiryColumns({
        onOpenDetail: (row) => goFromListing(`${LISTING_PATH}/${row.id}`),
        onOpenEdit: (row) => goFromListing(`${LISTING_PATH}/${row.id}/edit`),
        onConvert: (row) => void handleConvert(row),
      }),
    [goFromListing, handleConvert],
  )

  const tabFilteredRows = useMemo(() => filterOrderEnquiryRowsByTab(rows, activeTab), [rows, activeTab])

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: getOrderEnquiryCellValue,
    searchMatch: matchesOrderEnquirySearch,
    initialPageSize: 10,
  })

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    goFromListing(`${LISTING_PATH}/new`)
  }, [goFromListing])

  const emptyState = useMemo(() => getOrderEnquiryEmptyState(activeTab, handleCreate), [activeTab, handleCreate])

  const handleExport = useCallback(() => {
    downloadOrderEnquiryCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your order enquiry export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: OrderEnquiryListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState((state) => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const gridItems = useMemo(() => mapOrderEnquiryRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <AdminListingShell
      stickyPageHeader={
        <AdminListingStickyHeader
          title="Order Enquiries"
          description="Website and manual extra-service requests — attestation, notary, and travel insurance."
          actions={
            <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
              <Button label="Create Enquiry" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<OrderEnquiryKpiRow enquiries={rows} />}
      tabs={[
        { value: 'all', label: 'All' },
        { value: 'new', label: 'New' },
        { value: 'website', label: 'Website' },
        { value: 'in_review', label: 'In Review' },
        { value: 'converted', label: 'Converted' },
      ]}
      tabValue={activeTab}
      onTabChange={(value) => handleTabChange(value as OrderEnquiryListingTab)}
      toolbar={
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search by enquiry number, company, contact, or service…"
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
            getCellValue={getOrderEnquiryCellValue}
            onRowClick={(row) => goFromListing(`${LISTING_PATH}/${row.id}`)}
            loading={loading}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <AdminListingGrid items={gridItems} onItemClick={(id) => goFromListing(`${LISTING_PATH}/${id}`)} />
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
