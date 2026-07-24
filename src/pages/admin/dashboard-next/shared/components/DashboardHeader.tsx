import type { ReactNode } from 'react'
import { Box, Tooltip, Typography } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '@/pages/admin/components/adminRecordPageTitle'
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
  /**
   * Dense chrome for Dashboard Workspace — one-line title row, subtitle as tooltip.
   * Protects first-viewport space for hero KPIs and executive content.
   */
  dense?: boolean
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
  dense = false,
}: DashboardHeaderProps) {
  return (
    <Box sx={DASHBOARD_SURFACE.stickyHeaderSx}>
      <Box
        sx={{
          mb: 0,
          '& > .MuiBox-root': {
            mb: dense ? (filters ? 1 : 0) : filters ? 1.5 : 0,
          },
        }}
      >
        {dense ? (
          <Box sx={{ mb: filters ? 1 : 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {eyebrow ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
                  >
                    {eyebrow}
                  </Typography>
                ) : null}
                <Tooltip title={subtitle ?? ''} disableHoverListener={!subtitle}>
                  <Typography
                    variant={ADMIN_RECORD_PAGE_TITLE_VARIANT}
                    component="h1"
                    fontWeight={700}
                    color="text.primary"
                    sx={ADMIN_RECORD_PAGE_TITLE_SX}
                  >
                    {title}
                  </Typography>
                </Tooltip>
                {badge ? (
                  <Typography
                    component="span"
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      lineHeight: 1.2,
                    }}
                  >
                    {badge}
                  </Typography>
                ) : null}
              </Box>
              {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
            </Box>
            {meta ? <Box sx={{ mt: 0.75 }}>{meta}</Box> : null}
          </Box>
        ) : (
          <AdminPageHeader
            title={title}
            description={subtitle}
            eyebrow={eyebrow}
            badge={badge}
            breadcrumbs={breadcrumbs}
            actions={actions}
            meta={meta}
          />
        )}
      </Box>
      {filters ? (
        <BaseCard sx={DASHBOARD_SURFACE.filterBarSx}>{filters}</BaseCard>
      ) : null}
      {!filters ? <Box sx={{ mb: DASHBOARD_SPACING.field }} /> : null}
    </Box>
  )
}
