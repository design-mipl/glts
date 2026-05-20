import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  anchor?: MuiDrawerProps['anchor']
  width?: number | string
  hideCloseButton?: boolean
  disableBackdropClick?: boolean
  sx?: SxProps<Theme>
}

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  anchor = 'right',
  width = 400,
  hideCloseButton = false,
  disableBackdropClick = false,
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
      {(title || subtitle || !hideCloseButton) && (
        <Box
          sx={{
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
            <IconButton aria-label="Close drawer" onClick={onClose}>
              <CloseIcon />
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
