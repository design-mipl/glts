import { Box, Grid, Stack, Typography } from '@mui/material'
import { AlertTriangle, HandCoins } from 'lucide-react'
import { ExecutiveCard } from '../../dashboard-ui-kit'
import { DASHBOARD_SPACING } from '../../constants'
import type { DashboardFinanceRiskCallouts } from '../../types'

export interface FinanceRiskCalloutStripProps {
  data: DashboardFinanceRiskCallouts
  loading?: boolean
  onCreditExposureClick?: () => void
  onSlaCashClick?: () => void
}

function CalloutCard({
  title,
  value,
  helper,
  icon,
  tone,
  loading,
  onClick,
}: {
  title: string
  value: string
  helper: string
  icon: React.ReactNode
  tone: 'warning' | 'negative'
  loading?: boolean
  onClick?: () => void
}) {
  const clickable = Boolean(onClick)

  const card = (
    <ExecutiveCard loading={loading} sx={{ height: '100%' }}>
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: tone === 'negative' ? 'error.light' : 'warning.light',
            color: tone === 'negative' ? 'error.main' : 'warning.dark',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: 11 }}>
            {title}
          </Typography>
          <Typography fontWeight={800} sx={{ fontSize: '1.2rem', lineHeight: 1.15, mt: 0.25 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block', mt: 0.25 }}>
            {helper}
          </Typography>
        </Box>
      </Stack>
    </ExecutiveCard>
  )

  if (!clickable) return card

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
      sx={{
        height: '100%',
        cursor: 'pointer',
        outline: 'none',
        '&:focus-visible': {
          borderRadius: 2,
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
        },
      }}
    >
      {card}
    </Box>
  )
}

/** Secondary finance risk strip — credit exposure · SLA-linked cash at risk. */
export function FinanceRiskCalloutStrip({
  data,
  loading,
  onCreditExposureClick,
  onSlaCashClick,
}: FinanceRiskCalloutStripProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field} role="group" aria-label="Finance risk callouts">
      <Grid size={{ xs: 12, md: 6 }}>
        <CalloutCard
          title="Credit exposure"
          value={data.creditExposure}
          helper={data.creditExposureTop5}
          icon={<HandCoins size={18} />}
          tone="warning"
          loading={loading}
          onClick={onCreditExposureClick}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CalloutCard
          title="SLA-linked cash at risk"
          value={data.slaCashAtRisk}
          helper={`${data.slaCashAtRiskCases} cases`}
          icon={<AlertTriangle size={18} />}
          tone="negative"
          loading={loading}
          onClick={onSlaCashClick}
        />
      </Grid>
    </Grid>
  )
}
