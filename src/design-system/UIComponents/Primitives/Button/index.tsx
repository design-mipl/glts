import { Link } from 'react-router-dom'
import MuiButton from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ElementType, MouseEventHandler, ReactNode } from 'react'
import { BUTTON, buttonPaddingCss } from '../../../formControl'

type ButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
type ButtonVariant = 'contained' | 'outlined' | 'text' | 'soft' | 'neutral'
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

const sizeStyles: Record<ButtonSize, SxProps<Theme>> = {
  sm: {
    minHeight: BUTTON.minHeightSm,
    fontSize: '12px',
    padding: buttonPaddingCss('sm'),
    gap: 0.75,
  },
  md: {
    minHeight: BUTTON.minHeightMd,
    fontSize: BUTTON.fontSize,
    padding: buttonPaddingCss('md'),
    gap: 1,
  },
  lg: {
    minHeight: '40px',
    fontSize: BUTTON.fontSize,
    padding: buttonPaddingCss('lg'),
    gap: 1,
  },
}

function getVariantSx(
  variant: ButtonVariant,
  color: ButtonColor,
  theme: Theme,
): SxProps<Theme> {
  const paletteMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    success: theme.palette.success,
    warning: theme.palette.warning,
    info: theme.palette.info,
  }
  const pal = paletteMap[color]

  if (variant === 'neutral') {
    return {
      bgcolor: 'action.hover',
      color: 'text.primary',
      border: '1px solid',
      borderColor: alpha(theme.palette.text.primary, 0.1),
      boxShadow: 'none',
      '&:hover:not(:disabled)': {
        bgcolor: 'action.selected',
        borderColor: alpha(theme.palette.text.primary, 0.14),
      },
    }
  }

  if (variant === 'soft') {
    return {
      backgroundColor: alpha(pal.main, 0.1),
      color: pal.main,
      '&:hover:not(:disabled)': {
        backgroundColor: alpha(pal.main, 0.16),
      },
    }
  }

  if (variant === 'outlined') {
    return {
      borderWidth: '1px',
      ...(color === 'secondary'
        ? {}
        : {
            borderColor: theme.palette.divider,
            '&:hover:not(:disabled)': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }),
    }
  }

  if (variant === 'text') {
    return {
      '&:hover:not(:disabled)': {
        backgroundColor: alpha(theme.palette.text.primary, 0.06),
      },
    }
  }

  return {
    '&:hover:not(:disabled)': {
      boxShadow: `0 2px 8px ${alpha(pal.main, 0.28)}`,
    },
  }
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
  const isNeutral = variant === 'neutral'
  const muiVariant = isSoft || isNeutral ? 'text' : (variant as 'contained' | 'outlined' | 'text')
  const muiColor = isNeutral ? 'inherit' : color
  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium'
  const linkProps = href ? ({ component: Link as ElementType, to: href } as object) : {}

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disableElevation
      startIcon={loading ? <CircularProgress size={14} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...linkProps}
      sx={[
        {
          borderRadius: BUTTON.borderRadius,
          fontWeight: BUTTON.fontWeight,
          textTransform: 'none',
          lineHeight: 1.25,
          boxShadow: 'none',
          transition:
            'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease',
          '&:focus-visible': {
            outline: `2px solid ${alpha(theme.palette.primary.main, 0.45)}`,
            outlineOffset: 2,
          },
          '& .MuiButton-startIcon, & .MuiButton-endIcon': {
            margin: 0,
          },
        },
        sizeStyles[size],
        getVariantSx(variant, color, theme),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {label ?? children}
    </MuiButton>
  )
}
