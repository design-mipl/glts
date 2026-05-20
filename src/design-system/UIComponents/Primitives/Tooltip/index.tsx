import MuiTooltip from '@mui/material/Tooltip'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactElement, ReactNode } from 'react'

export interface TooltipProps {
  content: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  children: ReactElement
  delay?: number
  disabled?: boolean
  arrow?: boolean
  maxWidth?: number
  sx?: SxProps<Theme>
}

export default function Tooltip({
  content,
  placement = 'top',
  children,
  delay = 400,
  disabled = false,
  arrow = true,
  maxWidth = 220,
  sx,
}: TooltipProps) {
  if (disabled) return children

  return (
    <MuiTooltip
      title={content}
      placement={placement}
      arrow={arrow}
      enterDelay={delay}
      enterNextDelay={delay}
      slotProps={{
        tooltip: {
          sx: [
            {
              bgcolor: 'grey.900',
              color: 'common.white',
              borderRadius: '4px',
              fontSize: '12px',
              maxWidth,
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ],
        },
        arrow: {
          sx: { color: 'grey.900' },
        },
      }}
    >
      {children}
    </MuiTooltip>
  )
}
