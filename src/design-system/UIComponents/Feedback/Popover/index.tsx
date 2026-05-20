import { cloneElement, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import MuiPopover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import type { PopoverOrigin } from '@mui/material/Popover'
import type { SxProps, Theme } from '@mui/material/styles'
import type { MouseEvent, ReactElement, ReactNode } from 'react'
import { tokens } from '../../../tokens'

type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'left'
  | 'right'

export interface PopoverProps {
  trigger: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>
  children: ReactNode
  title?: string
  width?: number | string
  placement?: PopoverPlacement
  closeOnContentClick?: boolean
  sx?: SxProps<Theme>
}

function getPlacementConfig(placement: PopoverPlacement): {
  anchorOrigin: PopoverOrigin
  transformOrigin: PopoverOrigin
} {
  switch (placement) {
    case 'bottom-end':
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        transformOrigin: { vertical: 'top', horizontal: 'right' },
      }
    case 'top-start':
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'left' },
        transformOrigin: { vertical: 'bottom', horizontal: 'left' },
      }
    case 'top-end':
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transformOrigin: { vertical: 'bottom', horizontal: 'right' },
      }
    case 'left':
      return {
        anchorOrigin: { vertical: 'center', horizontal: 'left' },
        transformOrigin: { vertical: 'center', horizontal: 'right' },
      }
    case 'right':
      return {
        anchorOrigin: { vertical: 'center', horizontal: 'right' },
        transformOrigin: { vertical: 'center', horizontal: 'left' },
      }
    case 'bottom-start':
    default:
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
      }
  }
}

export default function Popover({
  trigger,
  children,
  title,
  width = 280,
  placement = 'bottom-start',
  closeOnContentClick = false,
  sx,
}: PopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { anchorOrigin, transformOrigin } = useMemo(() => getPlacementConfig(placement), [placement])

  function handleOpen(event: MouseEvent<HTMLElement>) {
    if (typeof trigger.props.onClick === 'function') {
      trigger.props.onClick(event)
    }
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <>
      {cloneElement(trigger, { onClick: handleOpen })}
      <MuiPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: [
              {
                width,
                borderRadius: tokens.borderRadius.lg,
                boxShadow: tokens.shadow.lg,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              },
              ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ],
          },
        }}
      >
        {title ? (
          <Box
            sx={{
              px: tokens.spacing[4],
              py: tokens.spacing[3],
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={tokens.fontWeight.semibold}>
              {title}
            </Typography>
          </Box>
        ) : null}
        <Box
          onClick={closeOnContentClick ? handleClose : undefined}
          sx={{
            px: tokens.spacing[4],
            py: tokens.spacing[4],
          }}
        >
          {children}
        </Box>
      </MuiPopover>
    </>
  )
}
