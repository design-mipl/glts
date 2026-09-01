import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Modal, Textarea } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { ReconciliationPaymentEntryRow } from '@/shared/types/reconciliation'

interface ReconciliationPaymentEntryRejectModalProps {
  open: boolean
  row: ReconciliationPaymentEntryRow | null
  onClose: () => void
  onConfirm: (reason: string) => void
  loading?: boolean
}

export function ReconciliationPaymentEntryRejectModal({
  open,
  row,
  onClose,
  onConfirm,
  loading = false,
}: ReconciliationPaymentEntryRejectModalProps) {
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
      setReasonError('Rejection reason is required so operations can review the payment')
      return
    }
    onConfirm(trimmed)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reject payment entry"
      subtitle={
        row
          ? `Reject payment for ${row.passengerName} (${row.refNo}). It will show as Rejected in reconciliation.`
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
          placeholder="e.g. Payment reference does not match bank statement"
          rows={4}
          fullWidth
        />
      </FormField>
    </Modal>
  )
}
