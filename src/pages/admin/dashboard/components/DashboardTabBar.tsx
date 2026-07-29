import { Tabs } from '@/design-system/UIComponents'

export interface DashboardTabItem {
  id: string
  label: string
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
