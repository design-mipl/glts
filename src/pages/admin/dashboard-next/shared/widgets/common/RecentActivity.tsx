import { ListCard, type ListCardItem } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'
import { Box } from '@mui/material'

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
  const listItems: ListCardItem[] = items.map((item) => ({
    id: item.id,
    primary: item.primary,
    secondary: item.secondary,
    badge: item.badgeLabel
      ? { label: item.badgeLabel, color: item.badgeColor ?? 'default' }
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
      emptyTitle="No recent activity"
    >
      <Box>
        <ListCard
          title={title}
          subtitle={subtitle}
          items={listItems}
          maxItems={maxItems}
          onShowMore={onShowMore}
          showMoreLabel="View all"
          emptyText="No recent activity"
        />
      </Box>
    </BusinessWidgetFrame>
  )
}
