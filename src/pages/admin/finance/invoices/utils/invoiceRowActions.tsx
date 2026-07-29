import {
  Banknote,
  Download,
  Eye,
  FileMinus2,
  FilePlus2,
  FileStack,
  PencilLine,
  Send,
  Trash2,
  Ban,
} from 'lucide-react'
import type { RowAction } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import {
  canCreateCreditNote,
  canCreateRevisedInvoice,
  canCreateSecondaryInvoice,
  canModifyInvoice,
} from './invoiceCorrectionPolicy'

export interface InvoiceRowActionHandlers {
  onOpenDetail: (row: Invoice) => void
  onEditDraft: (row: Invoice) => void
  onSubmitDraft: (row: Invoice) => void
  onDeleteDraft: (row: Invoice) => void
  onShare: (row: Invoice) => void
  onDownload: (row: Invoice) => void
  onRecordPayment: (row: Invoice) => void
  onSecondaryInvoice: (row: Invoice) => void
  onCreditNote: (row: Invoice) => void
  onModify: (row: Invoice) => void
  onCancel: (row: Invoice) => void
  onCreateRevisedInvoice: (row: Invoice) => void
  onSendReminder: (row: Invoice) => void
}

export function buildInvoiceRowActions(row: Invoice, handlers: InvoiceRowActionHandlers): RowAction[] {
  if (row.invoiceType === 'credit_note') {
    const actions: RowAction[] = [
      { label: 'View credit note', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
      { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
    ]
    if (canCreateRevisedInvoice(row)) {
      actions.push({
        label: 'Create revised invoice',
        icon: <FilePlus2 size={14} />,
        onClick: () => handlers.onCreateRevisedInvoice(row),
      })
    }
    return actions
  }

  if (row.invoiceStatus === 'draft') {
    return [
      { label: 'Edit draft', icon: <PencilLine size={14} />, onClick: () => handlers.onEditDraft(row) },
      { label: 'Submit invoice', icon: <Send size={14} />, onClick: () => handlers.onSubmitDraft(row) },
      { label: 'Delete draft', icon: <Trash2 size={14} />, onClick: () => handlers.onDeleteDraft(row) },
    ]
  }

  if (row.invoiceStatus === 'cancelled') {
    const actions: RowAction[] = [
      { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
      { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
    ]
    if (canCreateRevisedInvoice(row)) {
      actions.push({
        label: 'Create revised invoice',
        icon: <FilePlus2 size={14} />,
        onClick: () => handlers.onCreateRevisedInvoice(row),
      })
    }
    return actions
  }

  const actions: RowAction[] = [
    { label: 'View invoice', icon: <Eye size={14} />, onClick: () => handlers.onOpenDetail(row) },
    { label: 'Download PDF', icon: <Download size={14} />, onClick: () => handlers.onDownload(row) },
  ]

  if (row.invoiceStatus !== 'paid') {
    actions.push({
      label: 'Share invoice',
      icon: <Send size={14} />,
      onClick: () => handlers.onShare(row),
    })
  }

  if (row.invoiceStatus === 'overdue') {
    actions.push({
      label: 'Send reminder',
      icon: <Send size={14} />,
      onClick: () => handlers.onSendReminder(row),
    })
  }

  if (
    row.invoiceStatus !== 'paid' &&
    row.invoiceStatus !== 'cancelled' &&
    row.invoiceType !== 'credit_note'
  ) {
    actions.push({
      label: 'Record payment',
      icon: <Banknote size={14} />,
      onClick: () => handlers.onRecordPayment(row),
    })
  }

  if (canModifyInvoice(row)) {
    actions.push({
      label: 'Modify invoice',
      icon: <PencilLine size={14} />,
      onClick: () => handlers.onModify(row),
    })
    actions.push({
      label: 'Cancel invoice',
      icon: <Ban size={14} />,
      onClick: () => handlers.onCancel(row),
    })
  }

  if (canCreateCreditNote(row)) {
    actions.push({
      label: 'Create credit note',
      icon: <FileMinus2 size={14} />,
      onClick: () => handlers.onCreditNote(row),
    })
  }

  if (canCreateSecondaryInvoice(row)) {
    actions.push({
      label: 'Add secondary invoice',
      icon: <FileStack size={14} />,
      onClick: () => handlers.onSecondaryInvoice(row),
    })
  }

  return actions
}
