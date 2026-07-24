import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  Banknote,
  FileWarning,
  HandCoins,
  IndianRupee,
  Scale,
  Wallet,
} from 'lucide-react'
import { ExecutiveGrid, HeroMetric, InsightStack } from '../../shared/dashboard-ui-kit'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'

const KPI_ICONS: Record<string, ReactNode> = {
  'today-revenue': <IndianRupee size={16} />,
  outstanding: <Wallet size={16} />,
  'pending-collections': <HandCoins size={16} />,
  'pending-recon': <Scale size={16} />,
  'overdue-ar': <FileWarning size={16} />,
  'collected-mtd': <Banknote size={16} />,
}

function kpiTone(id: string, delta?: number): 'positive' | 'negative' | 'warning' | 'info' | 'neutral' {
  if (id === 'overdue-ar' || id === 'outstanding') return 'warning'
  if (id === 'pending-collections' || id === 'pending-recon') return 'warning'
  if (id === 'collected-mtd' || id === 'today-revenue') return 'positive'
  if (delta != null && delta > 0) return 'info'
  if (delta != null && delta < 0) return 'positive'
  return 'neutral'
}

export interface AccountsHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
}

/** Accounts hero KPIs — dense HeroMetric + drilldown. */
export function AccountsHeroStrip({ items, loading }: AccountsHeroStripProps) {
  const drilldown = useDrilldownOptional()

  const openKpi = (kpi: DashboardKpiItem) => {
    drilldown?.openDrilldown({
      id: `accounts-kpi-${kpi.id}`,
      title: kpi.label,
      subtitle: 'Accounts hero KPI',
      entityType: 'kpi',
      entityId: kpi.id,
      meta: {
        value: kpi.value,
        delta: kpi.delta,
        comparison: kpi.deltaLabel,
      },
    })
  }

  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <ExecutiveGrid columns={items.length >= 6 ? 6 : 4} spacing={1}>
        {items.map((kpi) => (
          <Box
            key={kpi.id}
            role={drilldown ? 'button' : undefined}
            tabIndex={drilldown ? 0 : undefined}
            aria-label={`${kpi.label}: ${kpi.value}`}
            onClick={() => openKpi(kpi)}
            onKeyDown={(event) => {
              if (!drilldown) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openKpi(kpi)
              }
            }}
            sx={{
              cursor: drilldown ? 'pointer' : 'default',
              minWidth: 0,
              outline: 'none',
              '&:focus-visible': {
                borderRadius: 2,
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
              },
            }}
          >
            <HeroMetric
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaLabel={kpi.deltaLabel}
              icon={KPI_ICONS[kpi.id] ?? kpi.icon}
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
