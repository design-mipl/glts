import { Avatar, Box, Card, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows, usePublicBrandColors } from '@/shared/theme/publicBrand'

export interface CustomerDetailHeaderProps {
  title: string
  subtitle?: string
  /** Two-letter or short label for avatar when avatar node not provided */
  avatarLabel?: string
  avatar?: ReactNode
  status?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
}

export function CustomerDetailHeader({
  title,
  subtitle,
  avatarLabel,
  avatar,
  status,
  meta,
  actions,
}: CustomerDetailHeaderProps) {
  const colors = usePublicBrandColors()
  const initials =
    avatarLabel ??
    title
      .split(/\s+/)
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        p: { xs: 2, md: 2.5 },
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        borderRadius: BORDER_RADIUS.xl,
        boxShadow: publicShadows.card,
        bgcolor: colors.white,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
          {avatar ?? (
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
                fontWeight: 800,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: subtitle ? 0.5 : 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, md: 20 }, color: colors.navy, lineHeight: 1.2 }}>
                {title}
              </Typography>
              {status}
            </Stack>
            {subtitle && (
              <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{subtitle}</Typography>
            )}
            {meta && <Box sx={{ mt: 1.25 }}>{meta}</Box>}
          </Box>
        </Stack>
        {actions && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
