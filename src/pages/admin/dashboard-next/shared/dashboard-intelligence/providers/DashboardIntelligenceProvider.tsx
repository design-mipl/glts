import type { ReactNode } from 'react'
import { DashboardFilterProvider } from '../filters'
import type { DashboardIntelligenceFilters, IntelligenceFilterFieldConfig } from '../types'
import { DrilldownProvider } from '../drilldown'
import { ComparisonProvider } from '../comparisons'
import { RefreshProvider } from '../refresh'

export interface DashboardIntelligenceProviderProps {
  children: ReactNode
  initialFilters?: Partial<DashboardIntelligenceFilters>
  filterFields?: IntelligenceFilterFieldConfig[]
  onFiltersChange?: (filters: DashboardIntelligenceFilters) => void
  onRefresh?: () => void | Promise<void>
  autoRefreshMs?: number | null
}

/**
 * Composes filter + drilldown + comparison + refresh contexts.
 * Dashboards wrap once; widgets remain isolated.
 */
export function DashboardIntelligenceProvider({
  children,
  initialFilters,
  filterFields,
  onFiltersChange,
  onRefresh,
  autoRefreshMs = null,
}: DashboardIntelligenceProviderProps) {
  return (
    <DashboardFilterProvider
      initialFilters={initialFilters}
      fields={filterFields}
      onFiltersChange={onFiltersChange}
    >
      <ComparisonProvider>
        <DrilldownProvider>
          <RefreshProvider onRefresh={onRefresh} autoRefreshMs={autoRefreshMs}>
            {children}
          </RefreshProvider>
        </DrilldownProvider>
      </ComparisonProvider>
    </DashboardFilterProvider>
  )
}
