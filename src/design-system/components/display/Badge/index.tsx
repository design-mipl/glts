import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

type BadgeColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'
type BadgeVariant = 'filled' | 'outlined' | 'soft'
type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  label: string
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  dot?: boolean
  icon?: ReactNode
  onDelete?: () => void
  sx?: SxProps<Theme>
}

const sizeMap: Record<BadgeSize, { height: number; fontSize: string }> = {
  sm: { height: 20, fontSize: '11px' },
  md: { height: 24, fontSize: '12px' },
  lg: { height: 28, fontSize: '13px' },
}

export default function Badge({
  label,
  variant = 'soft',
  color = 'primary',
  size = 'md',
  dot = false,
  icon,
  onDelete,
  sx,
}: BadgeProps) {
  const theme = useTheme()

  const paletteMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    success: theme.palette.success,
    warning: theme.palette.warning,
    info: theme.palette.info,
  }

  const pal = color === 'neutral' ? null : paletteMap[color]
  const mainColor = color === 'neutral' || !pal ? theme.palette.grey[600] : pal.main
  const contrastColor = color === 'neutral' || !pal ? theme.palette.common.white : pal.contrastText

  if (dot) {
    return (
      <Box
        sx={[
          {
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: mainColor,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      />
    )
  }

  const { height, fontSize } = sizeMap[size]

  const variantSx =
    variant === 'filled'
      ? { bgcolor: mainColor, color: contrastColor, border: 'none' }
      : variant === 'outlined'
        ? { bgcolor: 'transparent', color: mainColor, border: `1px solid ${mainColor}` }
        : { bgcolor: alpha(mainColor, 0.12), color: mainColor, border: 'none' }

  return (
    <Chip
      label={label}
      size="small"
      icon={icon ? <Box sx={{ display: 'flex', alignItems: 'center', ml: '6px !important' }}>{icon}</Box> : undefined}
      onDelete={onDelete}
      sx={[
        {
          height,
          fontSize,
          fontWeight: 500,
          borderRadius: '9999px',
          '& .MuiChip-label': { px: '8px' },
        },
        variantSx,
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
