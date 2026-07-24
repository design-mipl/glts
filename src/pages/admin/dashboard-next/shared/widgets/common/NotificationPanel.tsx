import { ListCard, type ListCardItem } from '@/design-system/UIComponents'
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
  const listItems: ListCardItem[] = items.map((item) => ({
    id: item.id,
    primary: item.title,
    secondary: [item.body, item.createdAt].filter(Boolean).join(' · '),
    badge: item.unread ? { label: 'New', color: 'primary' } : undefined,
    onClick: item.onClick,
  }))

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
      <ListCard
        title={title}
        subtitle={subtitle}
        items={listItems}
        maxItems={maxItems}
        onShowMore={onShowMore}
        showMoreLabel="View all"
        emptyText="No notifications"
      />
    </BusinessWidgetFrame>
  )
}
