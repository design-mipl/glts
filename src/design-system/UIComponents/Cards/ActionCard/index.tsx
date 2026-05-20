import { Box, Typography, Skeleton, Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'

export interface ActionCardProps {
  title: string
  description?: string
  icon?: ReactNode
  iconColor?: string
  onClick?: () => void
  disabled?: boolean
  selected?: boolean
  badge?: string
  headerColor?: string
  loading?: boolean
  sx?: SxProps
}

export default function ActionCard({
  title,
  description,
  icon,
  iconColor,
  onClick,
  disabled = false,
  selected = false,
  badge,
  headerColor,
  loading = false,
  sx,
}: ActionCardProps) {
  const theme = useTheme()
  const iconBg = iconColor ?? alpha(theme.palette.primary.main, 0.1)
  const iconFg = iconColor ? '#fff' : theme.palette.primary.main

  if (loading) {
    return (
      <BaseCard sx={sx}>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Skeleton variant="rounded" width={48} height={48} />
          <Skeleton width="60%" height={22} />
          <Skeleton width="85%" height={18} />
          <Skeleton width="40%" height={18} />
        </Box>
      </BaseCard>
    )
  }

  return (
    <BaseCard
      headerColor={headerColor}
      hoverable={!disabled}
      selectable
      selected={selected}
      onClick={disabled ? undefined : onClick}
      sx={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed !important' : undefined,
        ...(disabled && { '&:hover': { transform: 'none !important', boxShadow: undefined } }),
        ...(sx as object),
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>
        {/* Top row: icon + badge */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconFg,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          {badge && (
            <Chip
              label={badge}
              size="small"
              color="primary"
              sx={{ fontSize: 11, height: 20 }}
            />
          )}
        </Box>

        {/* Title + description */}
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {description}
            </Typography>
          )}
        </Box>

        {/* Arrow indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        </Box>
      </Box>
    </BaseCard>
  )
}
