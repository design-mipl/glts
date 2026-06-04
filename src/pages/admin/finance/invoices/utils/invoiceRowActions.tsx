import {
  Banknote,
  Download,
  Eye,
  FileMinus2,
  FilePlus2,
  FileStack,
  PencilLine,
  Receipt,
  Send,
  Trash2,
} from 'lucide-react'
import type { RowAction } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'

export interface InvoiceRowActionHandlers {
  onOpenDetail: (row: Invoice) => void
  onEditDraft: (row: Invoice) => void
  onSubmitDraft: (row: Invoice) => void
  onDeleteDraft: (row: Invoice) => void
  onShare: (row: Invoice) => void
  onDownload: (row: Invoice) => void
  onDownloadReceipt: (row: Invoice) => void
  onRecordPayment: (row: Invoice) => void
  onSecondaryInvoice: (row: Invoice) => void
  onCreditNote: (row: Invoice) => void
  onDebitNote: (row: Invoice) => void
  onSendReminder: (row: Invoice) => void
}

function billingAdjustmentActions(row: Invoice, handlers: InvoiceRowActionHandlers): RowAction[] {
  return [
    { label: 'Record payment', icon: <Banknote size={14} />, onClick: () => handlers.onRecordPayment(row) },
    { label: 'Add secondary invoice', icon: <FileStack size={14} />, onClick: () => handlers.onSecondaryInvoice(row) },
    { label: 'Create credit note', icon: <FileMinus2 size={14} />, onClick: () => handlers.onCreditNote(row) },
    { label: 'Create debit note', icon: <FilePlus2 size={14} />, onClick: () => handlers.onDebitNote(row) },
  ]
}

export function buildInvoiceRowActions(row: Invoice, handlers: InvoiceRowActionHandlers): RowAction[] {
  if (row.invoiceType === 'credit_note' || row.invoiceType === 'debit_note') {
    return [
      { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
      { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
    ]
  }

  if (row.invoiceStatus === 'draft') {
    return [
      { label: 'Edit draft', icon: <PencilLine size={14} />, onClick: () => handlers.onEditDraft(row) },
      { label: 'Submit invoice', icon: <Send size={14} />, onClick: () => handlers.onSubmitDraft(row) },
      { label: 'Delete draft', icon: <Trash2 size={14} />, onClick: () => handlers.onDeleteDraft(row) },
    ]
  }

  if (row.invoiceStatus === 'overdue') {
    return [
      { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
      { label: 'Send reminder', icon: <Send size={14} />, onClick: () => handlers.onSendReminder(row) },
      { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
      { label: 'Share invoice', icon: <Send size={14} />, onClick: () => handlers.onShare(row) },
      ...billingAdjustmentActions(row, handlers),
    ]
  }

  if (row.invoiceStatus === 'paid') {
    return [
      { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
      { label: 'Download receipt', icon: <Receipt size={14} />, onClick: () => handlers.onDownloadReceipt(row) },
      { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
      {
        label: 'Add secondary invoice',
        icon: <FileStack size={14} />,
        onClick: () => handlers.onSecondaryInvoice(row),
      },
    ]
  }

  if (row.invoiceStatus === 'submitted' || row.invoiceStatus === 'shared' || row.invoiceStatus === 'partially_paid') {
    return [
      { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
      { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
      { label: 'Share invoice', icon: <Send size={14} />, onClick: () => handlers.onShare(row) },
      ...billingAdjustmentActions(row, handlers),
    ]
  }

  return [
    { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
    { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
  ]
}
