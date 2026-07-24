import { ListCard, type ListCardItem } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'

export interface RecentReportItem {
  id: string
  name: string
  generatedAt?: string
  category?: string
  onClick?: () => void
}

export interface RecentReportsProps {
  title?: string
  subtitle?: string
  items: RecentReportItem[]
  maxItems?: number
  onShowMore?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function RecentReports({
  title = 'Recent reports',
  subtitle,
  items,
  maxItems = 5,
  onShowMore,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: RecentReportsProps) {
  const listItems: ListCardItem[] = items.map((item) => ({
    id: item.id,
    primary: item.name,
    secondary: [item.category, item.generatedAt].filter(Boolean).join(' · '),
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
      emptyTitle="No reports"
    >
      <ListCard
        title={title}
        subtitle={subtitle}
        items={listItems}
        maxItems={maxItems}
        onShowMore={onShowMore}
        showMoreLabel="View all reports"
        emptyText="No reports"
      />
    </BusinessWidgetFrame>
  )
}
