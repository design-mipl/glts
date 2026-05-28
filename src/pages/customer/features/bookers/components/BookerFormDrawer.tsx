import { useState, useEffect } from 'react'
import { Stack, MenuItem, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material'
import { Button, Drawer } from '@/design-system/UIComponents'
import {
  BOOKER_PERMISSION_LABELS,
  type BookerPermissionKey,
  type BookerRecord,
} from '../data/bookerData'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

const ALL_PERMISSIONS = Object.keys(BOOKER_PERMISSION_LABELS) as BookerPermissionKey[]

const emptyBooker = {
  name: '',
  email: '',
  mobile: '',
  designation: '',
  role: 'Booker',
  permissions: ['dashboard', 'assignedOnly', 'documentUpload', 'tracking', 'support'] as BookerPermissionKey[],
}

export interface BookerFormDrawerProps {
  open: boolean
  onClose: () => void
  initial?: Partial<BookerRecord>
  onSave?: (data: typeof emptyBooker) => void
}

export function BookerFormDrawer({ open, onClose, initial, onSave }: BookerFormDrawerProps) {
  const colors = usePublicBrandColors()
  const [form, setForm] = useState({ ...emptyBooker })

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        mobile: initial?.mobile ?? '',
        designation: initial?.designation ?? '',
        role: initial?.role ?? 'Booker',
        permissions: initial?.permissions ?? emptyBooker.permissions,
      })
    }
  }, [open, initial])

  const togglePermission = (key: BookerPermissionKey) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key],
    }))
  }

  const handleSave = () => {
    onSave?.(form)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={initial?.name ? 'Edit booker' : 'Create booker'}
      width={480}
      footer={
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
            {initial?.name ? 'Save changes' : 'Activate booker'}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <TextField
          label="Full name"
          size="small"
          fullWidth
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <TextField
          label="Email"
          size="small"
          fullWidth
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <TextField
          label="Mobile number"
          size="small"
          fullWidth
          value={form.mobile}
          onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
        />
        <TextField
          label="Designation"
          size="small"
          fullWidth
          value={form.designation}
          onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
        />
        <TextField
          select
          label="Role"
          size="small"
          fullWidth
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
        >
          <MenuItem value="Booker">Booker</MenuItem>
          <MenuItem value="Senior booker">Senior booker</MenuItem>
        </TextField>

        <Typography sx={{ fontWeight: 700, fontSize: '13px', color: colors.navy, pt: 1 }}>
          Access permissions
        </Typography>
        {ALL_PERMISSIONS.map(key => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                size="small"
                checked={form.permissions.includes(key)}
                onChange={() => togglePermission(key)}
              />
            }
            label={
              <Typography sx={{ fontSize: '13px' }}>{BOOKER_PERMISSION_LABELS[key]}</Typography>
            }
          />
        ))}
      </Stack>
    </Drawer>
  )
}
