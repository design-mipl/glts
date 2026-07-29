import type { ReactNode } from 'react'
import { Stack } from '@mui/material'
import { DashboardShell } from '../components/DashboardShell'
import type { DashboardShellProps } from '../components/DashboardShell'
import type { DashboardTabDefinition } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import {
  DashboardFilterBar,
  DashboardIntelligenceProvider,
  DrilldownHost,
  type DashboardIntelligenceFilters,
  type ExecutiveSearchItem,
  type IntelligenceFilterFieldConfig,
} from '../dashboard-intelligence'
import { useWorkspaceTabState } from './useWorkspaceTabState'

export interface DashboardWorkspaceProps
  extends Omit<
    DashboardShellProps,
    | 'filters'
    | 'tabs'
    | 'defaultTab'
    | 'kpis'
    | 'alerts'
    | 'actions'
    | 'tabValue'
    | 'onTabChange'
    | 'denseChrome'
  > {
  /** Stable id for tab memory + deep links. */
  workspaceId: string
  tabs: DashboardTabDefinition[]
  defaultTab: string
  /** Hero KPIs above sticky tabs. Executive row lives inside Overview tab content. */
  hero?: ReactNode
  initialFilters?: Partial<DashboardIntelligenceFilters>
  filterFields?: IntelligenceFilterFieldConfig[]
  onFiltersChange?: (filters: DashboardIntelligenceFilters) => void
  onRefresh?: () => void | Promise<void>
  /** Retained for callers; header search control removed. */
  searchItems?: ExecutiveSearchItem[]
  extraActions?: ReactNode
  filterDensity?: 'compact' | 'full'
  /** Optional legacy filters if intelligence bar should be supplemented. */
  legacyFilters?: ReactNode
}

/**
 * Standard Dashboard Next workspace:
 * Dense header → collapsible filters → Hero KPIs → Sticky tabs
 * (Overview tab owns alerts / primary viz / quick actions).
 */
export function DashboardWorkspace({
  workspaceId,
  tabs,
  defaultTab,
  hero,
  initialFilters,
  filterFields,
  onFiltersChange,
  onRefresh,
  searchItems: _searchItems = [],
  extraActions,
  filterDensity = 'compact',
  legacyFilters,
  ...shellProps
}: DashboardWorkspaceProps) {
  const { activeTab, setActiveTab } = useWorkspaceTabState(workspaceId, defaultTab)

  return (
    <DashboardIntelligenceProvider
      initialFilters={initialFilters}
      filterFields={filterFields}
      onFiltersChange={onFiltersChange}
      onRefresh={onRefresh}
    >
      <DashboardShell
        {...shellProps}
        denseChrome
        actions={
          extraActions ? (
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              {extraActions}
            </Stack>
          ) : undefined
        }
        filters={
          <Stack spacing={DASHBOARD_SPACING.field}>
            <DashboardFilterBar
              density={filterDensity}
              layout="toolbar"
              collapsible
              defaultExpanded={false}
              sticky={false}
              showSearch={false}
              showReset
            />
            {legacyFilters}
          </Stack>
        }
        kpis={hero}
        tabs={tabs}
        defaultTab={defaultTab}
        tabValue={activeTab}
        onTabChange={setActiveTab}
      />
      <DrilldownHost />
    </DashboardIntelligenceProvider>
  )
}
