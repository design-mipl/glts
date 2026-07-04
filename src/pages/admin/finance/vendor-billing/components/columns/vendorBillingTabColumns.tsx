import { Banknote, Download, Eye, Pencil } from 'lucide-react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { isVendorBillEditable } from '@/shared/services/vendorBillingService'
import type { VendorBillingBill, VendorBillingPayment, VendorCharge } from '@/shared/types/vendorBilling'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getVendorBillDisplayStatus,
  getVendorPaymentDisplayStatus,
} from '../../config/vendorBillingStatusConfig'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

export function buildAwaitingInvoiceColumns(): Column<VendorCharge>[] {
  return [
    {
      key: 'applicationId',
      label: 'Application ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'companyName',
      label: 'Company',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
    },
    {
      key: 'applicantName',
      label: 'Applicant',
      widthSize: adminListingColumnWidthSize('assignee'),
    },
    {
      key: 'serviceName',
      label: 'Service',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: true,
    },
    {
      key: 'amount',
      label: 'Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.amount),
    },
    {
      key: 'completedAt',
      label: 'Completed',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDate(row.completedAt),
    },
    {
      key: 'billingStatus',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: () => <Badge label="Awaiting Invoice" color="warning" size="sm" />,
    },
  ]
}

export type VendorBillRowAction = 'view' | 'edit' | 'record_payment' | 'download'

export interface VendorBillColumnHandlers {
  onAction: (action: VendorBillRowAction, billId: string) => void
}

export function buildVendorBillColumns(handlers: VendorBillColumnHandlers): Column<VendorBillingBill>[] {
  return [
    {
      key: 'vendorInvoiceNumber',
      label: 'Vendor Invoice No.',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'invoiceDate',
      label: 'Invoice Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDate(row.invoiceDate),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDate(row.dueDate),
    },
    {
      key: 'invoiceAmount',
      label: 'Invoice Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.invoiceAmount),
    },
    {
      key: 'paidAmount',
      label: 'Paid',
      widthSize: 'md',
      align: 'right',
      render: (_, row) => formatInr(row.paidAmount),
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => {
        const display = getVendorBillDisplayStatus(row)
        return <Badge label={display.label} color={display.color} size="sm" />
      },
    },
    {
      key: 'actions',
      label: '',
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      render: (_, row) => {
        const actions = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => handlers.onAction('view', row.id) },
        ]
        if (isVendorBillEditable(row)) {
          actions.push({
            label: 'Edit',
            icon: <Pencil size={14} />,
            onClick: () => handlers.onAction('edit', row.id),
          })
        }
        if (row.paymentStatus !== 'paid') {
          actions.push({
            label: 'Record payment',
            icon: <Banknote size={14} />,
            onClick: () => handlers.onAction('record_payment', row.id),
          })
        }
        if (row.invoiceFileName) {
          actions.push({
            label: 'Download invoice',
            icon: <Download size={14} />,
            onClick: () => handlers.onAction('download', row.id),
          })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}

export function buildVendorPaymentColumns(): Column<VendorBillingPayment>[] {
  return [
    {
      key: 'vendorInvoiceNumber',
      label: 'Vendor Invoice',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDate(row.paymentDate),
    },
    {
      key: 'amount',
      label: 'Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.amount),
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      widthSize: adminListingColumnWidthSize('status'),
    },
    {
      key: 'transactionReference',
      label: 'UTR / Reference',
      widthSize: adminListingColumnWidthSize('code'),
      searchable: true,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => {
        const display = getVendorPaymentDisplayStatus(row.status)
        return <Badge label={display.label} color={display.color} size="sm" />
      },
    },
  ]
}
