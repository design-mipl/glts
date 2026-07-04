import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { vendorBillingService } from '@/shared/services/vendorBillingService'
import type { VendorBillingPayment } from '@/shared/types/vendorBilling'
import { buildVendorPaymentColumns } from '../columns/vendorBillingTabColumns'
import { getVendorPaymentCellValue, matchesVendorPaymentSearch } from '../../utils/vendorBillingListingUtils'

interface VendorBillingPaymentsTabProps {
  vendorId: string
}

export function VendorBillingPaymentsTab({ vendorId }: VendorBillingPaymentsTabProps) {
  const [rows, setRows] = useState<VendorBillingPayment[]>([])

  const loadRows = useCallback(() => {
    setRows(vendorBillingService.listPayments(vendorId))
  }, [vendorId])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getVendorPaymentCellValue,
    searchMatch: matchesVendorPaymentSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(() => buildVendorPaymentColumns(), [])

  return (
    <AdminListingTable
      columns={columns}
      data={listing.paginatedRows}
      filterSourceData={listing.filterSourceRows}
      rowKey="id"
      state={listing.tableState}
      onStateChange={listing.setTableState}
      columnFilters={listing.columnFilters}
      onColumnFiltersChange={listing.setColumnFilters}
      getCellValue={getVendorPaymentCellValue}
      enableColumnFilters={false}
      showPagination
      stickyHeader
      emptyTitle="No payments recorded"
      emptyDescription="Payments recorded against vendor bills will appear here."
    />
  )
}
