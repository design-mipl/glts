import type { ManagementAlertRecord, ManagementAlertSeverity } from '../types'

const SEVERITY_RANK: Record<ManagementAlertSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export type ManagementAlertSortKey =
  | 'severity'
  | 'financial'
  | 'segment'
  | 'status'
  | 'title'

export function sortManagementAlerts(
  alerts: ManagementAlertRecord[],
  sortBy: ManagementAlertSortKey = 'severity',
): ManagementAlertRecord[] {
  return [...alerts].sort((a, b) => {
    switch (sortBy) {
      case 'financial':
        return String(b.financialImpact ?? '').localeCompare(String(a.financialImpact ?? ''))
      case 'segment':
        return String(a.affectedSegment ?? '').localeCompare(String(b.affectedSegment ?? ''))
      case 'status':
        return String(a.status ?? '').localeCompare(String(b.status ?? ''))
      case 'title':
        return a.title.localeCompare(b.title)
      case 'severity':
      default: {
        const rank = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
        if (rank !== 0) return rank
        return a.title.localeCompare(b.title)
      }
    }
  })
}

export function managementAlertToListItem(alert: ManagementAlertRecord) {
  const badge =
    alert.severity === 'critical'
      ? 'Critical'
      : alert.severity === 'high'
        ? 'High'
        : alert.severity === 'medium'
          ? 'Medium'
          : 'Low'

  const tone =
    alert.severity === 'critical'
      ? ('negative' as const)
      : alert.severity === 'high'
        ? ('warning' as const)
        : alert.severity === 'medium'
          ? ('info' as const)
          : ('neutral' as const)

  return {
    id: alert.id,
    primary: alert.title,
    secondary: [
      alert.businessImpact,
      alert.financialImpact ? `Impact ${alert.financialImpact}` : null,
      alert.affectedSegment,
      alert.recommendedAction ? `Action: ${alert.recommendedAction}` : null,
      alert.owner ? `Owner: ${alert.owner}` : null,
    ]
      .filter(Boolean)
      .join(' · '),
    badgeLabel: badge,
    badgeTone: tone,
  }
}
