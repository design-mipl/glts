import { Link } from 'react-router-dom'
import MuiIconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import MuiTooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ElementType, MouseEventHandler, ReactNode } from 'react'

type IconButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'default'
type IconButtonVariant = 'default' | 'contained' | 'outlined' | 'soft'
type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps {
  icon: ReactNode
  tooltip?: string
  variant?: IconButtonVariant
  color?: IconButtonColor
  size?: IconButtonSize
  loading?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  href?: string
  sx?: SxProps<Theme>
}

const sizePx = { sm: 28, md: 36, lg: 44 }

export default function IconButton({
  icon,
  tooltip,
  variant = 'default',
  color = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  href,
  sx,
}: IconButtonProps) {
  const theme = useTheme()
  const dim = sizePx[size]

  const paletteMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    success: theme.palette.success,
    warning: theme.palette.warning,
    info: theme.palette.info,
    default: theme.palette.action,
  }

  const pal = color === 'default' ? null : paletteMap[color]

  const variantSx =
    variant === 'contained' && pal
      ? { bgcolor: pal.main, color: pal.contrastText, '&:hover': { bgcolor: pal.dark } }
      : variant === 'outlined' && pal
        ? { border: '1px solid', borderColor: pal.main, color: pal.main }
        : variant === 'soft' && pal
          ? { bgcolor: alpha(pal.main, 0.1), color: pal.main, '&:hover': { bgcolor: alpha(pal.main, 0.18) } }
          : {}

  const linkProps = href ? ({ component: Link as ElementType, to: href } as object) : {}

  const btn = (
    <MuiIconButton
      disabled={disabled || loading}
      onClick={onClick}
      {...linkProps}
      sx={[
        { width: dim, height: dim, borderRadius: '8px' },
        variantSx,
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {loading ? <CircularProgress size={dim * 0.45} color="inherit" /> : icon}
    </MuiIconButton>
  )

  if (tooltip) {
    return (
      <MuiTooltip title={tooltip} arrow>
        {/* span wrapper needed when button is disabled */}
        <Box component="span" sx={{ display: 'inline-flex' }}>{btn}</Box>
      </MuiTooltip>
    )
  }

  return btn
}
