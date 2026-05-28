import { Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { Button, Modal, useToast } from '@/design-system/UIComponents'

export interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { showToast } = useToast()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setCurrent('')
    setNext('')
    setConfirm('')
    setError(null)
    onClose()
  }

  const handleSubmit = () => {
    if (!current || !next || !confirm) {
      setError('All fields are required.')
      return
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    showToast({ title: 'Password updated', description: 'Your password has been changed successfully.', variant: 'success' })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change password"
      subtitle="Use a strong password you do not use elsewhere."
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update password
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <TextField
          label="Current password"
          type="password"
          size="small"
          fullWidth
          value={current}
          onChange={e => setCurrent(e.target.value)}
          error={Boolean(error && !current)}
        />
        <TextField
          label="New password"
          type="password"
          size="small"
          fullWidth
          value={next}
          onChange={e => setNext(e.target.value)}
        />
        <TextField
          label="Confirm new password"
          type="password"
          size="small"
          fullWidth
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          error={Boolean(error)}
          helperText={error ?? undefined}
        />
      </Stack>
    </Modal>
  )
}
