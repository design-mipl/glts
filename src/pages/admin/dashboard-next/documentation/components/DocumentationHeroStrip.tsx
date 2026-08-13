import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  ClipboardList,
  FileText,
  Package,
  PackageCheck,
  Receipt,
  Send,
  Truck,
} from 'lucide-react'
import { ExecutiveGrid, HeroMetric, InsightStack } from '../../shared/dashboard-ui-kit'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { kpiColumns } from '../../shared/utils/kpiColumns'

const KPI_ICONS: Record<string, ReactNode> = {
  submission_pending: <Send size={16} />,
  form_pending: <FileText size={16} />,
  pending_payment: <Receipt size={16} />,
  vfs_submission_pending: <ClipboardList size={16} />,
  collection_pending: <Package size={16} />,
  collected: <PackageCheck size={16} />,
  dispatched: <Truck size={16} />,
}

function kpiTone(id: string): 'positive' | 'negative' | 'warning' | 'info' | 'neutral' {
  if (id === 'submission_pending' || id === 'form_pending') return 'warning'
  if (id === 'pending_payment' || id === 'collection_pending') return 'info'
  if (id === 'collected' || id === 'dispatched') return 'positive'
  if (id === 'vfs_submission_pending') return 'info'
  return 'neutral'
}

export interface DocumentationHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
  onKpiClick?: (kpiId: string) => void
}

/** Docs hero KPIs — AM portal queue/status labels (desk + post-submit visibility). */
export function DocumentationHeroStrip({
  items,
  loading,
  onKpiClick,
}: DocumentationHeroStripProps) {
  const drilldown = useDrilldownOptional()

  const openKpi = (kpi: DashboardKpiItem) => {
    onKpiClick?.(kpi.id)
    drilldown?.openDrilldown({
      id: `documentation-kpi-${kpi.id}`,
      title: kpi.label,
      subtitle: 'Documentation hero KPI',
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
      <ExecutiveGrid columns={kpiColumns(items.length)} spacing={1}>
        {items.map((kpi) => (
          <Box
            key={kpi.id}
            role="button"
            tabIndex={0}
            aria-label={`${kpi.label}: ${kpi.value}`}
            onClick={() => openKpi(kpi)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openKpi(kpi)
              }
            }}
            sx={{
              cursor: 'pointer',
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
              tone={kpiTone(kpi.id)}
              loading={loading}
              animate
            />
          </Box>
        ))}
      </ExecutiveGrid>
    </InsightStack>
  )
}
