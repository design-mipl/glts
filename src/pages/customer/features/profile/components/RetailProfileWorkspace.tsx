import { useMemo, useRef, useState } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { Camera } from 'lucide-react'
import { Button, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { loadSession, saveSession } from '@/shared/auth/session'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { CustomerDetailWorkspace } from '@/pages/customer/features/shared/components/detail'
import { CustomerInfoGrid } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { useProfileAccount } from '../hooks/useProfileAccount'
import { PersonalInfoDrawer } from './PersonalInfoDrawer'
import { StoredDocumentsSection } from './StoredDocumentsSection'

function initials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Retail customer account — profile identity + stored documents (no B2B company tabs). */
export function RetailProfileWorkspace() {
  const colors = usePublicBrandColors()
  const { contactName, session } = useCustomerPortalBase()
  const { workspace, updatePersonalAccount } = useProfileAccount()
  const { showToast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const account = workspace.personal.account
  const displayName = session?.contactName || account.name || contactName
  const displayEmail = session?.email || account.email
  const displayPhone = session?.phone || account.phone
  const photoUrl = account.profilePhotoUrl

  const headerMeta = useMemo(
    () => (
      <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
        {displayEmail}
        {displayPhone ? ` · ${displayPhone}` : ''}
      </Typography>
    ),
    [colors.textSecondary, displayEmail, displayPhone],
  )

  const handleSavePersonal = (patch: Partial<typeof account>) => {
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
    showToast({ title: 'Profile updated', description: 'Your account details were saved.', variant: 'success' })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updatePersonalAccount({ profilePhotoUrl: url })
    showToast({ title: 'Photo updated', variant: 'success' })
  }

  return (
    <CustomerDetailWorkspace
      header={{
        title: displayName,
        subtitle: 'Your customer account',
        meta: headerMeta,
        actions: (
          <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
            Edit profile
          </Button>
        ),
      }}
    >
      <CustomerDetailSection title="Profile">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={photoUrl}
              sx={{
                width: 80,
                height: 80,
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              {initials(displayName)}
            </Avatar>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            <Button
              variant="outlined"
              size="sm"
              startIcon={<Camera size={14} />}
              onClick={() => fileRef.current?.click()}
              sx={{ mt: 1 }}
            >
              Change photo
            </Button>
          </Box>
          <CustomerInfoGrid
            items={[
              { label: 'Name', value: displayName },
              { label: 'Email', value: displayEmail },
              { label: 'Phone', value: displayPhone || '—' },
              {
                label: 'Sign-in method',
                value:
                  session?.authMethod === 'google'
                    ? 'Google'
                    : session?.authMethod === 'phone_otp'
                      ? 'Phone + OTP'
                      : '—',
              },
            ]}
          />
        </Stack>
      </CustomerDetailSection>

      <StoredDocumentsSection />

      <PersonalInfoDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        account={{ ...account, name: displayName, email: displayEmail, phone: displayPhone || account.phone }}
        onSave={handleSavePersonal}
      />
    </CustomerDetailWorkspace>
  )
}
