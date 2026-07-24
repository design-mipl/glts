import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import type { DashboardTabDefinition } from '../types'
import { DASHBOARD_SPACING, DASHBOARD_SURFACE } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'
import { tokens } from '@/design-system/tokens'

export interface DashboardTabsProps {
  tabs: DashboardTabDefinition[]
  defaultTab?: string
  value?: string
  onChange?: (tabId: string) => void
  permission?: boolean
  /** Content aligned to the right of the tab list (e.g. auto-refresh). */
  toolbar?: ReactNode
  /** Extra content rendered below the tab panel. */
  footer?: ReactNode
}

function resolveDefaultTab(tabs: DashboardTabDefinition[], defaultTab?: string): string {
  const visible = tabs.filter((t) => !t.hidden)
  if (defaultTab && visible.some((t) => t.id === defaultTab)) return defaultTab
  return visible[0]?.id ?? ''
}

export function DashboardTabs({
  tabs,
  defaultTab,
  value,
  onChange,
  permission,
  toolbar,
  footer,
}: DashboardTabsProps) {
  const visibleTabs = useMemo(() => tabs.filter((t) => !t.hidden), [tabs])
  const [internalTab, setInternalTab] = useState(() => resolveDefaultTab(tabs, defaultTab))

  if (!isDashboardPermissionGranted(permission) || visibleTabs.length === 0) {
    return null
  }

  const activeTab = value ?? internalTab
  const safeTab = visibleTabs.some((t) => t.id === activeTab)
    ? activeTab
    : resolveDefaultTab(tabs, defaultTab)

  const handleChange = (next: string) => {
    if (value === undefined) setInternalTab(next)
    onChange?.(next)
  }

  const activeContent = visibleTabs.find((t) => t.id === safeTab)?.content

  return (
    <Box
      sx={{
        ...DASHBOARD_SURFACE.sectionCardSx,
        p: 0,
        overflow: 'visible',
        mb: DASHBOARD_SPACING.section,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: tokens.zIndex.sticky - 1,
          px: DASHBOARD_SPACING.dense,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          borderTopLeftRadius: DASHBOARD_SURFACE.radius,
          borderTopRightRadius: DASHBOARD_SURFACE.radius,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Tabs
            variant="underline"
            size="sm"
            value={safeTab}
            onChange={handleChange}
            items={visibleTabs.map((tab) => ({
              label:
                tab.badge != null && tab.badge !== ''
                  ? `${tab.label} (${tab.badge})`
                  : tab.label,
              value: tab.id,
              icon: tab.icon,
              disabled: tab.disabled,
            }))}
          />
        </Box>
        {toolbar ? (
          <Box sx={{ flexShrink: 0, px: 1, py: 1, display: 'flex', alignItems: 'center' }}>
            {toolbar}
          </Box>
        ) : null}
      </Stack>
      <Box
        role="tabpanel"
        id={`dashboard-tabpanel-${safeTab}`}
        aria-labelledby={`dashboard-tab-${safeTab}`}
        sx={{ p: DASHBOARD_SPACING.card }}
      >
        {activeContent}
      </Box>
      {footer}
    </Box>
  )
}
