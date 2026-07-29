import { AlertPanel } from '../dashboard-ui-kit'
import type { DashboardAlertItem, DashboardAlertSeverity } from '../types'
import { isDashboardPermissionGranted } from '../utils/permission'
import { BusinessWidgetFrame } from './common/BusinessWidgetFrame'
import type { UiKitListItem } from '../dashboard-ui-kit'

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

function severityTone(severity: DashboardAlertSeverity): UiKitListItem['badgeTone'] {
  switch (severity) {
    case 'critical':
      return 'negative'
    case 'warning':
      return 'warning'
    case 'success':
      return 'positive'
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

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      empty={alerts.length === 0}
      emptyTitle={emptyText}
      permission={permission}
    >
      <AlertPanel
        title={title}
        subtitle={subtitle}
        loading={loading}
        maxItems={maxItems}
        onShowMore={onShowMore}
        items={alerts.map((alert) => ({
          id: alert.id,
          primary: alert.count != null ? `${alert.title} (${alert.count})` : alert.title,
          secondary: alert.description,
          badgeLabel: severityLabel(alert.severity),
          badgeTone: severityTone(alert.severity),
          onClick: alert.onClick,
        }))}
      />
    </BusinessWidgetFrame>
  )
}
