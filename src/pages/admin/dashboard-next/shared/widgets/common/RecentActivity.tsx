import { ActivityFeed } from '../../dashboard-ui-kit'
import type { UiKitListItem } from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'

export interface RecentActivityItem {
  id: string
  primary: string
  secondary?: string
  badgeLabel?: string
  badgeColor?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default'
  onClick?: () => void
}

export interface RecentActivityProps {
  title?: string
  subtitle?: string
  items: RecentActivityItem[]
  maxItems?: number
  onShowMore?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

function toTone(
  color?: RecentActivityItem['badgeColor'],
): UiKitListItem['badgeTone'] {
  switch (color) {
    case 'success':
      return 'positive'
    case 'error':
      return 'negative'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'primary':
      return 'primary'
    default:
      return 'neutral'
  }
}

export function RecentActivity({
  title = 'Recent activity',
  subtitle,
  items,
  maxItems = 6,
  onShowMore,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: RecentActivityProps) {
  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? items.length === 0}
      permission={permission}
      onRetry={onRetry}
      emptyTitle="No recent activity"
    >
      <ActivityFeed
        title={title}
        subtitle={subtitle}
        maxItems={maxItems}
        onShowMore={onShowMore}
        loading={loading}
        items={items.map((item) => ({
          id: item.id,
          primary: item.primary,
          secondary: item.secondary,
          badgeLabel: item.badgeLabel,
          badgeTone: toTone(item.badgeColor),
          onClick: item.onClick,
        }))}
      />
    </BusinessWidgetFrame>
  )
}
