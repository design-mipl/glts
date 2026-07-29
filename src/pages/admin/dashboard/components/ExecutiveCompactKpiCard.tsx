import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SHADOWS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel1Sx } from './executiveDashboardTokens'

export type ExecutiveKpiAccent = 'primary' | 'success' | 'warning' | 'error' | 'info'

export interface ExecutiveCompactKpiCardProps {
  label: string
  value: string
  comparisonLabel: string
  delta: number
  icon: LucideIcon
  accent?: ExecutiveKpiAccent
  href?: string
}

export function ExecutiveCompactKpiCard({
  label,
  value,
  comparisonLabel,
  delta,
  icon: Icon,
  accent = 'primary',
  href,
}: ExecutiveCompactKpiCardProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const isUp = delta > 0
  const isDown = delta < 0
  const trendColor = isUp ? colors.greenDark : isDown ? theme.palette.error.main : colors.textMuted
  const TrendIcon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus
  const trendText = isUp ? `+${delta.toFixed(1)}%` : isDown ? `${delta.toFixed(1)}%` : '0%'
  const accentMain =
    (theme.palette[accent] as { main?: string } | undefined)?.main ?? theme.palette.primary.main

  return (
    <Box
      onClick={href ? () => navigate(href) : undefined}
      sx={{
        ...executiveCardLevel1Sx(colors),
        px: 1.5,
        py: 1,
        height: '100%',
        cursor: href ? 'pointer' : 'default',
        '&:hover': href
          ? { borderColor: colors.greenBright, transform: 'translateY(-1px)', boxShadow: SHADOWS.sm }
          : undefined,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              lineHeight: 1.2,
            }}
            noWrap
          >
            {label}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.35 }}>
            <Typography
              sx={{
                fontSize: { xs: 17, md: 18 },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {value}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.2}
              sx={{
                px: 0.6,
                py: 0.15,
                borderRadius: '999px',
                bgcolor: alpha(trendColor, 0.1),
                flexShrink: 0,
              }}
            >
              <TrendIcon size={11} color={trendColor} />
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: trendColor, lineHeight: 1.2 }}>
                {trendText}
              </Typography>
            </Stack>
          </Stack>

          <Typography sx={{ fontSize: 10, color: colors.textMuted, mt: 0.2, lineHeight: 1.2 }} noWrap>
            {comparisonLabel}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(accentMain, 0.12),
            color: accentMain,
            flexShrink: 0,
          }}
        >
          <Icon size={14} />
        </Box>
      </Stack>
    </Box>
  )
}
