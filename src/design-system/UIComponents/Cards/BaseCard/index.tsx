import { Card, Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '../../../tokens'

function normalizeSx(sx?: SxProps<Theme>): SxProps<Theme>[] {
  if (sx == null) return []
  return Array.isArray(sx) ? sx : [sx]
}

export interface BaseCardProps {
  children: ReactNode
  hoverable?: boolean
  selectable?: boolean
  selected?: boolean
  onClick?: () => void
  headerColor?: string
  loading?: boolean
  sx?: SxProps<Theme>
  elevation?: number
}

export default function BaseCard({
  children,
  hoverable,
  selectable,
  selected,
  onClick,
  headerColor,
  sx,
  elevation = 0,
}: BaseCardProps) {
  const theme = useTheme()
  const isInteractive = hoverable || !!onClick || selectable

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={[
        {
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          border: selected ? BORDER_WIDTH.medium + ' solid' : BORDER_WIDTH.thin + ' solid',
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
          backgroundImage: 'none',
          transition: 'all 0.2s ease',
          cursor: onClick || selectable ? 'pointer' : 'default',
          overflow: 'hidden',
          width: '100%',
          ...(isInteractive && {
            '&:hover': {
              boxShadow: SHADOWS.md,
              transform: 'translateY(-2px)',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              ...(!selected && selectable && {
                borderColor: 'primary.light',
              }),
            },
          }),
        },
        ...normalizeSx(sx),
      ]}
    >
      {headerColor && (
        <Box
          sx={{
            height: 4,
            bgcolor: headerColor,
          }}
        />
      )}
      {children}
    </Card>
  )
}
