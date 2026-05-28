import { Box, Card, Grid } from '@mui/material'
import type { ReactNode } from 'react'
import { Breadcrumb, Tabs } from '@/design-system/UIComponents'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { CustomerDetailHeader, type CustomerDetailHeaderProps } from './CustomerDetailHeader'

export interface CustomerDetailTab {
  value: string
  label: string
}

export interface CustomerDetailWorkspaceProps {
  breadcrumbs?: BreadcrumbItem[]
  header: CustomerDetailHeaderProps
  tabs?: CustomerDetailTab[]
  tabValue?: string
  onTabChange?: (value: string) => void
  children: ReactNode
  aside?: ReactNode
}

export function CustomerDetailWorkspace({
  breadcrumbs,
  header,
  tabs,
  tabValue,
  onTabChange,
  children,
  aside,
}: CustomerDetailWorkspaceProps) {
  const colors = usePublicBrandColors()

  return (
    <Box>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb sx={{ mb: 1.5 }} items={breadcrumbs} />
      )}

      <CustomerDetailHeader {...header} />

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
          <Box
            sx={{
              borderBottom: `${BORDER_WIDTH.thin} solid`,
              borderColor: 'divider',
              bgcolor: colors.white,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={onTabChange}
              variant="underline"
              size="sm"
              items={tabs}
              sx={{ mb: 0, px: 2, minHeight: 44 }}
            />
          </Box>
        )}

        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          {aside ? (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, lg: 8 }}>{children}</Grid>
              <Grid size={{ xs: 12, lg: 4 }}>{aside}</Grid>
            </Grid>
          ) : (
            children
          )}
        </Box>
      </Card>
    </Box>
  )
}
