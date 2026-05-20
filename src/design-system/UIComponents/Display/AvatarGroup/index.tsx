import MuiAvatarGroup from '@mui/material/AvatarGroup'
import { useTheme } from '@mui/material/styles'
import Avatar from '../Avatar'
import type { SxProps, Theme } from '@mui/material/styles'

type AvatarGroupSize = 'xs' | 'sm' | 'md' | 'lg'

interface AvatarGroupUser {
  name: string
  src?: string
  color?: string
}

export interface AvatarGroupProps {
  users: AvatarGroupUser[]
  max?: number
  size?: AvatarGroupSize
  spacing?: 'sm' | 'md'
  sx?: SxProps<Theme>
}

const spacingPx = { sm: -6, md: -10 }

export default function AvatarGroup({
  users,
  max = 4,
  size = 'md',
  spacing = 'md',
  sx,
}: AvatarGroupProps) {
  const theme = useTheme()
  const offset = spacingPx[spacing]

  return (
    <MuiAvatarGroup
      max={max}
      sx={[
        {
          '& .MuiAvatar-root': {
            border: `2px solid ${theme.palette.background.paper}`,
            marginLeft: `${offset}px`,
          },
          '& .MuiAvatarGroup-avatar': {
            bgcolor: theme.palette.grey[400],
            fontSize: '0.75rem',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {users.map((user, i) => (
        <Avatar
          key={i}
          name={user.name}
          src={user.src}
          color={user.color}
          size={size}
        />
      ))}
    </MuiAvatarGroup>
  )
}
