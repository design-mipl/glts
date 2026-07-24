import { useState, type ReactNode } from 'react'
import { Stack } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { DashboardShell } from '../components/DashboardShell'
import type { DashboardShellProps } from '../components/DashboardShell'
import type { DashboardTabDefinition } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import {
  DashboardFilterBar,
  DashboardIntelligenceProvider,
  DrilldownHost,
  ExecutiveSearch,
  RefreshIndicator,
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
  searchItems = [],
  extraActions,
  filterDensity = 'compact',
  legacyFilters,
  ...shellProps
}: DashboardWorkspaceProps) {
  const { activeTab, setActiveTab } = useWorkspaceTabState(workspaceId, defaultTab)
  const [searchOpen, setSearchOpen] = useState(false)

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
          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
            <RefreshIndicator compact />
            <Button
              label="Search"
              variant="outlined"
              size="sm"
              onClick={() => setSearchOpen(true)}
            />
            {extraActions}
          </Stack>
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
      <ExecutiveSearch items={searchItems} open={searchOpen} onOpenChange={setSearchOpen} />
    </DashboardIntelligenceProvider>
  )
}
