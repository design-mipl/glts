import { ConfirmDialog } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { DocumentMaster } from '@/shared/types/documentMaster'

interface DocumentDeleteDialogProps {
  open: boolean
  document: DocumentMaster | null
  loading?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export function DocumentDeleteDialog({
  open,
  document,
  loading = false,
  onClose,
  onConfirm,
}: DocumentDeleteDialogProps) {
  if (!document) return null

  const inUse = documentMasterService.isDocumentInUse(document.id)
  const usageCount = documentMasterService.getUsageCount(document.id)

  const description = inUse
    ? `This document is referenced in ${usageCount} country checklist${usageCount === 1 ? '' : 's'} and cannot be deleted. Deactivate it instead if it should no longer be used.`
    : `Permanently delete "${document.documentType}" (${document.id})? This action cannot be undone.`

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={inUse ? onClose : onConfirm}
      title={inUse ? 'Cannot delete document' : 'Delete document?'}
      description={description}
      confirmLabel={inUse ? 'Got it' : 'Delete'}
      cancelLabel="Cancel"
      variant={inUse ? 'default' : 'destructive'}
      loading={loading}
    />
  )
}
