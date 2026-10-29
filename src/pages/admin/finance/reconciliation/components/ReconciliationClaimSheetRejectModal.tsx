import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Modal, Textarea } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { ReconciliationClaimSheetRow } from '@/shared/types/reconciliation'

interface ReconciliationClaimSheetRejectModalProps {
  open: boolean
  row: ReconciliationClaimSheetRow | null
  onClose: () => void
  onConfirm: (reason: string) => void
  loading?: boolean
}

export function ReconciliationClaimSheetRejectModal({
  open,
  row,
  onClose,
  onConfirm,
  loading = false,
}: ReconciliationClaimSheetRejectModalProps) {
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string>()

  useEffect(() => {
    if (!open) return
    setReason('')
    setReasonError(undefined)
  }, [open, row?.id])

  const handleConfirm = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setReasonError('Rejection reason is required so Ground Operations can revise the claim')
      return
    }
    onConfirm(trimmed)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reject claim sheet"
      subtitle={
        row
          ? `Reject ${row.sheet.claimNumber}. It will show as Rejected so Ground Operations can revise and resubmit.`
          : undefined
      }
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={1} width="100%">
          <Button label="Cancel" variant="neutral" onClick={onClose} disabled={loading} />
          <Button
            label="Reject"
            variant="contained"
            color="error"
            onClick={handleConfirm}
            loading={loading}
          />
        </Stack>
      }
    >
      <FormField label="Rejection reason" required error={Boolean(reasonError)} helperText={reasonError}>
        <Textarea
          value={reason}
          onChange={value => {
            setReason(value)
            if (value.trim()) setReasonError(undefined)
          }}
          placeholder="e.g. Missing GST invoice for express courier upgrade"
          rows={4}
          fullWidth
        />
      </FormField>
    </Modal>
  )
}
