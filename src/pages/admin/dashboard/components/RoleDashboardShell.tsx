import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import { BaseCard, Button, LoadingOverlay } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExecutiveCompactHeader } from './ExecutiveCompactHeader'
import { DashboardTabBar, type DashboardTabItem } from './DashboardTabBar'
import { DashboardTabPanel } from './DashboardTabPanel'
import { EXECUTIVE_DASHBOARD_SPACING, executiveCardLevel2Sx } from './executiveDashboardTokens'

export interface RoleDashboardTab extends DashboardTabItem {
  content: ReactNode
}

export interface RoleDashboardShellProps {
  eyebrow?: string
  title: string
  subtitle?: string
  filters?: ReactNode
  /** Always visible above tabs (KPI strip) */
  kpis?: ReactNode
  /** Always visible above tabs when provided (critical alerts) */
  alerts?: ReactNode
  tabs: RoleDashboardTab[]
  defaultTab?: string
  loading?: boolean
  loadingLabel?: string
  error?: boolean
  onRetry?: () => void
}

function resolveDefaultTab(tabs: RoleDashboardTab[], defaultTab?: string): string {
  const visible = tabs.filter((t) => !t.hidden)
  if (defaultTab && visible.some((t) => t.id === defaultTab)) return defaultTab
  return visible[0]?.id ?? ''
}

/**
 * Shared shell for role dashboards: sticky header + filters, KPIs, optional alerts,
 * tab bar, and one tab panel at a time (reduces scroll clutter).
 */
export function RoleDashboardShell({
  eyebrow,
  title,
  subtitle,
  filters,
  kpis,
  alerts,
  tabs,
  defaultTab,
  loading = false,
  loadingLabel = 'Loading dashboard...',
  error = false,
  onRetry,
}: RoleDashboardShellProps) {
  const colors = usePublicBrandColors()
  const visibleTabs = useMemo(() => tabs.filter((t) => !t.hidden), [tabs])
  const [activeTab, setActiveTab] = useState(() => resolveDefaultTab(tabs, defaultTab))

  const safeTab = visibleTabs.some((t) => t.id === activeTab)
    ? activeTab
    : resolveDefaultTab(tabs, defaultTab)

  const activeContent = visibleTabs.find((t) => t.id === safeTab)?.content

  if (error) {
    return (
      <Box>
        <ExecutiveCompactHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <BaseCard sx={{ p: 3, textAlign: 'center' }}>
          <Button label="Retry loading dashboard" onClick={onRetry} />
        </BaseCard>
      </Box>
    )
  }

  return (
    <Box>
      <ExecutiveCompactHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        filters={filters}
      />

      <LoadingOverlay loading={loading} label={loadingLabel}>
        <Stack
          spacing={EXECUTIVE_DASHBOARD_SPACING.section}
          sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 200ms ease', pb: 2 }}
        >
          {kpis}
          {alerts}
          {visibleTabs.length > 0 ? (
            <Box sx={{ ...executiveCardLevel2Sx(colors), overflow: 'hidden' }}>
              <DashboardTabBar
                tabs={visibleTabs}
                value={safeTab}
                onChange={setActiveTab}
              />
              <DashboardTabPanel>{activeContent}</DashboardTabPanel>
            </Box>
          ) : null}
        </Stack>
      </LoadingOverlay>
    </Box>
  )
}
