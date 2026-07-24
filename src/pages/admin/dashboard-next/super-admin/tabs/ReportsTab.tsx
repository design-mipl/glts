import { ReportCenter } from '../../shared'
import type { SuperAdminDashboardTabProps } from '../types'
import { SA_ACTION_ICONS } from './OverviewTab'

export function ReportsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  return (
    <ReportCenter
      recentReports={data.recentReports}
      downloadHistory={data.reportNotifications}
      loading={loading}
      onRetry={onRetry}
      exportTitle="Super Admin executive export"
      exportPayload={data.clientRows}
      exportActions={data.quickActions.map((action) => ({
        id: action.id,
        title: action.title,
        description: action.description,
        badge: action.badge,
        icon: SA_ACTION_ICONS[action.id],
        onClick: () => onNavigate(action.href),
      }))}
    />
  )
}
