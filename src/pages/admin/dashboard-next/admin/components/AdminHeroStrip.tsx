import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  IndianRupee,
  ShieldAlert,
  Timer,
} from 'lucide-react'
import { ExecutiveGrid, HeroMetric, InsightStack } from '../../shared/dashboard-ui-kit'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'

const KPI_ICONS: Record<string, ReactNode> = {
  'open-cases': <FileText size={16} />,
  'sla-at-risk': <ShieldAlert size={16} />,
  'completed-today': <CheckCircle2 size={16} />,
  'revenue-mtd': <IndianRupee size={16} />,
  'verification-backlog': <ClipboardList size={16} />,
  'avg-cycle': <Timer size={16} />,
}

function kpiTone(delta?: number): 'positive' | 'negative' | 'warning' | 'neutral' {
  if (delta == null) return 'neutral'
  if (delta > 0) return 'positive'
  if (delta < 0) return 'negative'
  return 'neutral'
}

export interface AdminHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
}

/** Admin hero KPIs — dense HeroMetric + drilldown. */
export function AdminHeroStrip({ items, loading }: AdminHeroStripProps) {
  const drilldown = useDrilldownOptional()

  const openKpi = (kpi: DashboardKpiItem) => {
    drilldown?.openDrilldown({
      id: `admin-kpi-${kpi.id}`,
      title: kpi.label,
      subtitle: 'Admin hero KPI',
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
        {items.map((kpi) => {
          const tone =
            kpi.id === 'sla-at-risk' || kpi.id === 'verification-backlog'
              ? 'warning'
              : kpiTone(kpi.delta)
          return (
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
                tone={tone}
                loading={loading}
                animate
              />
            </Box>
          )
        })}
      </ExecutiveGrid>
    </InsightStack>
  )
}
