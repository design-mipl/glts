import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  Minus,
  Receipt,
  Scale,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { AccountsKpiMetric } from '../../data/accountsDashboardMock'

const ICON_MAP: Record<string, LucideIcon> = {
  revenue: IndianRupee,
  collections: Wallet,
  invoice: Receipt,
  reconcile: Scale,
  vendor: Wallet,
  collection: Wallet,
  rate: TrendingUp,
  overdue: Receipt,
}

function TrendIndicator({ trend, value }: { trend: AccountsKpiMetric['trend']; value: string }) {
  const theme = useTheme()
  if (trend === 'up') {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ArrowUpRight size={14} color={theme.palette.success.main} />
        <Typography variant="caption" color="success.main" fontWeight={600}>
          {value}
        </Typography>
      </Stack>
    )
  }
  if (trend === 'down') {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ArrowDownRight size={14} color={theme.palette.error.main} />
        <Typography variant="caption" color="error.main" fontWeight={600}>
          {value}
        </Typography>
      </Stack>
    )
  }
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Minus size={14} color={theme.palette.text.secondary} />
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  )
}

function FinancialKpiCard({ metric }: { metric: AccountsKpiMetric }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const Icon = ICON_MAP[metric.iconKey] ?? IndianRupee
  const paletteColor =
    (metric.accent in theme.palette
      ? (theme.palette[metric.accent as keyof typeof theme.palette] as { main?: string })?.main
      : undefined) ?? theme.palette.primary.main

  return (
    <BaseCard hoverable sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(metric.href)}>
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
              {metric.primaryValue}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap" useFlexGap>
              <Typography variant="caption" color="text.secondary">
                {metric.comparisonLabel}
              </Typography>
              <TrendIndicator trend={metric.trend} value={metric.comparisonValue} />
            </Stack>
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
      </Box>
    </BaseCard>
  )
}

export interface FinancialKpiSectionProps {
  metrics: AccountsKpiMetric[]
}

export function FinancialKpiSection({ metrics }: FinancialKpiSectionProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FinancialKpiCard metric={metric} />
        </Grid>
      ))}
    </Grid>
  )
}
