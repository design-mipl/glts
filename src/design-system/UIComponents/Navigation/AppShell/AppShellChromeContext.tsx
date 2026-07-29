import { createContext, useContext, type ReactNode } from 'react'

export interface AppShellChromeContextValue {
  openCommandPalette: () => void
}

const AppShellChromeContext = createContext<AppShellChromeContextValue | null>(null)

export function AppShellChromeProvider({
  value,
  children,
}: {
  value: AppShellChromeContextValue
  children: ReactNode
}) {
  return (
    <AppShellChromeContext.Provider value={value}>{children}</AppShellChromeContext.Provider>
  )
}

/** Opens the shell command palette when rendered inside AppShell. */
export function useAppShellChrome(): AppShellChromeContextValue {
  const ctx = useContext(AppShellChromeContext)
  return (
    ctx ?? {
      openCommandPalette: () => undefined,
    }
  )
}
