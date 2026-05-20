import MuiAlert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import type { AlertColor } from '@mui/material/Alert'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

type AlertVariant = 'filled' | 'outlined' | 'soft'

export interface AlertProps {
  variant?: AlertVariant
  severity: AlertColor
  title?: string
  children?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  action?: ReactNode
  icon?: ReactNode
  sx?: SxProps<Theme>
}

export default function Alert({
  variant = 'soft',
  severity,
  title,
  children,
  dismissible = false,
  onDismiss,
  action,
  icon,
  sx,
}: AlertProps) {
  const theme = useTheme()
  const paletteColor = theme.palette[severity]
  const isSoft = variant === 'soft'

  return (
    <MuiAlert
      severity={severity}
      variant={isSoft ? 'outlined' : variant}
      icon={icon}
      action={
        dismissible ? (
          <IconButton color="inherit" size="small" onClick={onDismiss} aria-label="Dismiss alert">
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : (
          action
        )
      }
      sx={[
        {
          borderRadius: tokens.borderRadius.lg,
          alignItems: title ? 'flex-start' : 'center',
          ...(isSoft
            ? {
                borderColor: alpha(paletteColor.main, theme.palette.mode === 'light' ? 0.22 : 0.4),
                backgroundColor: alpha(paletteColor.main, theme.palette.mode === 'light' ? 0.12 : 0.2),
                color: theme.palette.text.primary,
                '& .MuiAlert-icon': {
                  color: paletteColor.main,
                },
              }
            : {}),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {title ? <AlertTitle sx={{ fontWeight: tokens.fontWeight.bold }}>{title}</AlertTitle> : null}
      {children}
    </MuiAlert>
  )
}
