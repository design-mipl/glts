import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  AlertTriangle,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileStack,
  Package,
  Plane,
  UserPlus,
} from 'lucide-react'
import { ExecutiveGrid, HeroMetric, InsightStack } from '../../shared/dashboard-ui-kit'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { kpiColumns } from '../../shared/utils/kpiColumns'
import {
  opsApplicationListPath,
  opsAssignmentPath,
} from '../utils/opsSegmentPaths'

const KPI_ICONS: Record<string, ReactNode> = {
  'kpi-total-applications': <FileStack size={16} />,
  'kpi-total-verification': <ClipboardList size={16} />,
  'kpi-verification': <ClipboardList size={16} />,
  'kpi-recheck': <ClipboardCheck size={16} />,
  'kpi-payment': <CreditCard size={16} />,
  'kpi-arrange': <Plane size={16} />,
  'kpi-assignment': <UserPlus size={16} />,
  'kpi-submission': <Package size={16} />,
}

function kpiTone(id: string, delta?: number): 'positive' | 'negative' | 'warning' | 'info' | 'neutral' {
  if (id === 'kpi-payment' || id === 'kpi-recheck') return 'warning'
  if (id === 'kpi-assignment') return 'negative'
  if (
    id === 'kpi-total-applications' ||
    id === 'kpi-total-verification' ||
    id === 'kpi-verification' ||
    id === 'kpi-arrange'
  ) {
    return 'info'
  }
  if (id === 'kpi-submission') return 'neutral'
  if (delta != null && delta > 0) return 'warning'
  if (delta != null && delta < 0) return 'positive'
  return 'neutral'
}

/** Hero KPI → live module (assignment-priority or application-management). */
export function opsHeroKpiHref(kpiId: string): string {
  switch (kpiId) {
    case 'kpi-assignment':
      return opsAssignmentPath('retail')
    case 'kpi-payment':
      return opsApplicationListPath('marine', 'pending_payment')
    case 'kpi-submission':
      return opsApplicationListPath('marine', 'online_submission_pending')
    case 'kpi-total-applications':
      return opsApplicationListPath('marine')
    case 'kpi-total-verification':
    case 'kpi-verification':
    case 'kpi-recheck':
    case 'kpi-arrange':
    default:
      return opsApplicationListPath('marine', 'verification_pending')
  }
}

export interface OperationsHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
  onNavigate?: (href: string) => void
}

/** Operations hero KPIs — click opens the owning module (not a dashboard tab). */
export function OperationsHeroStrip({ items, loading, onNavigate }: OperationsHeroStripProps) {
  const openKpi = (kpi: DashboardKpiItem) => {
    onNavigate?.(opsHeroKpiHref(kpi.id))
  }

  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <ExecutiveGrid columns={kpiColumns(items.length)} spacing={1}>
        {items.map((kpi) => (
          <Box
            key={kpi.id}
            role={onNavigate ? 'button' : undefined}
            tabIndex={onNavigate ? 0 : undefined}
            aria-label={`${kpi.label}: ${kpi.value}${kpi.deltaLabel ? ` — ${kpi.deltaLabel}` : ''}`}
            onClick={() => openKpi(kpi)}
            onKeyDown={(event) => {
              if (!onNavigate) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openKpi(kpi)
              }
            }}
            sx={{
              cursor: onNavigate ? 'pointer' : 'default',
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
              icon={KPI_ICONS[kpi.id] ?? <AlertTriangle size={16} />}
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
