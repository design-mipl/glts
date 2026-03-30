import MuiIconButton from '@mui/material/IconButton'
import MuiBadge from '@mui/material/Badge'
import { keyframes } from '@mui/system'
import NotificationsIcon from '@mui/icons-material/Notifications'
import type { SxProps, Theme } from '@mui/material/styles'

export interface NotificationBellProps {
  count?: number
  onClick?: () => void
  max?: number
  sx?: SxProps<Theme>
}

const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70%  { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`

export default function NotificationBell({
  count = 0,
  onClick,
  max = 99,
  sx,
}: NotificationBellProps) {
  return (
    <MuiIconButton
      onClick={onClick}
      size="small"
      aria-label="Notifications"
      sx={sx}
    >
      <MuiBadge
        badgeContent={count}
        color="error"
        max={max}
        invisible={count === 0}
        sx={
          count > 0
            ? {
                '& .MuiBadge-badge': {
                  animation: `${pulseRing} 2s ease-in-out infinite`,
                },
              }
            : undefined
        }
      >
        <NotificationsIcon />
      </MuiBadge>
    </MuiIconButton>
  )
}
