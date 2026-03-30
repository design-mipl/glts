import { Card, Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface BaseCardProps {
  children: ReactNode
  hoverable?: boolean
  selectable?: boolean
  selected?: boolean
  onClick?: () => void
  headerColor?: string
  loading?: boolean
  sx?: SxProps
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
      sx={{
        borderRadius: tokens.borderRadius.lg,
        boxShadow: tokens.shadow.md,
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : alpha(theme.palette.mode === 'light' ? '#000000' : '#ffffff', 0.06),
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
        backgroundImage: 'none',
        transition: `box-shadow ${tokens.transition.normal}, transform ${tokens.transition.normal}`,
        cursor: onClick || selectable ? 'pointer' : 'default',
        overflow: 'hidden',
        width: '100%',
        ...(isInteractive && {
          '&:hover': {
            boxShadow: tokens.shadow.lg,
            transform: 'translateY(-2px)',
            ...(!selected && selectable && {
              borderColor: 'primary.light',
            }),
          },
        }),
        ...(sx as object),
      }}
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
