import { Box, Stack, Typography } from '@mui/material'
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel1Sx } from './executiveDashboardTokens'

export interface ExecutiveCompactKpiCardProps {
  label: string
  value: string
  comparisonLabel: string
  delta: number
  icon: LucideIcon
  href?: string
}

export function ExecutiveCompactKpiCard({
  label,
  value,
  comparisonLabel,
  delta,
  icon: Icon,
  href,
}: ExecutiveCompactKpiCardProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const isUp = delta > 0
  const isDown = delta < 0
  const trendColor = isUp ? colors.greenDark : isDown ? '#DC2626' : colors.textMuted
  const TrendIcon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus
  const trendText = isUp ? `+${delta.toFixed(1)}%` : isDown ? `${delta.toFixed(1)}%` : '0%'

  return (
    <Box
      onClick={href ? () => navigate(href) : undefined}
      sx={{
        ...executiveCardLevel1Sx(colors),
        p: 1.5,
        height: '100%',
        cursor: href ? 'pointer' : 'default',
        '&:hover': href ? { borderColor: colors.greenBright, transform: 'translateY(-1px)' } : undefined,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: colors.surfaceAlt,
            color: colors.navy,
            flexShrink: 0,
          }}
        >
          <Icon size={17} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 0.35,
              lineHeight: 1.1,
            }}
          >
            {label}
          </Typography>
          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 0.35 }}
          >
            <Typography sx={{ fontSize: { xs: 20, md: 22 }, fontWeight: 900, color: colors.navy, lineHeight: 1 }}>
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.35} sx={{ flexShrink: 0 }}>
              <TrendIcon size={13} color={trendColor} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: trendColor }}>
                {trendText}
              </Typography>
            </Stack>
          </Stack>
          <Typography sx={{ fontSize: 10, color: colors.textMuted, mt: 0.25 }} noWrap>
            {comparisonLabel}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}
