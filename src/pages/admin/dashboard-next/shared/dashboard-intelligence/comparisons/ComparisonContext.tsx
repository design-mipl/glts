import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ComparisonSelection, IntelligenceComparisonMode } from '../types'

export const COMPARISON_PRESETS: Array<{
  mode: IntelligenceComparisonMode
  label: string
  primaryLabel: string
  secondaryLabel: string
}> = [
  {
    mode: 'previous-period',
    label: 'Current vs previous period',
    primaryLabel: 'Current period',
    secondaryLabel: 'Previous period',
  },
  {
    mode: 'previous-year',
    label: 'Current year vs last year',
    primaryLabel: 'This year',
    secondaryLabel: 'Last year',
  },
  {
    mode: 'branch-vs-branch',
    label: 'Branch vs branch',
    primaryLabel: 'Branch A',
    secondaryLabel: 'Branch B',
  },
  {
    mode: 'country-vs-country',
    label: 'Country vs country',
    primaryLabel: 'Country A',
    secondaryLabel: 'Country B',
  },
  {
    mode: 'segment-vs-segment',
    label: 'Marine vs Corporate',
    primaryLabel: 'Marine',
    secondaryLabel: 'Corporate',
  },
  {
    mode: 'client-vs-client',
    label: 'Client vs client',
    primaryLabel: 'Client A',
    secondaryLabel: 'Client B',
  },
]

export interface ComparisonContextValue {
  comparison: ComparisonSelection
  setComparisonMode: (mode: IntelligenceComparisonMode) => void
  setComparisonKeys: (primaryKey?: string, secondaryKey?: string) => void
  clearComparison: () => void
}

const ComparisonContext = createContext<ComparisonContextValue | null>(null)

const NONE: ComparisonSelection = {
  mode: 'none',
  primaryLabel: 'Current',
  secondaryLabel: 'Baseline',
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparison, setComparison] = useState<ComparisonSelection>(NONE)

  const setComparisonMode = useCallback((mode: IntelligenceComparisonMode) => {
    if (mode === 'none') {
      setComparison(NONE)
      return
    }
    const preset = COMPARISON_PRESETS.find((item) => item.mode === mode)
    setComparison({
      mode,
      primaryLabel: preset?.primaryLabel ?? 'Primary',
      secondaryLabel: preset?.secondaryLabel ?? 'Secondary',
    })
  }, [])

  const setComparisonKeys = useCallback((primaryKey?: string, secondaryKey?: string) => {
    setComparison((prev) => ({ ...prev, primaryKey, secondaryKey }))
  }, [])

  const clearComparison = useCallback(() => setComparison(NONE), [])

  const value = useMemo(
    () => ({ comparison, setComparisonMode, setComparisonKeys, clearComparison }),
    [clearComparison, comparison, setComparisonKeys, setComparisonMode],
  )

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>
}

export function useComparison(): ComparisonContextValue {
  const ctx = useContext(ComparisonContext)
  if (!ctx) throw new Error('useComparison must be used within ComparisonProvider')
  return ctx
}

export function useComparisonOptional(): ComparisonContextValue | null {
  return useContext(ComparisonContext)
}
