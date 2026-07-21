import type { ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import {
  BaseCard,
  EmptyState,
  LoadingOverlay,
  type BreadcrumbItem,
} from '@/design-system/UIComponents'
import { DashboardHeader } from './DashboardHeader'
import { DashboardTabs } from './DashboardTabs'
import type { DashboardTabDefinition } from '../types'
import { DASHBOARD_SPACING, DASHBOARD_SURFACE } from '../constants'
import { tokens } from '@/design-system/tokens'

export interface DashboardShellProps {
  title: string
  subtitle?: string
  eyebrow?: string
  badge?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  filters?: ReactNode
  kpis?: ReactNode
  alerts?: ReactNode
  tabs?: DashboardTabDefinition[]
  defaultTab?: string
  tabMeta?: ReactNode
  children?: ReactNode
  loading?: boolean
  loadingLabel?: string
  error?: boolean
  errorTitle?: string
  errorDescription?: string
  onRetry?: () => void
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function DashboardShell({
  title,
  subtitle,
  eyebrow,
  badge = 'Next',
  breadcrumbs,
  actions,
  filters,
  kpis,
  alerts,
  tabs,
  defaultTab,
  tabMeta,
  children,
  loading = false,
  loadingLabel = 'Loading dashboard...',
  error = false,
  errorTitle = 'Unable to load dashboard',
  errorDescription = 'Something went wrong while loading this workspace. Try again.',
  onRetry,
  empty = false,
  emptyTitle = 'Nothing to show yet',
  emptyDescription = 'Data will appear here once activity starts.',
}: DashboardShellProps) {
  if (error) {
    return (
      <Box>
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          badge={badge}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
        <BaseCard sx={DASHBOARD_SURFACE.sectionCardSx}>
          <EmptyState
            variant="no-data"
            title={errorTitle}
            description={errorDescription}
            action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
          />
        </BaseCard>
      </Box>
    )
  }

  return (
    <Box>
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        badge={badge}
        breadcrumbs={breadcrumbs}
        actions={actions}
        filters={filters}
      />

      <LoadingOverlay loading={loading} label={loadingLabel}>
        <Stack
          spacing={DASHBOARD_SPACING.section}
          sx={{
            opacity: loading ? 0.6 : 1,
            transition: `opacity ${tokens.transition.normal}`,
            pb: DASHBOARD_SPACING.section,
          }}
        >
          {empty && !loading ? (
            <BaseCard sx={DASHBOARD_SURFACE.sectionCardSx}>
              <EmptyState variant="no-data" title={emptyTitle} description={emptyDescription} />
            </BaseCard>
          ) : (
            <>
              {kpis}
              {alerts}
              {tabs && tabs.length > 0 ? (
                <DashboardTabs tabs={tabs} defaultTab={defaultTab} toolbar={tabMeta} />
              ) : null}
              {children}
            </>
          )}
        </Stack>
      </LoadingOverlay>
    </Box>
  )
}
