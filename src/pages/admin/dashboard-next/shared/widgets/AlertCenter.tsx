import { ListCard, type ListCardItem } from '@/design-system/UIComponents'
import type { DashboardAlertItem, DashboardAlertSeverity } from '../types'
import { isDashboardPermissionGranted } from '../utils/permission'
import { BusinessWidgetFrame } from './common/BusinessWidgetFrame'

export interface AlertCenterProps {
  title?: string
  subtitle?: string
  alerts: DashboardAlertItem[]
  loading?: boolean
  emptyText?: string
  maxItems?: number
  onShowMore?: () => void
  permission?: boolean
}

type ListBadgeColor = NonNullable<ListCardItem['badge']>['color']

function severityLabel(severity: DashboardAlertSeverity): string {
  switch (severity) {
    case 'critical':
      return 'High'
    case 'warning':
      return 'Medium'
    case 'success':
      return 'Low'
    case 'info':
    default:
      return 'Low'
  }
}

function severityToListBadgeColor(severity: DashboardAlertSeverity): ListBadgeColor {
  switch (severity) {
    case 'critical':
      return 'error'
    case 'warning':
      return 'warning'
    case 'success':
      return 'success'
    case 'info':
    default:
      return 'info'
  }
}

export function AlertCenter({
  title = 'Alerts & notifications',
  subtitle,
  alerts,
  loading = false,
  emptyText = 'No alerts right now.',
  maxItems,
  onShowMore,
  permission,
}: AlertCenterProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const items: ListCardItem[] = alerts.map((alert) => ({
    id: alert.id,
    primary: alert.count != null ? `${alert.title} (${alert.count})` : alert.title,
    secondary: alert.description,
    badge: {
      label: severityLabel(alert.severity),
      color: severityToListBadgeColor(alert.severity),
    },
    onClick: alert.onClick,
  }))

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      empty={alerts.length === 0}
      emptyTitle={emptyText}
      permission={permission}
    >
      <ListCard
        title={title}
        subtitle={subtitle}
        items={items}
        loading={loading}
        emptyText={emptyText}
        maxItems={maxItems}
        onShowMore={onShowMore}
        showMoreLabel="View all alerts"
      />
    </BusinessWidgetFrame>
  )
}
