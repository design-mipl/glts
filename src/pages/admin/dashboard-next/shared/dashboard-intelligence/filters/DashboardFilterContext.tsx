import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  DashboardIntelligenceFilters,
  IntelligenceFilterFieldConfig,
} from '../types'
import {
  DEFAULT_INTELLIGENCE_FILTER_FIELDS,
  DEFAULT_INTELLIGENCE_FILTERS,
  countActiveIntelligenceFilters,
} from './filterDefaults'

export interface DashboardFilterContextValue {
  filters: DashboardIntelligenceFilters
  fields: IntelligenceFilterFieldConfig[]
  activeCount: number
  setFilter: <K extends keyof DashboardIntelligenceFilters>(
    key: K,
    value: DashboardIntelligenceFilters[K],
  ) => void
  setFilters: (next: Partial<DashboardIntelligenceFilters>) => void
  setSearch: (search: string) => void
  resetFilters: () => void
}

const DashboardFilterContext = createContext<DashboardFilterContextValue | null>(null)

export interface DashboardFilterProviderProps {
  children: ReactNode
  initialFilters?: Partial<DashboardIntelligenceFilters>
  fields?: IntelligenceFilterFieldConfig[]
  onFiltersChange?: (filters: DashboardIntelligenceFilters) => void
}

export function DashboardFilterProvider({
  children,
  initialFilters,
  fields = DEFAULT_INTELLIGENCE_FILTER_FIELDS,
  onFiltersChange,
}: DashboardFilterProviderProps) {
  const [filters, setFiltersState] = useState<DashboardIntelligenceFilters>({
    ...DEFAULT_INTELLIGENCE_FILTERS,
    ...initialFilters,
  })

  const setFilter = useCallback(
    <K extends keyof DashboardIntelligenceFilters>(
      key: K,
      value: DashboardIntelligenceFilters[K],
    ) => {
      setFiltersState((prev) => {
        const next = { ...prev, [key]: value }
        onFiltersChange?.(next)
        return next
      })
    },
    [onFiltersChange],
  )

  const setFilters = useCallback(
    (partial: Partial<DashboardIntelligenceFilters>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...partial }
        onFiltersChange?.(next)
        return next
      })
    },
    [onFiltersChange],
  )

  const setSearch = useCallback(
    (search: string) => {
      setFiltersState((prev) => {
        const next = { ...prev, search }
        onFiltersChange?.(next)
        return next
      })
    },
    [onFiltersChange],
  )

  const resetFilters = useCallback(() => {
    const next = { ...DEFAULT_INTELLIGENCE_FILTERS }
    setFiltersState(next)
    onFiltersChange?.(next)
  }, [onFiltersChange])

  const value = useMemo<DashboardFilterContextValue>(
    () => ({
      filters,
      fields,
      activeCount: countActiveIntelligenceFilters(filters),
      setFilter,
      setFilters,
      setSearch,
      resetFilters,
    }),
    [fields, filters, resetFilters, setFilter, setFilters, setSearch],
  )

  return (
    <DashboardFilterContext.Provider value={value}>{children}</DashboardFilterContext.Provider>
  )
}

export function useDashboardFilters(): DashboardFilterContextValue {
  const ctx = useContext(DashboardFilterContext)
  if (!ctx) {
    throw new Error('useDashboardFilters must be used within DashboardFilterProvider')
  }
  return ctx
}

/** Safe optional consumer — returns null outside provider (widgets stay optional). */
export function useDashboardFiltersOptional(): DashboardFilterContextValue | null {
  return useContext(DashboardFilterContext)
}
