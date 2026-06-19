import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { X } from 'lucide-react'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import { overlayHeaderSubtitleSx, overlayHeaderTitleSx } from '../overlayHeaderTypography'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  headerExtra?: ReactNode
  children: ReactNode
  footer?: ReactNode
  anchor?: MuiDrawerProps['anchor']
  width?: number | string
  hideCloseButton?: boolean
  disableBackdropClick?: boolean
  /** `default` = grey form canvas (section cards read like full-page form); `paper` = flat white body */
  bodyVariant?: 'default' | 'paper'
  sx?: SxProps<Theme>
}

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  headerExtra,
  children,
  footer,
  anchor = 'right',
  width = 400,
  hideCloseButton = false,
  disableBackdropClick = false,
  bodyVariant = 'paper',
  sx,
}: DrawerProps) {
  const theme = useTheme()
  const isCompactPhone = useMediaQuery(theme.breakpoints.down('lg'))
  const resolvedWidth = isCompactPhone ? '100vw' : width
  const isHorizontal = anchor === 'left' || anchor === 'right'

  return (
    <MuiDrawer
      open={open}
      onClose={(_, reason) => {
        if (disableBackdropClick && reason === 'backdropClick') {
          return
        }

        onClose()
      }}
      anchor={anchor}
      variant="temporary"
      slotProps={{
        paper: {
          sx: [
            {
              width: isHorizontal ? resolvedWidth : '100%',
              height: isHorizontal ? '100%' : resolvedWidth,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: 'none',
              backgroundImage: 'none',
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ],
        },
      }}
    >
      {(title || subtitle || headerExtra || !hideCloseButton) && (
        <Box
          sx={{
            display: 'flex',
            gap: tokens.spacing[3],
            alignItems: subtitle || headerExtra ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            px: tokens.spacing[3],
            py: tokens.spacing[2],
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ minWidth: 0, pr: tokens.spacing[2], flex: 1 }}>
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
            {headerExtra ? (
              <Box sx={{ mt: tokens.spacing[1.5], display: 'flex', flexWrap: 'wrap', gap: tokens.spacing[1] }}>
                {headerExtra}
              </Box>
            ) : null}
          </Box>
          {!hideCloseButton ? (
            <IconButton aria-label="Close drawer" onClick={onClose}>
              <X size={20} />
            </IconButton>
          ) : null}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: tokens.spacing[3],
          py: tokens.spacing[3],
          bgcolor: bodyVariant === 'default' ? 'background.default' : 'background.paper',
        }}
      >
        {children}
      </Box>

      {footer ? (
        <Box
          sx={{
            px: tokens.spacing[3],
            py: tokens.spacing[2],
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          {footer}
        </Box>
      ) : null}
    </MuiDrawer>
  )
}
