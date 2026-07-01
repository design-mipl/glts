import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Minus,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { DashboardKpiMetric } from '../../data/operationsDashboardMock'

const ICON_MAP: Record<string, LucideIcon> = {
  files: FileText,
  activity: Activity,
  shield: Shield,
  check: CheckCircle2,
  wallet: Wallet,
  alert: AlertTriangle,
  clock: Clock,
  users: Users,
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

function ExecutiveKpiCard({ metric }: { metric: DashboardKpiMetric }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const Icon = ICON_MAP[metric.iconKey] ?? FileText
  const paletteColor =
    (metric.accent in theme.palette
      ? (theme.palette[metric.accent as keyof typeof theme.palette] as { main?: string })?.main
      : undefined) ?? theme.palette.primary.main
  const displayValue = metric.formattedValue ?? metric.value.toLocaleString()

  return (
    <BaseCard
      hoverable
      sx={{ height: '100%', cursor: 'pointer' }}
      onClick={() => navigate(metric.href)}
    >
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
              {displayValue}
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

export interface ExecutiveKpiSectionProps {
  metrics: DashboardKpiMetric[]
}

export function ExecutiveKpiSection({ metrics }: ExecutiveKpiSectionProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ExecutiveKpiCard metric={metric} />
        </Grid>
      ))}
    </Grid>
  )
}
