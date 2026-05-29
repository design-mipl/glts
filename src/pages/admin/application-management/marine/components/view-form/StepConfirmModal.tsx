import { Stack } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'

interface StepConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function StepConfirmModal({ open, onClose, onConfirm }: StepConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Step confirmation"
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
          <Button label="Go back" variant="outlined" color="secondary" onClick={onClose} />
          <Button label="Yes continue" variant="contained" onClick={onConfirm} />
        </Stack>
      }
    >
      Have you completed and verified this step in the external portal?
    </Modal>
  )
}
