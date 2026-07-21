import { ListCard, type ListCardItem } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'

export interface AnnouncementItem {
  id: string
  title: string
  summary?: string
  publishedAt?: string
  severity?: 'info' | 'warning' | 'critical'
  onClick?: () => void
}

export interface AnnouncementsProps {
  title?: string
  subtitle?: string
  items: AnnouncementItem[]
  maxItems?: number
  onShowMore?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

type ListBadgeColor = NonNullable<ListCardItem['badge']>['color']

function severityColor(severity?: AnnouncementItem['severity']): ListBadgeColor {
  switch (severity) {
    case 'critical':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
}

export function Announcements({
  title = 'Announcements',
  subtitle,
  items,
  maxItems = 5,
  onShowMore,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: AnnouncementsProps) {
  const listItems: ListCardItem[] = items.map((item) => ({
    id: item.id,
    primary: item.title,
    secondary: [item.summary, item.publishedAt].filter(Boolean).join(' · '),
    badge: item.severity
      ? { label: item.severity, color: severityColor(item.severity) }
      : undefined,
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
      emptyTitle="No announcements"
    >
      <ListCard
        title={title}
        subtitle={subtitle}
        items={listItems}
        maxItems={maxItems}
        onShowMore={onShowMore}
        showMoreLabel="View all"
        emptyText="No announcements"
      />
    </BusinessWidgetFrame>
  )
}
