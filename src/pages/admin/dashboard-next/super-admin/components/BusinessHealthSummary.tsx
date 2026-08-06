import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  CircleCheck,
  HandCoins,
  IndianRupee,
  FileStack,
  TrendingUp,
} from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { Tooltip } from '@/design-system/UIComponents'
import { TrendMetric } from '../../shared/dashboard-ui-kit'
import type { SuperAdminDashboardData } from '../types'

export interface BusinessHealthSummaryProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onOpenTab?: (tabId: string) => void
}

function iconBox(icon: ReactNode, tone: 'info' | 'positive' | 'warning' | 'primary') {
  const bgcolor =
    tone === 'positive'
      ? 'success.main'
      : tone === 'warning'
        ? 'warning.main'
        : tone === 'info'
          ? 'info.main'
          : 'primary.main'
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: 1,
        display: 'grid',
        placeItems: 'center',
        bgcolor,
        color: 'common.white',
        opacity: 0.92,
      }}
    >
      {icon}
    </Box>
  )
}

function collectionEfficiency(data: SuperAdminDashboardData): number {
  const points = data.revenueTrend
  const gross = points.reduce((s, p) => s + p.value, 0)
  const collected = points.reduce((s, p) => s + (p.secondary ?? 0), 0)
  if (gross <= 0) return 0
  return Math.round((collected / gross) * 1000) / 10
}

/** Compact executive trend cards — no segment mix. */
export function BusinessHealthSummary({
  data,
  loading,
  onOpenTab,
}: BusinessHealthSummaryProps) {
  const colors = usePublicBrandColors()
  const appKpi = data.heroKpis.find((k) => k.id === 'applications')
  const efficiency = collectionEfficiency(data)
  const efficiencyDelta =
    data.collectionsHero.mtd.delta != null && data.revenueHero.mtd.delta != null
      ? Math.round((data.collectionsHero.mtd.delta - data.revenueHero.mtd.delta) * 10) / 10
      : undefined

  const cards = [
    {
      id: 'revenue',
      label: 'Revenue trend',
      value:
        data.revenueHero.mtd.delta != null
          ? `${data.revenueHero.mtd.delta > 0 ? '+' : ''}${data.revenueHero.mtd.delta}%`
          : '—',
      delta: data.revenueHero.mtd.delta,
      deltaLabel: data.revenueHero.mtd.deltaLabel ?? 'vs prior period',
      tone:
        (data.revenueHero.mtd.delta ?? 0) >= 0
          ? ('positive' as const)
          : ('negative' as const),
      icon: iconBox(<IndianRupee size={14} />, 'primary'),
          tooltip: `Gross (invoiced) revenue MTD ${data.revenueHero.mtd.value}`,
      tab: 'finance',
    },
    {
      id: 'applications',
      label: 'Application trend',
      value:
        appKpi?.delta != null
          ? `${appKpi.delta > 0 ? '+' : ''}${appKpi.delta}%`
          : `${data.executiveSummary.activeApplications.total}`,
      delta: appKpi?.delta,
      deltaLabel: appKpi?.deltaLabel ?? 'vs prior period',
      tone: 'info' as const,
      icon: iconBox(<FileStack size={14} />, 'info'),
      tooltip: `${data.executiveSummary.activeApplications.total} active applications`,
      tab: 'operations',
    },
    {
      id: 'approval',
      label: 'Visa approval trend',
      value: data.executiveSummary.approvalRate.value,
      delta: data.executiveSummary.approvalRate.delta,
      deltaLabel: data.executiveSummary.approvalRate.deltaLabel ?? 'vs prior period',
      tone:
        (data.executiveSummary.approvalRate.delta ?? 0) >= 0
          ? ('positive' as const)
          : ('negative' as const),
      icon: iconBox(<CircleCheck size={14} />, 'positive'),
      tooltip: 'Rolling approval rate',
      tab: 'analytics',
    },
    {
      id: 'efficiency',
      label: 'Collection efficiency',
      value: `${efficiency}%`,
      delta: efficiencyDelta,
      deltaLabel: 'vs revenue growth gap',
      tone: efficiency >= 80 ? ('positive' as const) : efficiency >= 65 ? ('warning' as const) : ('negative' as const),
      icon: iconBox(<HandCoins size={14} />, 'warning'),
      tooltip: 'Collections ÷ Gross revenue × 100',
      tab: 'finance',
    },
  ]

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack spacing={0.5} sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <TrendingUp size={16} />
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Business health summary
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Growth signals · prior period comparison
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        {cards.map((card) => (
          <Tooltip key={card.id} content={card.tooltip} placement="left">
            <Box
              role="button"
              tabIndex={0}
              onClick={() => onOpenTab?.(card.tab)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenTab?.(card.tab)
                }
              }}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                transition: 'background-color 120ms ease',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <TrendMetric
                label={card.label}
                value={card.value}
                delta={card.delta}
                deltaLabel={card.deltaLabel}
                tone={card.tone}
                icon={card.icon}
                loading={loading}
              />
            </Box>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  )
}
