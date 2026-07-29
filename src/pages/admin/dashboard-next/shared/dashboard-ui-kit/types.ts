/**
 * Dashboard UI Kit — shared contracts.
 * Presentational only. No data fetching. No dashboard/widget business logic.
 */

import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'

/** Async / access presentation states every kit surface should support. */
export type UiKitViewState = 'ready' | 'loading' | 'empty' | 'error' | 'restricted'

export interface UiKitStateProps {
  loading?: boolean
  empty?: boolean
  error?: boolean
  /** When false, render nothing (permission restricted). */
  permission?: boolean
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  errorTitle?: string
  errorDescription?: string
  restrictedTitle?: string
  restrictedDescription?: string
}

export type UiKitDensity = 'comfortable' | 'compact'
export type UiKitElevation = 'flat' | 'raised' | 'overlay'
export type UiKitWidth = 'auto' | 'full' | 'hero'

export interface UiKitCommonProps extends UiKitStateProps {
  className?: string
  sx?: SxProps<Theme>
  children?: ReactNode
  'aria-label'?: string
}

export interface UiKitSectionProps extends UiKitCommonProps {
  title?: string
  subtitle?: string
  question?: string
  action?: ReactNode
  id?: string
}

export interface UiKitMetricValue {
  label: string
  value: string | number
  helperText?: string
  delta?: number
  deltaLabel?: string
  icon?: ReactNode
  tone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'info'
}

export interface UiKitListItem {
  id: string
  primary: string
  secondary?: string
  meta?: string
  badgeLabel?: string
  badgeTone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'info' | 'primary'
  icon?: ReactNode
  onClick?: () => void
}

export interface UiKitRankItem extends UiKitListItem {
  rank?: number
  value?: string | number
  progress?: number
}
