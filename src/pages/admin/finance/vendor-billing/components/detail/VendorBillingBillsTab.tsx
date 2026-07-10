import { useCallback, useEffect, useMemo, useState } from 'react'

import { AdminListingTable } from '@/pages/admin/components/listing'

import { useToast } from '@/design-system/UIComponents'

import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'

import { isVendorBillOpen, vendorBillingService } from '@/shared/services/vendorBillingService'

import type { VendorBillingBill } from '@/shared/types/vendorBilling'

import {

  buildVendorBillColumns,

  type VendorBillRowAction,

} from '../columns/vendorBillingTabColumns'

import { getVendorBillCellValue, matchesVendorBillSearch } from '../../utils/vendorBillingListingUtils'

import { VendorBillDetailModal } from '../workspace/VendorBillDetailModal'

import {

  EditVendorBillModal,

  type EditVendorBillFormValue,

} from '../workspace/EditVendorBillModal'

import {

  VendorRecordPaymentModal,

  type VendorRecordPaymentModalValue,

} from '../workspace/VendorRecordPaymentModal'



interface VendorBillingBillsTabProps {

  vendorId: string

  onBillUpdated: () => void

  onBillFullyPaid?: () => void

}



const EMPTY_PAYMENT: VendorRecordPaymentModalValue = {

  payableAmount: '',

  paymentDate: new Date().toISOString().slice(0, 10),

  paymentMode: 'NEFT',

  transactionReference: '',

  tdsAmount: '',

  netPaidAmount: '',

}



const EMPTY_EDIT: EditVendorBillFormValue = {

  vendorInvoiceNumber: '',

  invoiceDate: '',

  dueDate: '',

  invoiceFileName: '',

  remarks: '',

}



