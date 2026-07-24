import { ReportCenter } from '../../shared'
import type { AdminDashboardTabProps } from '../types'

/** Reports placeholder — Enterprise Report Center deferred. */
export function ReportsTab({ data, loading, onRetry }: AdminDashboardTabProps) {
  return (
    <ReportCenter
      placeholder
      recentReports={data.recentReports}
      loading={loading}
      onRetry={onRetry}
      exportTitle="Admin dashboard export"
      exportPayload={data.quickStats}
    />
  )
}
