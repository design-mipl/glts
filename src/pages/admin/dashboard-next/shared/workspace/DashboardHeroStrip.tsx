import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { QuickStats } from '../widgets'
import type { DashboardKpiItem } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import type { KpiColumnCount } from '../utils/kpiColumns'
import { kpiColumns } from '../utils/kpiColumns'

export interface DashboardHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
  onRetry?: () => void
  columns?: KpiColumnCount
  title?: string
  subtitle?: string
}

/** Standard hero metric strip above tabs — columns match item count (max 6). */
export function DashboardHeroStrip({
  items,
  loading,
  onRetry,
  columns,
  title,
  subtitle,
}: DashboardHeroStripProps) {
  return (
    <QuickStats
      title={title}
      subtitle={subtitle}
      items={items}
      loading={loading}
      onRetry={onRetry}
      columns={columns ?? kpiColumns(items.length)}
    />
  )
}

export interface DashboardExecutiveRowProps {
  alerts: ReactNode
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/**
 * Standard executive layout:
 * 1) Primary visualization + quick actions
 * 2) Alerts & notifications
 * Exactly one primary visualization per dashboard.
 */
export function DashboardExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: DashboardExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, lg: 4 }}>{quickActions}</Grid>
      <Grid size={{ xs: 12 }}>{alerts}</Grid>
    </Grid>
  )
}
