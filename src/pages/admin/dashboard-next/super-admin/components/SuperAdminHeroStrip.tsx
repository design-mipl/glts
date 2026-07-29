import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ExecutiveCard,
  HeroMetric,
  InsightStack,
  formatDelta,
} from '../../shared/dashboard-ui-kit'
import { DASHBOARD_SPACING } from '../../shared/constants'
import type { DashboardKpiItem } from '../../shared/types'
import type { SuperAdminBlockedCash, SuperAdminRevenueHero, SuperAdminRevenuePeriod } from '../types'

export interface SuperAdminHeroStripProps {
  revenue: SuperAdminRevenueHero
  items: DashboardKpiItem[]
  blockedCash?: SuperAdminBlockedCash
  loading?: boolean
}

function PeriodColumn({ period }: { period: SuperAdminRevenuePeriod }) {
  const theme = useTheme()
  const deltaTone =
    period.delta == null
      ? theme.palette.text.secondary
      : period.delta > 0
        ? theme.palette.success.main
        : period.delta < 0
          ? theme.palette.error.main
          : theme.palette.text.secondary

  return (
    <Box sx={{ minWidth: 0, flex: 1, px: { xs: 0.5, md: 1 } }}>
      <Typography
        color="text.secondary"
        fontWeight={600}
        sx={{ fontSize: 11, lineHeight: 1.25, letterSpacing: 0.15 }}
      >
        {period.label}
      </Typography>
      <Typography
        fontWeight={800}
        sx={{
          mt: 0.5,
          fontSize: { xs: '1.2rem', md: '1.35rem' },
          lineHeight: 1.15,
          letterSpacing: -0.35,
          color: 'text.primary',
        }}
      >
        {period.value}
      </Typography>
      {period.delta !== undefined ? (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }} useFlexGap>
          <Typography fontWeight={700} sx={{ fontSize: 11, lineHeight: 1.2, color: deltaTone }}>
            {formatDelta(period.delta)}
          </Typography>
          {period.deltaLabel ? (
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 11,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {period.deltaLabel}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
      {period.targetLabel ? (
        <Typography color="text.secondary" sx={{ mt: 0.35, fontSize: 10, lineHeight: 1.2 }}>
          {period.targetLabel}
        </Typography>
      ) : null}
    </Box>
  )
}

function RevenueHeroCard({
  revenue,
  loading,
}: {
  revenue: SuperAdminRevenueHero
  loading?: boolean
}) {
  return (
    <ExecutiveCard density="compact" elevation="flat" loading={loading} aria-label="Revenue">
      <Typography
        color="text.secondary"
        fontWeight={600}
        sx={{ fontSize: 11, lineHeight: 1.25, letterSpacing: 0.15, mb: 0.75 }}
      >
        Revenue vs target
      </Typography>
      <Stack
        direction="row"
        alignItems="stretch"
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ width: '100%' }}
      >
        <PeriodColumn period={revenue.today} />
        <PeriodColumn period={revenue.mtd} />
        <PeriodColumn period={revenue.ytd} />
      </Stack>
    </ExecutiveCard>
  )
}

function BlockedCashCard({
  blockedCash,
  loading,
}: {
  blockedCash: SuperAdminBlockedCash
  loading?: boolean
}) {
  return (
    <ExecutiveCard density="compact" elevation="flat" loading={loading} aria-label="Cash blocked">
      <Typography
        color="text.secondary"
        fontWeight={600}
        sx={{ fontSize: 11, lineHeight: 1.25, letterSpacing: 0.15 }}
      >
        Cash blocked · Embassy / VFS
      </Typography>
      <Typography
        fontWeight={800}
        sx={{ mt: 0.5, fontSize: '1.35rem', lineHeight: 1.15, letterSpacing: -0.35 }}
      >
        {blockedCash.amount}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        {blockedCash.applicationCount} apps · {blockedCash.expectedReleaseLabel}
      </Typography>
    </ExecutiveCard>
  )
}

/** Super Admin hero — revenue vs target, blocked cash, supporting KPIs. */
export function SuperAdminHeroStrip({
  revenue,
  items,
  blockedCash,
  loading,
}: SuperAdminHeroStripProps) {
  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        How is the business performing?
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: blockedCash ? 5 : 6 }}>
          <RevenueHeroCard revenue={revenue} loading={loading} />
        </Grid>
        {blockedCash ? (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <BlockedCashCard blockedCash={blockedCash} loading={loading} />
          </Grid>
        ) : null}
        {items.map((kpi) => (
          <Grid key={kpi.id} size={{ xs: 6, sm: 4, md: 2 }}>
            <HeroMetric
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaLabel={kpi.deltaLabel}
              loading={loading}
              animate
            />
          </Grid>
        ))}
      </Grid>
    </InsightStack>
  )
}
