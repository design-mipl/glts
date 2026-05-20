import { Box, Typography, Grid, Divider, Skeleton } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'

export interface MetricItem {
  label: string
  value: string | number
  delta?: number
  color?: string
}

export interface MetricCardProps {
  title: string
  subtitle?: string
  metrics: MetricItem[]
  headerColor?: string
  loading?: boolean
  hoverable?: boolean
  actions?: ReactNode
  sx?: SxProps
}

function MetricCell({ metric }: { metric: MetricItem }) {
  const isPositive = (metric.delta ?? 0) > 0
  const isNegative = (metric.delta ?? 0) < 0
  const deltaColor = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary'
  const DeltaIcon = isPositive ? TrendingUpIcon : TrendingDownIcon

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.25 }}
      >
        {metric.label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: metric.color ?? 'text.primary', lineHeight: 1.2 }}
      >
        {metric.value}
      </Typography>
      {metric.delta !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.25 }}>
          {metric.delta !== 0 && (
            <DeltaIcon sx={{ fontSize: 13, color: deltaColor }} />
          )}
          <Typography variant="caption" fontWeight={600} color={deltaColor}>
            {metric.delta > 0 ? '+' : ''}{metric.delta.toFixed(1)}%
          </Typography>
        </Box>
      )}
    </Box>
  )
}

function getColSize(count: number): { xs: number; lg?: number } {
  if (count <= 2) return { xs: 6 }
  if (count === 3) return { xs: 4 }
  return { xs: 6, lg: 3 }
}

export default function MetricCard({
  title,
  subtitle,
  metrics,
  headerColor,
  loading = false,
  hoverable,
  actions,
  sx,
}: MetricCardProps) {
  const colSize = getColSize(metrics.length)

  if (loading) {
    return (
      <BaseCard headerColor={headerColor} sx={sx}>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton width="50%" height={22} />
              <Skeleton width="35%" height={18} />
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[...Array(metrics.length || 4)].map((_, i) => (
              <Grid key={i} size={colSize}>
                <Skeleton width="60%" height={16} />
                <Skeleton width="45%" height={28} />
                <Skeleton width="35%" height={14} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </BaseCard>
    )
  }

  return (
    <BaseCard headerColor={headerColor} hoverable={hoverable} sx={sx}>
      <Box sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            )}
          </Box>
          {actions && <Box sx={{ ml: 1, flexShrink: 0 }}>{actions}</Box>}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Metrics grid */}
        <Grid container spacing={2}>
          {metrics.map((metric, i) => (
            <Grid key={i} size={colSize}>
              <MetricCell metric={metric} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </BaseCard>
  )
}
