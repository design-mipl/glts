import { Box, Typography, Skeleton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'
import SparkLine from '../../Charts/SparkLine'

export interface StatCardProps {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  icon?: ReactNode
  iconColor?: string
  headerColor?: string
  sparklineData?: number[]
  loading?: boolean
  hoverable?: boolean
  onClick?: () => void
  sx?: SxProps
}

function DeltaBadge({ delta, deltaLabel }: { delta: number; deltaLabel?: string }) {
  const isPositive = delta > 0
  const isNegative = delta < 0
  const color = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary'
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const formatted = isPositive ? `↑ ${delta.toFixed(1)}%` : isNegative ? `↓ ${Math.abs(delta).toFixed(1)}%` : '0%'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 0.5 }}>
      {deltaLabel ? (
        <Typography variant="caption" color="text.secondary">
          {deltaLabel}
        </Typography>
      ) : null}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color }}>
        <Icon size={14} />
        <Typography variant="caption" fontWeight={700} color={color}>
          {formatted}
        </Typography>
      </Box>
    </Box>
  )
}

export default function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon,
  iconColor,
  headerColor,
  sparklineData,
  loading = false,
  hoverable,
  onClick,
  sx,
}: StatCardProps) {
  const theme = useTheme()
  const iconBg = iconColor ?? alpha(theme.palette.primary.main, 0.12)
  const iconFg = iconColor ? theme.palette.getContrastText(iconColor) : theme.palette.primary.main

  if (loading) {
    return (
      <BaseCard headerColor={headerColor} sx={sx}>
        <Box sx={{ p: 2, display: 'flex', gap: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="45%" height={18} />
            <Skeleton variant="text" width="55%" height={36} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
          <Skeleton variant="rounded" width={40} height={40} />
        </Box>
      </BaseCard>
    )
  }

  return (
    <BaseCard
      headerColor={headerColor}
      hoverable={hoverable}
      onClick={onClick}
      sx={sx}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.75, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ letterSpacing: 0.2, textTransform: 'none' }}
            >
              {label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                mt: 0.75,
                fontSize: { xs: '1.35rem', md: '1.65rem' },
                lineHeight: 1.15,
                letterSpacing: -0.4,
              }}
            >
              {value}
            </Typography>
            {delta !== undefined ? <DeltaBadge delta={delta} deltaLabel={deltaLabel} /> : null}
          </Box>
          {icon ? (
            <Box
              sx={{
                width: 40,
                height: 40,
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
          ) : null}
        </Box>

        {sparklineData && sparklineData.length > 0 ? (
          <Box sx={{ mt: 'auto', pt: 0.5, display: { xs: 'none', sm: 'block' } }}>
            <SparkLine
              data={sparklineData}
              height={32}
              positive={delta !== undefined ? delta >= 0 : undefined}
            />
          </Box>
        ) : null}
      </Box>
    </BaseCard>
  )
}
