import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Modal, Textarea } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'

interface FundAllocationClaimSheetRejectModalProps {
  open: boolean
  sheet: GroundOpsClaimSheet | null
  onClose: () => void
  onConfirm: (reason: string) => void
  loading?: boolean
}

export function FundAllocationClaimSheetRejectModal({
  open,
  sheet,
  onClose,
  onConfirm,
  loading = false,
}: FundAllocationClaimSheetRejectModalProps) {
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string>()

  useEffect(() => {
    if (!open) return
    setReason('')
    setReasonError(undefined)
  }, [open, sheet?.id])

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
        sheet
          ? `Reject ${sheet.claimNumber}. Ground Operations will see this reason and can edit and resubmit.`
          : 'Provide a reason for rejection.'
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
