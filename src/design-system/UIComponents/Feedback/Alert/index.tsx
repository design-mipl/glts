import MuiAlert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import { X } from 'lucide-react'
import { alpha, useTheme } from '@mui/material/styles'
import type { AlertColor } from '@mui/material/Alert'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens, BORDER_RADIUS, BORDER_WIDTH } from '../../../tokens'

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
            <X size={16} />
          </IconButton>
        ) : (
          action
        )
      }
      sx={[
        {
          borderRadius: BORDER_RADIUS.md,
          border: `${BORDER_WIDTH.thin} solid`,
          padding: '12px 16px',
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
