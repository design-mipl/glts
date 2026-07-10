import { useEffect, useState } from 'react'
import { FormField, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import type { AgreementHoldTerminateStatus } from '@/shared/types/commercialAgreement'
import { AGREEMENT_HOLD_TERMINATE_OPTIONS } from '../config/agreementStatusConfig'

interface AgreementStatusUpdateDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (status: AgreementHoldTerminateStatus, remarks: string) => void
  loading?: boolean
}

export function AgreementStatusUpdateDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
}: AgreementStatusUpdateDialogProps) {
  const [status, setStatus] = useState<AgreementHoldTerminateStatus>('on_hold')
  const [remarks, setRemarks] = useState('')
  const [remarksError, setRemarksError] = useState<string>()

  useEffect(() => {
    if (!open) return
    setStatus('on_hold')
    setRemarks('')
    setRemarksError(undefined)
  }, [open])

  const handleConfirm = () => {
    const trimmed = remarks.trim()
    if (!trimmed) {
      setRemarksError('Remarks are required for audit and record-keeping')
      return
    }
    onConfirm(status, trimmed)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update agreement status"
      subtitle="Set the agreement to On hold or Terminated. Remarks are mandatory."
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={onClose}
          onSave={handleConfirm}
          saveLabel="Update status"
        />
      }
    >
      <FormField label="New status" required>
        <Select
          value={status}
          onChange={(v) => setStatus(v as AgreementHoldTerminateStatus)}
          options={AGREEMENT_HOLD_TERMINATE_OPTIONS}
          fullWidth
        />
      </FormField>
      <FormField label="Remarks" required error={Boolean(remarksError)} helperText={remarksError}>
        <Textarea
          value={remarks}
          onChange={(v) => {
            setRemarks(v)
            if (v.trim()) setRemarksError(undefined)
          }}
          placeholder="Enter reason for this status change"
          rows={4}
          fullWidth
        />
      </FormField>
    </Modal>
  )
}
