import { useEffect, useState } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import type { PersonalAccount } from '@/pages/customer/features/profile/types/accountWorkspace'
import { ApplyTextField, FieldLabel } from '@/pages/website/theme/applyFormControls'
import {
  applyFlow,
  applyFont,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website/theme/applyFlowTheme'
import { retailModalCloseBtnSx } from './retailAccountModalChrome'
import { retailInitials } from './useRetailAccountIdentity'

export interface RetailPersonalInfoModalProps {
  open: boolean
  onClose: () => void
  account: PersonalAccount
  onSave: (patch: Partial<PersonalAccount>) => void
}

/** Retail account profile editor — apply-flow modal chrome, not the portal drawer. */
export function RetailPersonalInfoModal({ open, onClose, account, onSave }: RetailPersonalInfoModalProps) {
  const [form, setForm] = useState({
    name: account.name,
    email: account.email,
    phone: account.phone,
  })

  useEffect(() => {
    if (open) {
      setForm({
        name: account.name,
        email: account.email,
        phone: account.phone,
      })
    }
  }, [open, account])

  const canSave = form.name.trim().length > 0 && form.email.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      hideCloseButton
      sx={{
        width: { xs: '100%', sm: 460 },
        maxHeight: { xs: '100%', sm: 'min(640px, 90vh)' },
        borderRadius: { xs: 0, sm: applyRadius.card },
        border: { xs: 'none', sm: `1px solid ${applyFlow.hairline}` },
        boxShadow: { xs: 'none', sm: '0 16px 48px rgba(15, 23, 42, 0.12)' },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: applyFlow.surface,
          px: { xs: 4, sm: 5 },
          py: { xs: 4, sm: 4.5 },
        },
      }}
    >
      <Stack spacing={3.5} sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: applyFont.display,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: applyFlow.ink,
              }}
            >
              Edit profile
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13,
                color: applyFlow.inkMuted,
                mt: 1,
                lineHeight: 1.45,
              }}
            >
              Update how we reach you about your applications.
            </Typography>
          </Box>
          <Box component="button" type="button" aria-label="Close" onClick={onClose} sx={retailModalCloseBtnSx}>
            <X size={15} />
          </Box>
        </Stack>

        <Stack alignItems="center" spacing={1}>
          <Avatar
            src={account.profilePhotoUrl}
            sx={{
              width: 72,
              height: 72,
              bgcolor: applyFlow.accentSoft,
              color: applyFlow.accentInk,
              fontWeight: 800,
              fontSize: 24,
              fontFamily: applyFont.body,
            }}
          >
            {retailInitials(form.name || account.name)}
          </Avatar>
          <Typography sx={{ fontSize: 12, color: applyFlow.inkFaint }}>
            Photo changes from the card on your account page.
          </Typography>
        </Stack>

        <Stack spacing={2.75}>
          <Box>
            <FieldLabel htmlFor="retail-profile-name" required>
              Full name
            </FieldLabel>
            <ApplyTextField
              id="retail-profile-name"
              value={form.name}
              placeholder="As on your passport"
              onChange={name => setForm(f => ({ ...f, name }))}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="retail-profile-email" required>
              Email
            </FieldLabel>
            <ApplyTextField
              id="retail-profile-email"
              type="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={email => setForm(f => ({ ...f, email }))}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="retail-profile-phone">Contact number</FieldLabel>
            <ApplyTextField
              id="retail-profile-phone"
              type="tel"
              value={form.phone}
              placeholder="+91 98765 43210"
              onChange={phone => setForm(f => ({ ...f, phone }))}
            />
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.25} sx={{ pt: 0.5 }}>
          <Box
            component="button"
            type="button"
            onClick={onClose}
            sx={{ ...getQuietButtonSx(), flex: 1, minHeight: 44 }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            sx={{ ...getAccentButtonSx(), flex: 1, minHeight: 44, border: 'none' }}
          >
            Save changes
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
