import { createContext, useContext, type ReactNode } from 'react'

export type CountryWorkspaceMode = 'view' | 'edit'

interface CountryWorkspaceModeContextValue {
  mode: CountryWorkspaceMode
  readOnly: boolean
}

const CountryWorkspaceModeContext = createContext<CountryWorkspaceModeContextValue | null>(null)

interface CountryWorkspaceModeProviderProps {
  mode: CountryWorkspaceMode
  children: ReactNode
}

export function CountryWorkspaceModeProvider({ mode, children }: CountryWorkspaceModeProviderProps) {
  return (
    <CountryWorkspaceModeContext.Provider value={{ mode, readOnly: mode === 'view' }}>
      {children}
    </CountryWorkspaceModeContext.Provider>
  )
}

export function useCountryWorkspaceMode() {
  const context = useContext(CountryWorkspaceModeContext)
  if (!context) {
    throw new Error('useCountryWorkspaceMode must be used within CountryWorkspaceModeProvider')
  }
  return context
}
