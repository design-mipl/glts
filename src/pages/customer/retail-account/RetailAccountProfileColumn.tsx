import { Box, Stack, Typography, Avatar } from '@mui/material'
import { Camera, LogOut } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button, useToast } from '@/design-system/UIComponents'
import { applyFlow, applyFont, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { loadSession, saveSession, clearSession } from '@/shared/auth/session'
import { useNavigate } from 'react-router-dom'
import { useProfileAccount } from '@/pages/customer/features/profile/hooks/useProfileAccount'
import { PersonalInfoDrawer } from '@/pages/customer/features/profile/components/PersonalInfoDrawer'
import { RetailStoredDocumentsPanel } from './RetailStoredDocumentsPanel'

function initials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function RetailAccountProfileColumn() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { workspace, updatePersonalAccount } = useProfileAccount()
  const session = loadSession()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const account = workspace.personal.account
  const displayName = session?.contactName || account.name
  const displayEmail = session?.email || account.email
  const displayPhone = session?.phone || account.phone
  const photoUrl = account.profilePhotoUrl

  const handleSave = (patch: Partial<typeof account>) => {
    updatePersonalAccount(patch)
    const current = loadSession()
    if (current?.portal === 'retail') {
      saveSession({
        ...current,
        contactName: patch.name ?? current.contactName,
        email: patch.email ?? current.email,
        phone: patch.phone ?? current.phone,
      })
    }
    showToast({ title: 'Profile updated', variant: 'success' })
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    updatePersonalAccount({ profilePhotoUrl: URL.createObjectURL(file) })
    showToast({ title: 'Photo updated', variant: 'success' })
  }

  const handleLogout = () => {
    clearSession()
    navigate('/sign-in', { replace: true })
  }

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          p: 3,
          borderRadius: applyRadius.card,
          bgcolor: applyFlow.surface,
          border: `1px solid ${applyFlow.hairline}`,
        }}
      >
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={photoUrl}
              sx={{
                width: 88,
                height: 88,
                bgcolor: applyFlow.accentSoft,
                color: applyFlow.accentInk,
                fontWeight: 800,
                fontSize: 28,
                fontFamily: applyFont.body,
              }}
            >
              {initials(displayName)}
            </Avatar>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
            <Box
              component="button"
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change photo"
              sx={{
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: `1px solid ${applyFlow.hairline}`,
                bgcolor: applyFlow.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                p: 0,
              }}
            >
              <Camera size={14} color={applyFlow.inkMuted} />
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontWeight: 800,
              fontSize: 20,
              color: applyFlow.ink,
              textAlign: 'center',
            }}
          >
            {displayName}
          </Typography>
        </Stack>

        <Stack spacing={1.25} sx={{ mb: 2.5 }}>
          <InfoRow label="Email" value={displayEmail} />
          <InfoRow label="Phone" value={displayPhone || '—'} />
          <InfoRow
            label="Signed in with"
            value={
              session?.authMethod === 'google'
                ? 'Google'
                : session?.authMethod === 'phone_otp'
                  ? 'Phone'
                  : '—'
            }
          />
        </Stack>

        <Stack spacing={1}>
          <Button variant="outlined" fullWidth onClick={() => setDrawerOpen(true)}>
            Edit profile
          </Button>
          <Button
            variant="text"
            fullWidth
            color="secondary"
            startIcon={<LogOut size={14} />}
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </Stack>
      </Box>

      <RetailStoredDocumentsPanel />

      <PersonalInfoDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        account={{
          ...account,
          name: displayName,
          email: displayEmail,
          phone: displayPhone || account.phone,
        }}
        onSave={handleSave}
      />
    </Stack>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: applyFlow.inkFaint,
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: applyFlow.ink, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  )
}
