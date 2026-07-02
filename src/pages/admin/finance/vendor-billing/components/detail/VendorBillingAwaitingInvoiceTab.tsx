import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { FilePlus2 } from 'lucide-react'
import { useToast } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { vendorBillingService } from '@/shared/services/vendorBillingService'
import type { VendorCharge } from '@/shared/types/vendorBilling'
import { buildAwaitingInvoiceColumns } from '../columns/vendorBillingTabColumns'
import {
  getAwaitingInvoiceCellValue,
  matchesAwaitingInvoiceSearch,
} from '../../utils/vendorBillingListingUtils'
import {
  CreateVendorBillModal,
  type CreateVendorBillFormValue,
} from '../workspace/CreateVendorBillModal'

const EMPTY_FORM: CreateVendorBillFormValue = {
  vendorInvoiceNumber: '',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  invoiceFileName: '',
  remarks: '',
}

interface VendorBillingAwaitingInvoiceTabProps {
  vendorId: string
  vendorName: string
  onBillCreated: () => void
  onSelectionChange?: (selectedIds: string[]) => void
}

export interface VendorBillingAwaitingInvoiceTabHandle {
  openCreateModal: () => void
}

export const VendorBillingAwaitingInvoiceTab = forwardRef<
  VendorBillingAwaitingInvoiceTabHandle,
  VendorBillingAwaitingInvoiceTabProps
>(function VendorBillingAwaitingInvoiceTab(
  { vendorId, vendorName, onBillCreated, onSelectionChange },
  ref,
) {
  const { showToast } = useToast()
  const [rows, setRows] = useState<VendorCharge[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [formValue, setFormValue] = useState<CreateVendorBillFormValue>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const loadRows = useCallback(() => {
    setRows(vendorBillingService.listCharges(vendorId, 'awaiting_invoice'))
  }, [vendorId])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getAwaitingInvoiceCellValue,
    searchMatch: matchesAwaitingInvoiceSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(() => buildAwaitingInvoiceColumns(), [])
  const selectedChargeIds = listing.tableState.selectedRows
  const selectedCharges = rows.filter(r => selectedChargeIds.includes(r.id))
  const selectedAmount = selectedCharges.reduce((sum, c) => sum + c.amount, 0)

  useEffect(() => {
    onSelectionChange?.(selectedChargeIds)
  }, [onSelectionChange, selectedChargeIds])

  const openCreateModal = useCallback(() => {
    if (selectedChargeIds.length === 0) {
      showToast({ title: 'Select charges', description: 'Select at least one charge to create a vendor bill.', variant: 'warning' })
      return
    }
    setFormValue({
      ...EMPTY_FORM,
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    })
    setModalOpen(true)
  }, [selectedChargeIds.length, showToast])

  useImperativeHandle(ref, () => ({ openCreateModal }), [openCreateModal])

  const handleSaveBill = useCallback(() => {
    setSaving(true)
    const bill = vendorBillingService.createVendorBill({
      vendorId,
      chargeIds: selectedChargeIds,
      vendorInvoiceNumber: formValue.vendorInvoiceNumber,
      invoiceDate: formValue.invoiceDate,
      dueDate: formValue.dueDate,
      invoiceFileName: formValue.invoiceFileName || undefined,
      remarks: formValue.remarks || undefined,
    })
    setSaving(false)
    if (!bill) {
      showToast({ title: 'Unable to create bill', description: 'Selected charges may no longer be available.', variant: 'error' })
      return
    }
    showToast({ title: 'Vendor bill created', description: `${bill.vendorInvoiceNumber} is ready for payment updates.`, variant: 'success' })
    setModalOpen(false)
    listing.setTableState(state => ({ ...state, selectedRows: [] }))
    loadRows()
    onBillCreated()
  }, [vendorId, selectedChargeIds, formValue, showToast, listing, loadRows, onBillCreated])

  const bulkActions = useMemo(
    () => [{ label: 'Create vendor bill', icon: <FilePlus2 size={14} />, onClick: openCreateModal }],
    [openCreateModal],
  )

  return (
    <Stack spacing={2}>
      <AdminListingTable
        columns={columns}
        data={listing.paginatedRows}
        filterSourceData={listing.filterSourceRows}
        rowKey="id"
        state={listing.tableState}
        onStateChange={listing.setTableState}
        columnFilters={listing.columnFilters}
        onColumnFiltersChange={listing.setColumnFilters}
        getCellValue={getAwaitingInvoiceCellValue}
        bulkActions={bulkActions}
        enableColumnFilters={false}
        showPagination
        stickyHeader
        emptyTitle="No charges awaiting invoice"
        emptyDescription="Completed vendor charges that are not yet included in a vendor bill will appear here."
      />
      <CreateVendorBillModal
        open={modalOpen}
        vendorName={vendorName}
        selectedCount={selectedChargeIds.length}
        selectedAmount={selectedAmount}
        value={formValue}
        onChange={setFormValue}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveBill}
        loading={saving}
      />
    </Stack>
  )
})

