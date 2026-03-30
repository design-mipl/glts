import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import GlobalSearch from './index'
import type { SearchResults } from '../types'

interface GlobalSearchContextValue {
  openSearch: () => void
}

const GlobalSearchContext = createContext<GlobalSearchContextValue>({ openSearch: () => {} })

export interface GlobalSearchProviderProps {
  children: ReactNode
  onSearch?: (query: string) => Promise<SearchResults>
}

export function GlobalSearchProvider({ children, onSearch }: GlobalSearchProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <GlobalSearchContext.Provider value={{ openSearch: () => setOpen(true) }}>
      {children}
      <GlobalSearch open={open} onClose={() => setOpen(false)} onSearch={onSearch} />
    </GlobalSearchContext.Provider>
  )
}

export function useGlobalSearch() {
  return useContext(GlobalSearchContext)
}
