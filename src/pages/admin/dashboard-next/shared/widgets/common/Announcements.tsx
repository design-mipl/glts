import { AlertPanel } from '../../dashboard-ui-kit'
import type { UiKitListItem } from '../../dashboard-ui-kit'
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

function severityTone(severity?: AnnouncementItem['severity']): UiKitListItem['badgeTone'] {
  switch (severity) {
    case 'critical':
      return 'negative'
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
      <AlertPanel
        title={title}
        subtitle={subtitle}
        maxItems={maxItems}
        onShowMore={onShowMore}
        loading={loading}
        items={items.map((item) => ({
          id: item.id,
          primary: item.title,
          secondary: [item.summary, item.publishedAt].filter(Boolean).join(' · '),
          badgeLabel: item.severity,
          badgeTone: severityTone(item.severity),
          onClick: item.onClick,
        }))}
      />
    </BusinessWidgetFrame>
  )
}
