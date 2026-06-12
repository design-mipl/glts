import { Box, Typography, Card } from '@mui/material'
import type { ReactNode } from 'react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { Tabs } from '@/design-system/UIComponents'
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        {title && (
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '22px', md: '26px' }, fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>{subtitle}</Typography>
            )}
          </Box>
        )}
        {headerActions && (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, flexWrap: 'wrap' }}>{headerActions}</Box>
        )}
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
