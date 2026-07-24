import type { DashboardAlertSeverity, DashboardStatusTone } from '../types'

export function alertSeverityToBadgeColor(
  severity: DashboardAlertSeverity,
): DashboardStatusTone {
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

export function mapStatusToTone(status: string): DashboardStatusTone {
  const normalized = status.trim().toLowerCase()
  if (['active', 'completed', 'paid', 'success', 'ok', 'healthy'].includes(normalized)) {
    return 'success'
  }
  if (['pending', 'in progress', 'review', 'warning', 'at risk'].includes(normalized)) {
    return 'warning'
  }
  if (['failed', 'overdue', 'breach', 'critical', 'blocked', 'error'].includes(normalized)) {
    return 'error'
  }
  if (['info', 'open', 'new'].includes(normalized)) {
    return 'info'
  }
  return 'neutral'
}
