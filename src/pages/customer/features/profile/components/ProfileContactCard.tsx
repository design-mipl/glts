import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Mail, Phone, User } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows } from '@/shared/theme/publicBrand'
import type { ProfileContact } from '../types/accountWorkspace'

export interface ProfileContactCardProps {
  contact: ProfileContact
  variant?: 'default' | 'compact'
}

export function ProfileContactCard({ contact, variant = 'default' }: ProfileContactCardProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        p: variant === 'compact' ? 1.75 : 2,
        borderRadius: BORDER_RADIUS.lg,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        bgcolor: colors.white,
        boxShadow: publicShadows.card,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.md,
            display: 'grid',
            placeItems: 'center',
            bgcolor: colors.greenMuted,
            color: colors.greenDark,
            flexShrink: 0,
          }}
        >
          <User size={18} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy }}>{contact.name}</Typography>
          <Typography sx={{ fontSize: 12, color: colors.textMuted }}>{contact.role}</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 12, color: colors.textSecondary, flex: 1 }} noWrap>
              {contact.email}
            </Typography>
            <IconButton
              size="small"
              component="a"
              href={`mailto:${contact.email}`}
              aria-label={`Email ${contact.name}`}
              sx={{ color: colors.textMuted }}
            >
              <Mail size={16} />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: colors.textSecondary, flex: 1 }}>{contact.phone}</Typography>
            <IconButton
              size="small"
              component="a"
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              aria-label={`Call ${contact.name}`}
              sx={{ color: colors.textMuted }}
            >
              <Phone size={16} />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
