import { Download, Eye, FileMinus2, PencilLine, Send, XCircle } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  invoiceStatusBadgeColor,
  invoiceStatusLabel,
  invoiceTypeColor,
  invoiceTypeLabel,
  paymentStatusBadgeColor,
  paymentStatusLabel,
} from '../config/invoiceStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: Invoice) => void
  onEditDraft: (row: Invoice) => void
  onShare: (row: Invoice) => void
  onDownload: (row: Invoice) => void
  onCreditNote: (row: Invoice) => void
  onCancel: (row: Invoice) => void
}

export function buildInvoiceColumns({
  onOpenDetail,
  onEditDraft,
  onShare,
  onDownload,
  onCreditNote,
  onCancel,
}: ColumnHandlers): Column<Invoice>[] {
  return [
    { key: 'invoiceId', label: 'Invoice ID', sortable: true, searchable: true, hideable: false, minWidth: 130 },
    {
      key: 'invoiceType',
      label: 'Invoice Type',
      filterable: true,
      minWidth: 140,
      render: (_, row) => <Badge label={invoiceTypeLabel[row.invoiceType]} color={invoiceTypeColor[row.invoiceType]} size="sm" />,
    },
    { key: 'companyName', label: 'Company Name', sortable: true, searchable: true, minWidth: 180 },
    { key: 'billingEntity', label: 'Billing Entity', sortable: true, searchable: true, minWidth: 180 },
    { key: 'vessel', label: 'Vessel', sortable: true, searchable: true, minWidth: 140 },
    { key: 'gltsReference', label: 'GLTS Reference', searchable: true, minWidth: 160 },
    { key: 'batchId', label: 'Batch ID', searchable: true, minWidth: 150 },
    { key: 'totalApplications', label: 'Total Applications', sortable: true, align: 'right', width: 120 },
    {
      key: 'baseAmount',
      label: 'Base Amount',
      sortable: true,
      align: 'right',
      minWidth: 110,
      render: (_, row) => formatInr(row.totals.subtotal),
    },
    {
      key: 'gst',
      label: 'GST',
      align: 'right',
      minWidth: 90,
      render: (_, row) => formatInr(row.totals.gstTotal),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      sortable: true,
      align: 'right',
      minWidth: 120,
      render: (_, row) => formatInr(row.totals.finalAmount),
    },
    {
      key: 'invoiceStatus',
      label: 'Invoice Status',
      filterable: true,
      minWidth: 130,
      render: (_, row) => (
        <Badge label={invoiceStatusLabel[row.invoiceStatus]} color={invoiceStatusBadgeColor(row.invoiceStatus)} size="sm" />
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      filterable: true,
      minWidth: 120,
      render: (_, row) => (
        <Badge label={paymentStatusLabel[row.paymentStatus]} color={paymentStatusBadgeColor(row.paymentStatus)} size="sm" />
      ),
    },
    { key: 'invoiceDate', label: 'Invoice Date', sortable: true, minWidth: 110 },
    { key: 'dueDate', label: 'Due Date', sortable: true, minWidth: 110 },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => new Date(row.lastUpdated).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
        ]
        if (row.invoiceStatus === 'draft') {
          actions.push({ label: 'Edit draft', icon: <PencilLine size={14} />, onClick: () => onEditDraft(row) })
        }
        if (row.invoiceStatus !== 'cancelled' && row.invoiceStatus !== 'draft') {
          actions.push({ label: 'Share', icon: <Send size={14} />, onClick: () => onShare(row) })
          actions.push({ label: 'Download PDF', icon: <Download size={14} />, onClick: () => onDownload(row) })
        }
        if (row.invoiceType !== 'credit_note' && row.invoiceStatus !== 'cancelled') {
          actions.push({ label: 'Create credit note', icon: <FileMinus2 size={14} />, onClick: () => onCreditNote(row) })
        }
        if (row.invoiceStatus !== 'cancelled' && row.invoiceStatus !== 'paid') {
          actions.push({ label: 'Cancel', icon: <XCircle size={14} />, onClick: () => onCancel(row) })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
