import { AlertPanel } from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'

export interface NotificationItem {
  id: string
  title: string
  body?: string
  unread?: boolean
  createdAt?: string
  onClick?: () => void
}

export interface NotificationPanelProps {
  title?: string
  subtitle?: string
  items: NotificationItem[]
  maxItems?: number
  onShowMore?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function NotificationPanel({
  title = 'Notifications',
  subtitle,
  items,
  maxItems = 8,
  onShowMore,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: NotificationPanelProps) {
  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? items.length === 0}
      permission={permission}
      onRetry={onRetry}
      emptyTitle="No notifications"
    >
      <AlertPanel
        title={title}
        subtitle={subtitle}
        maxItems={maxItems}
        onShowMore={onShowMore}
        loading={loading}
        items={items.map((item) => ({
          id: item.id,
          primary: item.title,
          secondary: [item.body, item.createdAt].filter(Boolean).join(' · '),
          badgeLabel: item.unread ? 'New' : undefined,
          badgeTone: item.unread ? 'primary' : 'neutral',
          onClick: item.onClick,
        }))}
      />
    </BusinessWidgetFrame>
  )
}
