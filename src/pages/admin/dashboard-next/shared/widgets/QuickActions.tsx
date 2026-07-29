import {
  ActionCard as KitActionCard,
  ExecutiveGrid,
  InsightStack,
} from '../dashboard-ui-kit'
import type { DashboardQuickActionItem } from '../types'
import { isDashboardPermissionGranted } from '../utils/permission'
import { BusinessWidgetFrame } from './common/BusinessWidgetFrame'

export interface QuickActionsProps {
  items: DashboardQuickActionItem[]
  loading?: boolean
  permission?: boolean
  columns?: 1 | 2 | 3
  /** `tiles` matches compact icon grid; `cards` keeps action card rows. */
  variant?: 'cards' | 'tiles'
  title?: string
  subtitle?: string
}

export function QuickActions({
  items,
  loading = false,
  permission,
  columns = 1,
  variant = 'cards',
  title,
  subtitle,
}: QuickActionsProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const displayItems: DashboardQuickActionItem[] =
    loading && items.length === 0
      ? Array.from({ length: Math.max(columns, 2) }, (_, i) => ({
          id: `action-skeleton-${i}`,
          title: '—',
        }))
      : items

  const cards = displayItems.map((item) => (
    <KitActionCard
      key={item.id}
      title={item.title}
      description={variant === 'cards' ? item.description : undefined}
      icon={item.icon}
      badge={item.badge}
      onClick={item.onClick}
      disabled={item.disabled || loading}
      loading={loading}
    />
  ))

  const body =
    columns === 1 && variant === 'cards' ? (
      <InsightStack>{cards}</InsightStack>
    ) : (
      <ExecutiveGrid columns={(variant === 'tiles' ? 3 : columns === 1 ? 2 : columns) as 2 | 3}>
        {cards}
      </ExecutiveGrid>
    )

  if (title) {
    return (
      <BusinessWidgetFrame title={title} subtitle={subtitle} loading={false} card>
        {body}
      </BusinessWidgetFrame>
    )
  }

  return body
}
