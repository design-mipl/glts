import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { QuickStats } from '../widgets'
import type { DashboardKpiItem } from '../types'
import { DASHBOARD_SPACING } from '../constants'

export interface DashboardHeroStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
  onRetry?: () => void
  columns?: 2 | 3 | 4 | 6
  title?: string
  subtitle?: string
}

/** Standard 4–8 hero metric strip above tabs. */
export function DashboardHeroStrip({
  items,
  loading,
  onRetry,
  columns = 4,
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
      columns={columns <= 3 ? 3 : columns === 6 ? 6 : 4}
    />
  )
}

export interface DashboardExecutiveRowProps {
  alerts: ReactNode
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/**
 * Standard executive row: Alerts · Primary visualization · Quick actions.
 * Exactly one primary visualization per dashboard.
 */
export function DashboardExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: DashboardExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 4 }}>{alerts}</Grid>
      <Grid size={{ xs: 12, md: 4 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, md: 4 }}>{quickActions}</Grid>
    </Grid>
  )
}
