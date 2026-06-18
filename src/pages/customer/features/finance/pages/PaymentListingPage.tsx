import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import { buildPaymentListingColumns } from '../components/payments/paymentListingColumns'
import { getPaymentListingCellValue, paymentListingSearchMatch } from '../utils/financeListingUtils'
import type { CustomerPaymentRow } from '../types/customerFinance.types'
import type { Column } from '@/design-system/UIComponents'

export function PaymentListingPage() {
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const rows = useMemo(() => customerFinanceService.listSessionPayments(), [])

  const listing = useCustomerListing({
    rows,
    getCellValue: getPaymentListingCellValue,
    searchMatch: paymentListingSearchMatch,
  })

  const columnParams = useMemo(() => ({ base, navigate, showToast }), [base, navigate, showToast])

  const columns = useMemo(
    () => buildPaymentListingColumns(columnParams) as Column<CustomerPaymentRow>[],
    [columnParams],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label })),
    [columns],
  )

  const handleRowClick = useCallback(
    (row: CustomerPaymentRow) => navigate(`${base}/finance/payments/${row.id}`),
    [base, navigate],
  )

  return (
    <CustomerListingShell
      title="Payment Management"
      subtitle="Track payments and receipts recorded against your company invoices."
      toolbar={
        <CustomerListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search payments…"
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
        />
      }
      table={
        <CustomerListingTable<CustomerPaymentRow>
          columns={columns}
          data={listing.paginatedRows}
          filterSourceData={listing.filterSourceRows}
          rowKey="id"
          state={listing.tableState}
          onStateChange={listing.setTableState}
          columnFilters={listing.columnFilters}
          onColumnFiltersChange={listing.setColumnFilters}
          getCellValue={getPaymentListingCellValue}
          onRowClick={handleRowClick}
          stickyHeader
          emptyTitle="No payments found"
          emptyDescription="Payments recorded by the GLTS Accounts Team will appear here."
        />
      }
      pagination={
        <CustomerListingPagination
          page={listing.tableState.page}
          pageSize={listing.tableState.pageSize}
          total={listing.total}
          onPage={page => listing.setTableState(s => ({ ...s, page }))}
          onPageSize={pageSize => listing.setTableState(s => ({ ...s, pageSize, page: 0 }))}
        />
      }
    />
  )
}
