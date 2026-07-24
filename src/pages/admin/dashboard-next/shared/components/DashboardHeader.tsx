import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { BaseCard } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING, DASHBOARD_SURFACE } from '../constants'

export interface DashboardHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  /** Pill beside the title (e.g. "Next"). */
  badge?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  filters?: ReactNode
  meta?: ReactNode
}

export function DashboardHeader({
  title,
  subtitle,
  eyebrow,
  badge,
  breadcrumbs,
  actions,
  filters,
  meta,
}: DashboardHeaderProps) {
  return (
    <Box sx={DASHBOARD_SURFACE.stickyHeaderSx}>
      <Box sx={{ mb: 0, '& > .MuiBox-root': { mb: filters ? 2 : 0 } }}>
        <AdminPageHeader
          title={title}
          description={subtitle}
          eyebrow={eyebrow}
          badge={badge}
          breadcrumbs={breadcrumbs}
          actions={actions}
          meta={meta}
        />
      </Box>
      {filters ? (
        <BaseCard sx={DASHBOARD_SURFACE.filterBarSx}>{filters}</BaseCard>
      ) : null}
      {!filters ? <Box sx={{ mb: DASHBOARD_SPACING.field }} /> : null}
    </Box>
  )
}
