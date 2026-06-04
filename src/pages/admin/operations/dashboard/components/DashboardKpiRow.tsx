import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileText,
  Send,
  Shield,
  TrendingDown,
  TrendingUp,
  Wallet,
  Minus,
  type LucideIcon,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { DashboardKpiMetric } from '../data/operationsDashboardMock'

const ICON_MAP: Record<string, LucideIcon> = {
  files: FileText,
  activity: Activity,
  shield: Shield,
  send: Send,
  calendar: Calendar,
  check: CheckCircle2,
  wallet: Wallet,
  alert: AlertTriangle,
}

function DeltaBadge({ delta, deltaLabel }: { delta: number; deltaLabel: string }) {
  const isPositive = delta > 0
  const isNegative = delta < 0
  const color = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary'
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const formatted = isPositive ? `+${delta.toFixed(1)}%` : isNegative ? `${delta.toFixed(1)}%` : '0%'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color }}>
        <Icon size={14} />
        <Typography variant="caption" fontWeight={600} color={color}>
          {formatted}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {deltaLabel}
      </Typography>
    </Box>
  )
}

function DashboardKpiCard({ metric }: { metric: DashboardKpiMetric }) {
  const theme = useTheme()
  const Icon = ICON_MAP[metric.iconKey] ?? FileText
  const paletteColor = theme.palette[metric.accent]?.main ?? theme.palette.primary.main

  return (
    <BaseCard hoverable sx={{ height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1.2 }}
            >
              {metric.label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.1 }}>
              {metric.value.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              {metric.subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: alpha(paletteColor, 0.12),
              color: paletteColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </Box>
        </Stack>
        <DeltaBadge delta={metric.delta} deltaLabel={metric.deltaLabel} />
      </Box>
    </BaseCard>
  )
}

export interface DashboardKpiRowProps {
  metrics: DashboardKpiMetric[]
}

export function DashboardKpiRow({ metrics }: DashboardKpiRowProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <DashboardKpiCard metric={metric} />
        </Grid>
      ))}
    </Grid>
  )
}
