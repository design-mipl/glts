import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'

interface QuotationApprovalModalProps {
  open: boolean
  mode: 'reject'
  onClose: () => void
  onConfirm: (remarks: string) => void
}

export function QuotationApprovalModal({ open, mode, onClose, onConfirm }: QuotationApprovalModalProps) {
  const [remarks, setRemarks] = useState('')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'reject' ? 'Reject Quotation' : 'Approve Quotation'}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label={mode === 'reject' ? 'Reject' : 'Approve'}
            color={mode === 'reject' ? 'error' : undefined}
            onClick={() => {
              onConfirm(remarks)
              setRemarks('')
            }}
          />
        </Stack>
      }
    >
      <FormField label="Remarks">
        <Input
          value={remarks}
          onChange={setRemarks}
          placeholder={mode === 'reject' ? 'Reason for rejection' : 'Optional approval notes'}
          fullWidth
        />
      </FormField>
      {mode === 'reject' ? (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Create a new pricing version after rejection to revise commercial terms.
        </Typography>
      ) : null}
    </Modal>
  )
}
