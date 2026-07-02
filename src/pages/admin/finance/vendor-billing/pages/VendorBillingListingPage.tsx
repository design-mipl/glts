import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { vendorBillingService } from '@/shared/services/vendorBillingService'
import type { VendorBillingSummaryRow } from '@/shared/types/vendorBilling'
import { VendorBillingKpiRow } from '../components/VendorBillingKpiRow'
import { buildVendorBillingSummaryColumns } from '../components/VendorBillingSummaryColumns'
import { VENDOR_BILLING_BASE_PATH } from '../config/vendorBillingStatusConfig'
import {
  computeVendorBillingKpis,
  downloadVendorBillingSummaryCsv,
  getVendorBillingSummaryCellValue,
  mapVendorBillingSummaryToGridItems,
  matchesVendorBillingSummarySearch,
} from '../utils/vendorBillingListingUtils'

export function VendorBillingListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<VendorBillingSummaryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(vendorBillingService.listVendorSummaries())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getVendorBillingSummaryCellValue,
    searchMatch: matchesVendorBillingSummarySearch,
    initialPageSize: 10,
  })

  const kpis = useMemo(() => computeVendorBillingKpis(rows), [rows])
  const columns = useMemo(
    () =>
      buildVendorBillingSummaryColumns({
        onOpenDetail: row => navigate(`${VENDOR_BILLING_BASE_PATH}/${row.id}`),
      }),
    [navigate],
  )
  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )
  const gridItems = useMemo(() => mapVendorBillingSummaryToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const handleExport = useCallback(() => {
    downloadVendorBillingSummaryCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your vendor billing summary export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <AdminListingShell
      stickyPageHeader={
        <AdminListingStickyHeader
          title="Vendor billing"
          description="Vendor-first view of charges awaiting invoice, bills, payments, and ledger balances."
        />
      }
      kpis={
        <VendorBillingKpiRow
          totalVendors={kpis.totalVendors}
          awaitingInvoiceTotal={kpis.awaitingInvoiceTotal}
          totalOutstanding={kpis.totalOutstanding}
          vendorsWithOutstanding={kpis.vendorsWithOutstanding}
        />
      }
      toolbar={
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search vendor name or vendor ID…"
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={keys =>
            listing.setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
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
            getCellValue={getVendorBillingSummaryCellValue}
            onRowClick={row => navigate(`${VENDOR_BILLING_BASE_PATH}/${row.id}`)}
            loading={loading}
            stickyHeader
            emptyTitle="No vendors found"
            emptyDescription="Vendor billing summaries will appear once vendors have charges or bills."
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            onItemClick={id => navigate(`${VENDOR_BILLING_BASE_PATH}/${id}`)}
          />
        )
      }
      footer={
        <Box sx={{ px: 2, py: 1.5, bgcolor: footerBg, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination
            page={listing.tableState.page}
            pageSize={listing.tableState.pageSize}
            total={listing.filterSourceRows.length}
            onPage={page => listing.setTableState(state => ({ ...state, page }))}
            onPageSize={pageSize =>
              listing.setTableState(state => ({ ...state, pageSize, page: 0 }))
            }
          />
        </Box>
      }
    />
  )
}
