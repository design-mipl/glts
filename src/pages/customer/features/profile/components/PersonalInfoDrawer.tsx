import { Avatar, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Button, Drawer } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { PersonalAccount } from '../types/accountWorkspace'

export interface PersonalInfoDrawerProps {
  open: boolean
  onClose: () => void
  account: PersonalAccount
  onSave: (patch: Partial<PersonalAccount>) => void
}

export function PersonalInfoDrawer({ open, onClose, account, onSave }: PersonalInfoDrawerProps) {
  const colors = usePublicBrandColors()
  const [form, setForm] = useState({
    name: account.name,
    designation: account.designation,
    email: account.email,
    phone: account.phone,
  })

  useEffect(() => {
    if (open) {
      setForm({
        name: account.name,
        designation: account.designation,
        email: account.email,
        phone: account.phone,
      })
    }
  }, [open, account])

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit personal information"
      width={480}
      footer={
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
            Save changes
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2.5} alignItems="center">
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: colors.greenMuted,
            color: colors.greenDark,
            fontWeight: 800,
            fontSize: 24,
          }}
        >
          {form.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </Avatar>
        <TextField label="Full name" size="small" fullWidth value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <TextField
          label="Designation"
          size="small"
          fullWidth
          value={form.designation}
          disabled={!account.canEditDesignation}
          onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
          helperText={!account.canEditDesignation ? 'Contact your corporate admin to update designation.' : undefined}
        />
        <TextField label="Email" size="small" fullWidth type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <TextField label="Contact number" size="small" fullWidth value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </Stack>
    </Drawer>
  )
}
