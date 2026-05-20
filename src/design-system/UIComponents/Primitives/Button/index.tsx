import { Link } from 'react-router-dom'
import MuiButton from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ElementType, MouseEventHandler, ReactNode } from 'react'

type ButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
type ButtonVariant = 'contained' | 'outlined' | 'text' | 'soft'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  label?: string
  children?: ReactNode
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  onClick?: MouseEventHandler<HTMLElement>
  href?: string
  type?: 'button' | 'submit' | 'reset'
  sx?: SxProps<Theme>
}

const sizeDensity: Record<ButtonSize, SxProps<Theme>> = {
  sm: { minHeight: { xs: 9, desktop: 7.5 } },
  md: { minHeight: { xs: 10, desktop: 8 } },
  lg: { minHeight: { xs: 11, desktop: 9 } },
}

export default function Button({
  label,
  children,
  variant = 'contained',
  color = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  href,
  type = 'button',
  sx,
}: ButtonProps) {
  const theme = useTheme()
  const isSoft = variant === 'soft'
  const muiVariant = isSoft ? 'text' : (variant as 'contained' | 'outlined' | 'text')

  const paletteMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    success: theme.palette.success,
    warning: theme.palette.warning,
    info: theme.palette.info,
  }
  const palColor = paletteMap[color]

  const softSx = isSoft
    ? {
        backgroundColor: alpha(palColor.main, 0.1),
        color: palColor.main,
        '&:hover': { backgroundColor: alpha(palColor.main, 0.18) },
      }
    : {}

  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium'

  const sizeSx = sizeDensity[size]
  const linkProps = href ? ({ component: Link as ElementType, to: href } as object) : {}

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={muiSize}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...linkProps}
      sx={[sizeSx, softSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      {label ?? children}
    </MuiButton>
  )
}
