import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Modal, Textarea } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { ReconciliationItem } from '@/shared/types/reconciliation'

interface ReconciliationRejectModalProps {
  open: boolean
  item: ReconciliationItem | null
  onClose: () => void
  onConfirm: (reason: string) => void
  loading?: boolean
}

export function ReconciliationRejectModal({
  open,
  item,
  onClose,
  onConfirm,
  loading = false,
}: ReconciliationRejectModalProps) {
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string>()

  useEffect(() => {
    if (!open) return
    setReason('')
    setReasonError(undefined)
  }, [open, item?.id])

  const isClaimSheet = item?.tab === 'approved_claim_sheet'
  const title = isClaimSheet ? 'Reject claim sheet' : 'Reject reconciliation'
  const subtitle = isClaimSheet
    ? `Reject ${item?.claimNumber || item?.refNo || 'this claim'}. It will show as Rejected on claim sheet listings so Ground Operations can revise and resubmit.`
    : `Reject ${item?.refNo || 'this record'}. The linked expense will be marked rejected with this reason.`

  const handleConfirm = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setReasonError(
        isClaimSheet
          ? 'Rejection reason is required so Ground Operations can revise the claim'
          : 'Rejection reason is required',
      )
      return
    }
    onConfirm(trimmed)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
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
          placeholder={
            isClaimSheet
              ? 'e.g. Missing GST invoice for express courier upgrade'
              : 'e.g. Amount does not match vendor statement'
          }
          rows={4}
          fullWidth
        />
      </FormField>
    </Modal>
  )
}
