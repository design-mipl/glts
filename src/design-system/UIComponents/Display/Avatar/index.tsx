import MuiAvatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import chroma from 'chroma-js'
import type { SxProps, Theme } from '@mui/material/styles'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarShape = 'circle' | 'square' | 'rounded'

export interface AvatarProps {
  name?: string
  src?: string
  size?: AvatarSize
  shape?: AvatarShape
  color?: string
  online?: boolean
  sx?: SxProps<Theme>
}

const sizePx: Record<AvatarSize, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
}

const radiusMap: Record<AvatarShape, string> = {
  circle: '50%',
  square: '0px',
  rounded: '8px',
}

function getInitials(name?: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function deriveTextColor(bg: string): string {
  try {
    return chroma.contrast(bg, '#ffffff') > 2.5 ? '#ffffff' : '#111111'
  } catch {
    return '#ffffff'
  }
}

export default function Avatar({
  name,
  src,
  size = 'md',
  shape = 'circle',
  color,
  online = false,
  sx,
}: AvatarProps) {
  const theme = useTheme()
  const dim = sizePx[size]
  const borderRadius = radiusMap[shape]
  const initials = getInitials(name)
  const onlineDot = Math.max(6, Math.round(dim * 0.22))

  const bgColor = color ?? theme.palette.primary.main
  const textColor = color ? deriveTextColor(color) : theme.palette.primary.contrastText

  return (
    <Box sx={[{ position: 'relative', display: 'inline-flex' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <MuiAvatar
        src={src}
        alt={name}
        sx={{
          width: dim,
          height: dim,
          borderRadius,
          fontSize: dim * 0.38,
          bgcolor: src ? 'transparent' : bgColor,
          color: textColor,
          fontWeight: 600,
        }}
      >
        {!src && initials}
      </MuiAvatar>
      {online && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: onlineDot,
            height: onlineDot,
            borderRadius: '50%',
            bgcolor: 'success.main',
            border: `2px solid ${theme.palette.background.paper}`,
          }}
        />
      )}
    </Box>
  )
}
