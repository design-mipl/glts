import { Badge, Tabs } from '@/design-system/UIComponents'

export interface DashboardTabItem {
  id: string
  label: string
  /** Shown when > 0 */
  badge?: number
  hidden?: boolean
}

export interface DashboardTabBarProps {
  tabs: DashboardTabItem[]
  value: string
  onChange: (value: string) => void
}

/** Tab strip only — chrome lives on the parent tabs container. */
export function DashboardTabBar({ tabs, value, onChange }: DashboardTabBarProps) {
  const visible = tabs.filter((tab) => !tab.hidden)

  if (visible.length === 0) return null

  return (
    <Tabs
      variant="underline"
      size="sm"
      scrollable
      value={value}
      onChange={onChange}
      items={visible.map((tab) => ({
        value: tab.id,
        label: tab.label,
        icon:
          tab.badge != null && tab.badge > 0 ? (
            <Badge label={String(tab.badge)} color="error" size="sm" />
          ) : undefined,
      }))}
      sx={{
        minHeight: 40,
        px: { xs: 1, sm: 1.5 },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    />
  )
}
