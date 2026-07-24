import type { ReactNode } from 'react'

/** Shared async status for dashboard hooks/services. */
export type DashboardQueryStatus = 'idle' | 'loading' | 'success' | 'error'

export interface DashboardQueryState<T> {
  status: DashboardQueryStatus
  data: T | null
  error: string | null
}

export interface DashboardFilterOption {
  label: string
  value: string
}

export interface DashboardFilterConfig {
  id: string
  label: string
  options: DashboardFilterOption[]
  value: string
  onChange: (value: string) => void
}

export interface DashboardKpiItem {
  id: string
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  icon?: ReactNode
  sparklineData?: number[]
}

export type DashboardAlertSeverity = 'critical' | 'warning' | 'info' | 'success'

export interface DashboardAlertItem {
  id: string
  title: string
  description?: string
  severity: DashboardAlertSeverity
  count?: number
  onClick?: () => void
}

export interface DashboardQuickActionItem {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  badge?: string
  onClick?: () => void
  disabled?: boolean
}

export interface DashboardTabDefinition {
  id: string
  label: string
  content: ReactNode
  hidden?: boolean
  disabled?: boolean
  icon?: ReactNode
}

export type DashboardStatusTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

export interface DashboardProgressItem {
  id: string
  label: string
  value: number
  helperText?: string
}
