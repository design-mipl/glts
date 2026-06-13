import { Box, Stack, Typography, Card } from '@mui/material'
import type { ReactNode } from 'react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { Tabs } from '@/design-system/UIComponents'
import {
  PORTAL_RECORD_PAGE_TITLE_SX,
  PORTAL_RECORD_PAGE_TITLE_VARIANT,
} from '@/shared/theme/portalChromeLayout'
import { CustomerListingKpis, type CustomerKpiItem } from './CustomerListingKpis'
import { CustomerListingStickyHeader } from './CustomerListingStickyHeader'

export interface CustomerListingTab {
  value: string
  label: string
  badge?: number | string
}

interface CustomerListingShellProps {
  title?: string
  subtitle?: string
  headerActions?: ReactNode
  /** Sticky page header (title + actions) rendered above KPIs; takes precedence over title/headerActions props */
  stickyPageHeader?: ReactNode
  kpis?: CustomerKpiItem[]
  tabs?: CustomerListingTab[]
  tabValue?: string
  onTabChange?: (value: string) => void
  toolbar: ReactNode
  advancedFilters?: ReactNode
  table: ReactNode
  pagination: ReactNode
}

export function CustomerListingShell({
  title,
  subtitle,
  headerActions,
  stickyPageHeader,
  kpis,
  tabs,
  tabValue,
  onTabChange,
  toolbar,
  advancedFilters,
  table,
  pagination,
}: CustomerListingShellProps) {
  const defaultHeader =
    !stickyPageHeader && (title || headerActions) ? (
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          {title && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant={PORTAL_RECORD_PAGE_TITLE_VARIANT}
                component="h1"
                fontWeight={700}
                color="text.primary"
                sx={PORTAL_RECORD_PAGE_TITLE_SX}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
          {headerActions && (
            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>{headerActions}</Box>
          )}
        </Stack>
      </Box>
    ) : null

  const headerContent = stickyPageHeader ?? defaultHeader

  return (
    <Box>
      {headerContent ? <CustomerListingStickyHeader>{headerContent}</CustomerListingStickyHeader> : null}

      {kpis && kpis.length > 0 && <CustomerListingKpis items={kpis} />}

      <Card
        elevation={0}
        sx={{
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        {tabs && tabs.length > 0 && tabValue != null && onTabChange && (
          <Box sx={{ borderBottom: `${BORDER_WIDTH.thin} solid`, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={onTabChange}
              variant="underline"
              items={tabs.map(t => ({
                value: t.value,
                label: t.label,
                badge: t.badge,
              }))}
              sx={{ mb: 0, px: 2, minHeight: 44 }}
            />
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            borderBottom: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
          }}
        >
          {toolbar}
        </Box>

        {advancedFilters && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: `${BORDER_WIDTH.thin} solid`,
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            {advancedFilters}
          </Box>
        )}

        {table}
        {pagination}
      </Card>
    </Box>
  )
}
