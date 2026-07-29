import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  Calendar,
  ClipboardCheck,
  FileCheck,
  FileStack,
  FileText,
  FormInput,
  Receipt,
  Send,
} from 'lucide-react'
import { ExecutiveGrid, HeroMetric, InsightStack } from '../../shared/dashboard-ui-kit'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'

const KPI_ICONS: Record<string, ReactNode> = {
  my_applications: <FileStack size={16} />,
  incomplete_documents: <FileText size={16} />,
  pending_review: <ClipboardCheck size={16} />,
  forms_today: <FormInput size={16} />,
  fees_today: <Receipt size={16} />,
  appointments_today: <Calendar size={16} />,
  ready_submit: <FileCheck size={16} />,
  submission_pending: <Send size={16} />,
}

function kpiTone(id: string): 'positive' | 'negative' | 'warning' | 'info' | 'neutral' {
  if (id === 'submission_pending' || id === 'incomplete_documents') return 'warning'
  if (id === 'pending_review') return 'warning'
  if (id === 'ready_submit') return 'positive'
  if (id === 'forms_today' || id === 'fees_today') return 'info'
  return 'neutral'
}

export interface DocumentationHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
}

/** Documentation hero KPIs — HeroMetric with due today / overdue in deltaLabel. */
export function DocumentationHeroStrip({ items, loading }: DocumentationHeroStripProps) {
  const drilldown = useDrilldownOptional()

  const openKpi = (kpi: DashboardKpiItem) => {
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
      <ExecutiveGrid columns={items.length >= 6 ? 4 : 4} spacing={1}>
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
