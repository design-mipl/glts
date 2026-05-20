import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '../Avatar'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

type UserCardSize = 'sm' | 'md' | 'lg'
type UserCardOrientation = 'horizontal' | 'vertical'

export interface UserCardProps {
  name: string
  email?: string
  role?: string
  avatarSrc?: string
  online?: boolean
  size?: UserCardSize
  orientation?: UserCardOrientation
  actions?: ReactNode
  onClick?: () => void
  sx?: SxProps<Theme>
}

const sizeConfig = {
  sm: { avatarSize: 'sm', nameVariant: 'body2', subVariant: 'caption' },
  md: { avatarSize: 'md', nameVariant: 'body1', subVariant: 'body2' },
  lg: { avatarSize: 'lg', nameVariant: 'subtitle1', subVariant: 'body2' },
} as const

export default function UserCard({
  name,
  email,
  role,
  avatarSrc,
  online = false,
  size = 'md',
  orientation = 'horizontal',
  actions,
  onClick,
  sx,
}: UserCardProps) {
  const { avatarSize, nameVariant, subVariant } = sizeConfig[size]

  const info = (
    <Box sx={orientation === 'vertical' ? { textAlign: 'center' } : {}}>
      <Typography variant={nameVariant} fontWeight={600} noWrap>
        {name}
      </Typography>
      {role && (
        <Typography variant={subVariant} color="text.secondary" noWrap>
          {role}
        </Typography>
      )}
      {email && (
        <Typography variant="caption" color="text.disabled" noWrap display="block">
          {email}
        </Typography>
      )}
    </Box>
  )

  return (
    <Box
      onClick={onClick}
      sx={[
        {
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          alignItems: orientation === 'vertical' ? 'center' : 'center',
          gap: 1.5,
          cursor: onClick ? 'pointer' : 'default',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Avatar name={name} src={avatarSrc} size={avatarSize} online={online} />
      {info}
      {actions && <Box sx={{ ml: orientation === 'horizontal' ? 'auto' : 0 }}>{actions}</Box>}
    </Box>
  )
}
