import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { keyframes } from '@mui/material/styles'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens, BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '../../../tokens'
import { useToast } from './useToast'
import type { Toast, ToastVariant } from './useToast'

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(24px);
  }
`

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const theme = useTheme()
  const [isExiting, setIsExiting] = useState(false)

  const variantMeta = useMemo(() => {
    const meta: Record<ToastVariant, { borderColor: string; icon?: ReactNode }> = {
      success: {
        borderColor: theme.palette.success.main,
        icon: <CheckCircle size={20} color={theme.palette.success.main} />,
      },
      error: {
        borderColor: theme.palette.error.main,
        icon: <AlertCircle size={20} color={theme.palette.error.main} />,
      },
      warning: {
        borderColor: theme.palette.warning.main,
        icon: <AlertTriangle size={20} color={theme.palette.warning.main} />,
      },
      info: {
        borderColor: theme.palette.info.main,
        icon: <Info size={20} color={theme.palette.info.main} />,
      },
      default: {
        borderColor: theme.palette.divider,
      },
    }

    return meta[toast.variant]
  }, [theme, toast.variant])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsExiting(true)
    }, toast.duration ?? 4000)

    return () => window.clearTimeout(timeout)
  }, [toast.duration])

  useEffect(() => {
    if (!isExiting) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      onDismiss(toast.id)
    }, 180)

    return () => window.clearTimeout(timeout)
  }, [isExiting, onDismiss, toast.id])

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 300,
        maxWidth: 420,
        borderRadius: BORDER_RADIUS.md,
        boxShadow: SHADOWS.lg,
        borderLeft: `4px solid ${variantMeta.borderColor}`,
        borderTop: `${BORDER_WIDTH.thin} solid ${theme.palette.divider}`,
        borderRight: `${BORDER_WIDTH.thin} solid ${theme.palette.divider}`,
        borderBottom: `${BORDER_WIDTH.thin} solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.96),
        overflow: 'hidden',
        animation: `${isExiting ? fadeOut : slideIn} ${tokens.transition.normal} forwards`,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: variantMeta.icon ? 'auto 1fr auto' : '1fr auto',
          gap: tokens.spacing[3],
          alignItems: 'start',
          px: tokens.spacing[4],
          py: tokens.spacing[3],
        }}
      >
        {variantMeta.icon ? <Box sx={{ lineHeight: 0 }}>{variantMeta.icon}</Box> : null}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={tokens.fontWeight.semibold}>
            {toast.title}
          </Typography>
          {toast.description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: tokens.spacing[1] }}>
              {toast.description}
            </Typography>
          ) : null}
          {toast.action ? (
            <Button
              size="small"
              color="inherit"
              onClick={() => {
                toast.action?.onClick()
                setIsExiting(true)
              }}
              sx={{
                mt: tokens.spacing[2],
                minHeight: 'unset',
                px: tokens.spacing[2],
                py: tokens.spacing[1],
                borderRadius: tokens.borderRadius.md,
                color: 'primary.main',
                justifyContent: 'flex-start',
              }}
            >
              {toast.action.label}
            </Button>
          ) : null}
        </Box>
        <IconButton aria-label="Dismiss toast" size="small" onClick={() => setIsExiting(true)}>
          <X size={16} />
        </IconButton>
      </Box>
    </Paper>
  )
}

export interface ToastProviderProps {
  children?: ReactNode
  sx?: SxProps<Theme>
}

export default function ToastProvider({ children, sx }: ToastProviderProps) {
  const toasts = useToast((state) => state.toasts)
  const dismissToast = useToast((state) => state.dismissToast)
  const visibleToasts = [...toasts].slice(-5).reverse()

  return (
    <>
      {children}
      <Stack
        spacing={3}
        sx={[
          {
            position: 'fixed',
            right: tokens.spacing[6],
            bottom: tokens.spacing[6],
            zIndex: tokens.zIndex.toast,
            pointerEvents: 'none',
            alignItems: 'flex-end',
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {visibleToasts.map((toast) => (
          <Box key={toast.id} sx={{ pointerEvents: 'auto' }}>
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </Box>
        ))}
      </Stack>
    </>
  )
}
