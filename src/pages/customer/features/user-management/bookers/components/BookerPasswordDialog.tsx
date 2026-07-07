import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import { Button, FormField, IconButton, Input, Modal } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import type { BookerUser } from '@/shared/types/bookerUser'
import { generateTemporaryPassword } from '@/shared/utils/corporateAccountValidation'

interface BookerPasswordDialogProps {
  open: boolean
  booker?: Pick<BookerUser, 'id' | 'fullName'>
  onClose: () => void
  onConfirm: (password: string) => void
  loading?: boolean
}

export function BookerPasswordDialog({
  open,
  booker,
  onClose,
  onConfirm,
  loading = false,
}: BookerPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string>()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!open) return
    setPassword('')
    setPasswordError(undefined)
    setShowPassword(false)
  }, [open, booker?.id])

  const handleGenerate = () => {
    const generated = generateTemporaryPassword()
    setPassword(generated)
    setPasswordError(undefined)
    setShowPassword(true)
  }

  const handleConfirm = () => {
    const trimmed = password.trim()
    if (trimmed.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    onConfirm(trimmed)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change password"
      subtitle={
        booker
          ? `Set a new portal password for ${booker.fullName}.`
          : 'Set a new portal password for this booker.'
      }
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={onClose}
          onSave={handleConfirm}
          saveLabel="Update password"
        />
      }
    >
      <FormField label="New password" required error={Boolean(passwordError)} helperText={passwordError}>
        <Input
          value={password}
          onChange={(v) => {
            setPassword(v)
            if (v.trim().length >= 8) setPasswordError(undefined)
          }}
          placeholder="Enter new password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          endAdornment={
            <IconButton
              size="sm"
              variant="default"
              tooltip={showPassword ? 'Hide password' : 'Show password'}
              icon={showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              onClick={() => setShowPassword((current) => !current)}
            />
          }
        />
      </FormField>
      <Stack direction="row" justifyContent="flex-start">
        <Button label="Generate temporary password" size="sm" variant="outlined" onClick={handleGenerate} />
      </Stack>
    </Modal>
  )
}
