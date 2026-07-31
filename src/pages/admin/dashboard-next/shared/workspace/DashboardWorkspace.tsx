import { useMemo, useState, type ReactNode } from 'react'
import { Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Search } from 'lucide-react'
import { IconButton } from '@/design-system/UIComponents'
import { DashboardShell } from '../components/DashboardShell'
import type { DashboardShellProps } from '../components/DashboardShell'
import type { DashboardTabDefinition } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import {
  DashboardFilterBar,
  DashboardIntelligenceProvider,
  DrilldownHost,
  ExecutiveSearch,
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
  /** Command-palette search items (Ctrl/Cmd+K + desktop header search icon). */
  searchItems?: ExecutiveSearchItem[]
  /** Optional header actions beside the search icon. */
  extraActions?: ReactNode
  filterDensity?: 'compact' | 'full'
  /** Optional legacy filters if intelligence bar should be supplemented. */
  legacyFilters?: ReactNode
}

/**
 * Standard Dashboard Next workspace:
 * Dense header (desktop search icon) → collapsible filters → Hero KPIs → Sticky tabs
 * (Overview tab owns alerts / primary viz / quick actions).
 * Mobile omits the page search icon — AppShell top header already provides search.
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
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('desktop'))
  const validTabIds = useMemo(
    () => tabs.filter((t) => !t.hidden).map((t) => t.id),
    [tabs],
  )
  const { activeTab, setActiveTab } = useWorkspaceTabState(
    workspaceId,
    defaultTab,
    validTabIds,
  )
  const [searchOpen, setSearchOpen] = useState(false)

  const headerActions =
    isDesktop || extraActions ? (
      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
        {isDesktop ? (
          <IconButton
            icon={<Search size={16} strokeWidth={1.75} />}
            tooltip="Search"
            variant="soft"
            color="primary"
            size="sm"
            onClick={() => setSearchOpen(true)}
            aria-label="Open dashboard search"
          />
        ) : null}
        {extraActions}
      </Stack>
    ) : undefined

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
        actions={headerActions}
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
      <ExecutiveSearch
        items={searchItems}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        hotkey={isDesktop}
      />
      <DrilldownHost />
    </DashboardIntelligenceProvider>
  )
}
