import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileStack,
  Package,
  Plane,
  Send,
  Truck,
  UserPlus,
} from 'lucide-react'
import { ExecutiveGrid, HeroMetric, InsightStack } from '../../shared/dashboard-ui-kit'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { kpiColumns } from '../../shared/utils/kpiColumns'
import {
  opsApplicationListPath,
  opsAssignmentPath,
  type OpsApplicationQueueTab,
} from '../utils/opsSegmentPaths'

const KPI_ICONS: Record<string, ReactNode> = {
  'kpi-total-applications': <FileStack size={16} />,
  'kpi-total-verification': <ClipboardList size={16} />,
  'kpi-verification': <ClipboardList size={16} />,
  'kpi-recheck': <ClipboardCheck size={16} />,
  'kpi-payment': <CreditCard size={16} />,
  'kpi-arrange': <Plane size={16} />,
  'kpi-physical-originals': <Package size={16} />,
  'kpi-assignment': <UserPlus size={16} />,
  'kpi-online-submission': <Send size={16} />,
  'kpi-vfs-submission': <Building2 size={16} />,
  'kpi-collection-pending': <Package size={16} />,
  'kpi-collected': <CheckCircle2 size={16} />,
  'kpi-dispatched': <Truck size={16} />,
}

const KPI_AM_TAB: Partial<Record<string, OpsApplicationQueueTab>> = {
  'kpi-payment': 'pending_payment',
  'kpi-online-submission': 'online_submission_pending',
  'kpi-vfs-submission': 'vfs_submission_pending',
  'kpi-collection-pending': 'collection_pending',
  'kpi-collected': 'collected',
  'kpi-dispatched': 'dispatched',
  'kpi-total-verification': 'verification_pending',
  'kpi-verification': 'verification_pending',
  'kpi-recheck': 'verification_pending',
  'kpi-arrange': 'verification_pending',
}

function kpiTone(id: string, delta?: number): 'positive' | 'negative' | 'warning' | 'info' | 'neutral' {
  if (
    id === 'kpi-payment' ||
    id === 'kpi-recheck' ||
    id === 'kpi-collection-pending' ||
    id === 'kpi-physical-originals'
  ) {
    return 'warning'
  }
  if (id === 'kpi-assignment') return 'negative'
  if (
    id === 'kpi-total-applications' ||
    id === 'kpi-total-verification' ||
    id === 'kpi-verification' ||
    id === 'kpi-arrange' ||
    id === 'kpi-online-submission' ||
    id === 'kpi-vfs-submission'
  ) {
    return 'info'
  }
  if (id === 'kpi-collected' || id === 'kpi-dispatched') return 'positive'
  if (delta != null && delta > 0) return 'warning'
  if (delta != null && delta < 0) return 'positive'
  return 'neutral'
}

/** Hero KPI → live module (assignment-priority or application-management). */
export function opsHeroKpiHref(kpiId: string): string {
  if (kpiId === 'kpi-assignment') return opsAssignmentPath('retail')
  if (kpiId === 'kpi-total-applications') return opsApplicationListPath('marine')
  const tab = KPI_AM_TAB[kpiId]
  return tab ? opsApplicationListPath('marine', tab) : opsApplicationListPath('marine', 'verification_pending')
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
