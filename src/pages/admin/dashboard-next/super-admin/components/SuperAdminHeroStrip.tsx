import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Activity,
  AlertTriangle,
  Banknote,
  HeartPulse,
  Lock,
  Percent,
  Wallet,
} from 'lucide-react'
import { Tabs } from '@/design-system/UIComponents'
import {
  ExecutiveCard,
  ExecutiveGrid,
  HeroMetric,
  InsightStack,
  formatDelta,
} from '../../shared/dashboard-ui-kit'
import { DASHBOARD_SPACING } from '../../shared/constants'
import type { DashboardKpiItem } from '../../shared/types'
import { kpiColumns } from '../../shared/utils/kpiColumns'
import type {
  SuperAdminBlockedCash,
  SuperAdminPeriodHero,
  SuperAdminRevenuePeriod,
} from '../types'

export interface SuperAdminHeroStripProps {
  revenue: SuperAdminPeriodHero
  collections: SuperAdminPeriodHero
  items: DashboardKpiItem[]
  blockedCash?: SuperAdminBlockedCash
  loading?: boolean
}

type PeriodKey = 'today' | 'mtd' | 'ytd'

const PERIOD_OPTIONS: Array<{ value: PeriodKey; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'mtd', label: 'MTD' },
  { value: 'ytd', label: 'YTD' },
]

const KPI_ICONS: Record<string, ReactNode> = {
  'blocked-cash': <Lock size={16} />,
  health: <HeartPulse size={16} />,
  'gross-profit': <Percent size={16} />,
  outstanding: <Wallet size={16} />,
  applications: <Activity size={16} />,
  'approval-rate': <Banknote size={16} />,
  'at-risk': <AlertTriangle size={16} />,
}

function kpiTone(
  id: string,
  delta?: number,
): 'positive' | 'negative' | 'warning' | 'info' | 'neutral' {
  if (id === 'at-risk' || id === 'blocked-cash') return 'warning'
  if (id === 'outstanding') return delta != null && delta < 0 ? 'positive' : 'warning'
  if (id === 'health' || id === 'approval-rate' || id === 'gross-profit') return 'positive'
  if (id === 'applications') return 'info'
  if (delta != null && delta > 0) return 'positive'
  if (delta != null && delta < 0) return 'negative'
  return 'neutral'
}

/** HeroMetric-style card with Today/MTD/YTD toggle on this card only. */
function PeriodMetricCard({
  title,
  period,
  periodKey,
  onPeriodChange,
  loading,
}: {
  title: string
  period: SuperAdminRevenuePeriod
  periodKey: PeriodKey
  onPeriodChange: (next: PeriodKey) => void
  loading?: boolean
}) {
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
    <ExecutiveCard
      density="compact"
      elevation="flat"
      loading={loading}
      aria-label={`${title} ${period.label}`}
      sx={{ height: '100%' }}
    >
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={0.75}
          useFlexGap
        >
          <Typography
            color="text.secondary"
            fontWeight={600}
            sx={{ fontSize: 11, lineHeight: 1.25, letterSpacing: 0.15, flexShrink: 0 }}
          >
            {title}
          </Typography>
          <Tabs
            variant="pill"
            size="sm"
            value={periodKey}
            onChange={(value) => onPeriodChange(value as PeriodKey)}
            items={PERIOD_OPTIONS}
            scrollable={false}
            sx={{
              minHeight: 26,
              flexShrink: 0,
              '& .MuiTabs-root': { minHeight: 26 },
              '& .MuiTab-root': {
                minHeight: 26,
                minWidth: 0,
                px: 0.9,
                py: 0,
                fontSize: 10,
                fontWeight: 700,
              },
            }}
          />
        </Stack>

        <Typography
          fontWeight={800}
          sx={{
            fontSize: { xs: '1.35rem', md: '1.5rem' },
            lineHeight: 1.15,
            letterSpacing: -0.35,
            color: 'text.primary',
          }}
        >
          {period.value}
        </Typography>

        {period.delta !== undefined ? (
          <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap>
            <Typography fontWeight={700} sx={{ fontSize: 11, lineHeight: 1.2, color: deltaTone }}>
              {formatDelta(period.delta)}
            </Typography>
            {period.deltaLabel || period.targetLabel ? (
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
                {period.targetLabel ?? period.deltaLabel}
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </ExecutiveCard>
  )
}

/** Super Admin hero — shared HeroMetric cards; period toggles on Revenue + Collections only. */
export function SuperAdminHeroStrip({
  revenue,
  collections,
  items,
  blockedCash,
  loading,
}: SuperAdminHeroStripProps) {
  const [revenuePeriod, setRevenuePeriod] = useState<PeriodKey>('mtd')
  const [collectionsPeriod, setCollectionsPeriod] = useState<PeriodKey>('mtd')

  const otherMetrics = useMemo((): DashboardKpiItem[] => {
    const list: DashboardKpiItem[] = []
    if (blockedCash) {
      list.push({
        id: 'blocked-cash',
        label: 'Cash blocked · VFS',
        value: blockedCash.amount,
        deltaLabel: `${blockedCash.applicationCount} apps · ${blockedCash.expectedReleaseLabel}`,
      })
    }
    return [
      ...list,
      ...items.filter((item) => item.id !== 'collections'),
    ]
  }, [blockedCash, items])

  const columns = kpiColumns(otherMetrics.length + 2)

  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <ExecutiveGrid columns={columns} spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <PeriodMetricCard
            title="Revenue"
            period={revenue[revenuePeriod]}
            periodKey={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
            loading={loading}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <PeriodMetricCard
            title="Collections"
            period={collections[collectionsPeriod]}
            periodKey={collectionsPeriod}
            onPeriodChange={setCollectionsPeriod}
            loading={loading}
          />
        </Box>

        {otherMetrics.map((kpi) => (
          <Box key={kpi.id} sx={{ minWidth: 0 }} aria-label={`${kpi.label}: ${kpi.value}`}>
            <HeroMetric
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaLabel={kpi.deltaLabel}
              helperText={
                kpi.id === 'blocked-cash' && !kpi.delta ? kpi.deltaLabel : undefined
              }
              icon={KPI_ICONS[kpi.id]}
              tone={kpiTone(kpi.id, kpi.delta)}
              loading={loading}
              animate
            />
          </Box>
        ))}
      </ExecutiveGrid>
    </InsightStack>
  )
}
