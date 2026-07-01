import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import Typography from '@mui/material/Typography'
import { X } from 'lucide-react'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens, BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '../../../tokens'
import LoadingOverlay from '../LoadingOverlay'
import { overlayHeaderSubtitleSx, overlayHeaderTitleSx } from '../overlayHeaderTypography'

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
              // Let content decide modal height; cap it at viewport-safe maximum.
              height: isFullscreen ? '100vh' : 'auto',
              minHeight: isFullscreen ? '100vh' : 'auto',
              maxHeight: isFullscreen ? '100vh' : 'min(100vh - 64px, 90vh)',
              m: isFullscreen ? 0 : tokens.spacing[4],
              borderRadius: isFullscreen ? 0 : BORDER_RADIUS.lg,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundImage: 'none',
              boxShadow: isFullscreen ? 'none' : SHADOWS.lg,
              border: isFullscreen ? 'none' : `${BORDER_WIDTH.thin} solid`,
              borderColor: isFullscreen ? 'transparent' : 'divider',
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
            alignItems: subtitle ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            px: tokens.spacing[3],
            py: tokens.spacing[2],
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ minWidth: 0, pr: tokens.spacing[2] }}>
            {title ? (
              <Typography component="h2" sx={overlayHeaderTitleSx}>
                {title}
              </Typography>
            ) : null}
            {subtitle ? (
              <Typography sx={{ ...overlayHeaderSubtitleSx, mt: tokens.spacing[1] }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {!hideCloseButton ? (
            <IconButton aria-label="Close modal" onClick={onClose}>
              <X size={20} />
            </IconButton>
          ) : null}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <LoadingOverlay
          loading={loading}
          wrapperSx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          sx={{ zIndex: tokens.zIndex.raised }}
        >
          <DialogContent
            sx={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: tokens.spacing[3],
              py: tokens.spacing[3],
            }}
          >
            {children}
          </DialogContent>
        </LoadingOverlay>
      </Box>

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
