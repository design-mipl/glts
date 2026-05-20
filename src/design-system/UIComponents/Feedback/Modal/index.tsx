import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import LoadingOverlay from '../LoadingOverlay'

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  hideCloseButton?: boolean
  disableBackdropClick?: boolean
  disableEscapeKey?: boolean
  loading?: boolean
  sx?: SxProps<Theme>
}

const modalWidths: Record<Exclude<ModalSize, 'fullscreen'>, number> = {
  xs: 400,
  sm: 500,
  md: 600,
  lg: 800,
  xl: 1000,
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  hideCloseButton = false,
  disableBackdropClick = false,
  disableEscapeKey = false,
  loading = false,
  sx,
}: ModalProps) {
  const theme = useTheme()
  const isCompactPhone = useMediaQuery(theme.breakpoints.down('lg'))
  const isFullscreen = size === 'fullscreen' || isCompactPhone
  const dialogWidth = size === 'fullscreen' ? modalWidths.xl : modalWidths[size]

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (disableBackdropClick && reason === 'backdropClick') {
          return
        }

        onClose()
      }}
      fullScreen={isFullscreen}
      disableEscapeKeyDown={disableEscapeKey}
      maxWidth={false}
      fullWidth={!isFullscreen}
      slots={isCompactPhone ? { transition: Slide } : undefined}
      slotProps={{
        ...(isCompactPhone
          ? {
              transition: {
                direction: 'up',
              },
            }
          : {}),
        paper: {
          sx: [
            {
              width: isFullscreen ? '100vw' : dialogWidth,
              maxWidth: isFullscreen ? '100vw' : 'calc(100vw - 64px)',
              height: isFullscreen ? '100vh' : 'min(100vh - 64px, 90vh)',
              maxHeight: isFullscreen ? '100vh' : '90vh',
              m: isFullscreen ? 0 : tokens.spacing[4],
              borderRadius: isFullscreen ? 0 : tokens.borderRadius.xl,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundImage: 'none',
              boxShadow: isFullscreen ? 'none' : tokens.shadow.xl,
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ],
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: isCompactPhone ? 'flex-end' : 'center',
        },
      }}
    >
      {(title || subtitle || !hideCloseButton) && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: tokens.zIndex.raised,
            display: 'flex',
            gap: tokens.spacing[3],
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: tokens.spacing[3],
            py: tokens.spacing[2],
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ minWidth: 0, pr: tokens.spacing[2] }}>
            {title ? <Typography variant="h6">{title}</Typography> : null}
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: tokens.spacing[1] }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {!hideCloseButton ? (
            <IconButton aria-label="Close modal" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </Box>
      )}

      <LoadingOverlay loading={loading} sx={{ zIndex: tokens.zIndex.raised }}>
        <DialogContent
          sx={{
            position: 'relative',
            flex: 1,
            overflowY: 'auto',
            px: tokens.spacing[3],
            py: tokens.spacing[3],
          }}
        >
          {children}
        </DialogContent>
      </LoadingOverlay>

      {footer ? (
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: tokens.zIndex.raised,
            px: tokens.spacing[3],
            py: tokens.spacing[2],
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          {footer}
        </Box>
      ) : null}
    </Dialog>
  )
}
