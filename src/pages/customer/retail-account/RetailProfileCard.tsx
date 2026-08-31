import { Avatar, Box, Stack, Typography } from '@mui/material'
import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import { QuietButton } from './retailAccountButtons'
import { applyFlow, applyFont, applyRadius, focusRingSx } from '@/pages/website/theme/applyFlowTheme'
import { PersonalInfoDrawer } from '@/pages/customer/features/profile/components/PersonalInfoDrawer'
import { useRetailAccountIdentity, retailInitials } from './useRetailAccountIdentity'

/**
 * Profile lives permanently in the account rail rather than behind its own nav item —
 * it is identity, not a destination. Kept deliberately light: picture, name, contact,
 * one action. Sign out belongs in the header, not here.
 */
export function RetailProfileCard() {
  const { account, displayName, displayEmail, displayPhone, photoUrl, saveProfile, savePhoto } =
    useRetailAccountIdentity()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box
        sx={{
          p: 3,
          borderRadius: applyRadius.card,
          bgcolor: applyFlow.surface,
          border: `1px solid ${applyFlow.hairline}`,
        }}
      >
        <Stack alignItems="center" spacing={1.5}>
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
              {retailInitials(displayName)}
            </Avatar>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) savePhoto(file)
              }}
            />
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
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                p: 0,
                transition: 'border-color 150ms ease',
                '&:hover': { borderColor: applyFlow.hairlineStrong },
                ...focusRingSx,
              }}
            >
              <Camera size={14} color={applyFlow.inkMuted} />
            </Box>
          </Box>

          <Stack alignItems="center" spacing={0.4} sx={{ textAlign: 'center', width: '100%' }}>
            <Typography
              sx={{ fontFamily: applyFont.body, fontWeight: 800, fontSize: 19, color: applyFlow.ink }}
            >
              {displayName}
            </Typography>
            <Typography
              sx={{ fontSize: 13, color: applyFlow.inkMuted, wordBreak: 'break-word', maxWidth: '100%' }}
            >
              {displayEmail}
            </Typography>
            {displayPhone ? (
              <Typography sx={{ fontSize: 13, color: applyFlow.inkMuted }}>{displayPhone}</Typography>
            ) : null}
          </Stack>

          <QuietButton fullWidth sx={{ mt: 0.5 }} onClick={() => setDrawerOpen(true)}>
            Edit profile
          </QuietButton>
        </Stack>
      </Box>

      <PersonalInfoDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        account={{
          ...account,
          name: displayName,
          email: displayEmail,
          phone: displayPhone || account.phone,
        }}
        onSave={saveProfile}
      />
    </>
  )
}
