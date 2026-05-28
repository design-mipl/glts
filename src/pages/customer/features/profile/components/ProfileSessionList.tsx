import { Box, Stack, Typography } from '@mui/material'
import { Monitor } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { UserSession } from '../types/accountWorkspace'

export interface ProfileSessionListProps {
  sessions: UserSession[]
}

export function ProfileSessionList({ sessions }: ProfileSessionListProps) {
  const colors = usePublicBrandColors()

  if (sessions.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No other active sessions.</Typography>
    )
  }

  return (
    <Stack spacing={1}>
      {sessions.map(session => (
        <Stack
          key={session.id}
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            py: 1.25,
            px: 1.5,
            borderRadius: BORDER_RADIUS.md,
            border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
            bgcolor: session.isCurrent ? colors.greenMuted : colors.surface,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: BORDER_RADIUS.md,
              display: 'grid',
              placeItems: 'center',
              bgcolor: colors.white,
              color: colors.navy,
              flexShrink: 0,
            }}
          >
            <Monitor size={16} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>{session.device}</Typography>
            <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
              {session.location} · {session.lastActive}
            </Typography>
          </Box>
          {session.isCurrent && <CustomerStatusChip label="Current session" tone="success" />}
        </Stack>
      ))}
    </Stack>
  )
}