export function VendorBillingBillsTab({

  vendorId,

  onBillUpdated,

  onBillFullyPaid,

}: VendorBillingBillsTabProps) {

  const { showToast } = useToast()

  const [rows, setRows] = useState<VendorBillingBill[]>([])

  const [viewBill, setViewBill] = useState<VendorBillingBill>()

  const [editBill, setEditBill] = useState<VendorBillingBill>()

  const [editOpen, setEditOpen] = useState(false)

  const [editValue, setEditValue] = useState<EditVendorBillFormValue>(EMPTY_EDIT)

  const [paymentBill, setPaymentBill] = useState<VendorBillingBill>()

  const [paymentOpen, setPaymentOpen] = useState(false)

  const [paymentValue, setPaymentValue] = useState<VendorRecordPaymentModalValue>(EMPTY_PAYMENT)



  const loadRows = useCallback(() => {

    setRows(vendorBillingService.listOpenBills(vendorId))

  }, [vendorId])



  useEffect(() => {

    loadRows()

  }, [loadRows])



  const listing = useCustomerListing({

    rows,

    getCellValue: getVendorBillCellValue,

    searchMatch: matchesVendorBillSearch,

    initialPageSize: 10,

  })



  const handleAction = useCallback(

    (action: VendorBillRowAction, billId: string) => {

      const bill = vendorBillingService.getBillById(billId)

      if (!bill) return



      if (action === 'view') {

        setViewBill(bill)

        return

      }

      if (action === 'edit') {

        setEditBill(bill)

        setEditValue({

          vendorInvoiceNumber: bill.vendorInvoiceNumber,

          invoiceDate: bill.invoiceDate,

          dueDate: bill.dueDate,

          invoiceFileName: bill.invoiceFileName ?? '',

          remarks: bill.remarks ?? '',

        })

        setEditOpen(true)

        return

      }

      if (action === 'record_payment') {

        const balance = bill.invoiceAmount - bill.paidAmount

        setPaymentBill(bill)

        setPaymentValue({

          ...EMPTY_PAYMENT,

          payableAmount: String(balance),

          netPaidAmount: String(balance),

          paymentDate: new Date().toISOString().slice(0, 10),

        })

        setPaymentOpen(true)

        return

      }

      if (action === 'download') {

        showToast({

          title: 'Download started',

          description: bill.invoiceFileName ?? bill.vendorInvoiceNumber,

          variant: 'success',

        })

      }

    },

    [showToast],

  )



  const columns = useMemo(() => buildVendorBillColumns({ onAction: handleAction }), [handleAction])



  const handleSaveEdit = useCallback(() => {

    if (!editBill) return

    const updated = vendorBillingService.updateVendorBill(editBill.id, editValue)

    if (!updated) {

      showToast({

        title: 'Unable to edit bill',

        description: 'Bills can only be edited before any payment is recorded.',

        variant: 'error',

      })

      return

    }

    showToast({

      title: 'Bill updated',

      description: updated.vendorInvoiceNumber,

      variant: 'success',

    })

    setEditOpen(false)

    setEditBill(undefined)

    loadRows()

    onBillUpdated()

  }, [editBill, editValue, showToast, loadRows, onBillUpdated])



  const handleRecordPayment = useCallback(() => {

    if (!paymentBill) return

    const amount = Number.parseFloat(paymentValue.payableAmount.replace(/,/g, '')) || 0

    const tdsAmount = Number.parseFloat(paymentValue.tdsAmount.replace(/,/g, '')) || 0

    const netAmount = Number.parseFloat(paymentValue.netPaidAmount.replace(/,/g, '')) || 0

    const payment = vendorBillingService.recordPayment({

      vendorBillId: paymentBill.id,

      amount,

      paymentDate: paymentValue.paymentDate,

      paymentMode: paymentValue.paymentMode,

      transactionReference: paymentValue.transactionReference,

      tdsAmount,

      netAmount,

    })

    if (!payment) {

      showToast({ title: 'Payment failed', description: 'Unable to record payment for this bill.', variant: 'error' })

      return

    }



    const updatedBill = vendorBillingService.getBillById(paymentBill.id)

    const fullyPaid = updatedBill ? !isVendorBillOpen(updatedBill) : false



    showToast({

      title: fullyPaid ? 'Payment recorded · bill settled' : 'Payment recorded',

      description: fullyPaid

        ? `${payment.vendorInvoiceNumber} moved to Payment History.`

        : payment.vendorInvoiceNumber,

      variant: 'success',

    })

    setPaymentOpen(false)

    setPaymentBill(undefined)

    loadRows()

    onBillUpdated()

    if (fullyPaid) {

      onBillFullyPaid?.()

    }

  }, [paymentBill, paymentValue, showToast, loadRows, onBillUpdated, onBillFullyPaid])



  return (

    <>

      <AdminListingTable

        columns={columns}

        data={listing.paginatedRows}

        filterSourceData={listing.filterSourceRows}

        rowKey="id"

        state={listing.tableState}

        onStateChange={listing.setTableState}

        columnFilters={listing.columnFilters}

        onColumnFiltersChange={listing.setColumnFilters}

        getCellValue={getVendorBillCellValue}

        enableColumnFilters={false}

        showPagination

        stickyHeader

        emptyTitle="No open vendor bills"

        emptyDescription="Unpaid and partially paid bills appear here. Fully paid bills move to Payment History."

      />

      <VendorBillDetailModal open={Boolean(viewBill)} bill={viewBill} onClose={() => setViewBill(undefined)} />

      <EditVendorBillModal

        open={editOpen}

        onClose={() => {

          setEditOpen(false)

          setEditBill(undefined)

        }}

        vendorInvoiceNumber={editBill?.vendorInvoiceNumber}

        invoiceAmount={editBill?.invoiceAmount}

        value={editValue}

        onChange={setEditValue}

        onSubmit={handleSaveEdit}

      />

      <VendorRecordPaymentModal

        open={paymentOpen}

        onClose={() => setPaymentOpen(false)}

        value={paymentValue}

        onChange={setPaymentValue}

        onSubmit={handleRecordPayment}

        vendorInvoiceNumber={paymentBill?.vendorInvoiceNumber}

      />

    </>

  )

}

