import { ReportCenter } from '../../shared'
import type { GroundOperationsDashboardTabProps } from '../types'

/** Reports placeholder — Enterprise Report Center deferred. */
export function ReportsTab({ data, loading, onRetry }: GroundOperationsDashboardTabProps) {
  return (
    <ReportCenter
      placeholder
      recentReports={[
        {
          id: 'go-daily',
          name: "Today's job pack",
          category: 'Operational',
          generatedAt: 'Today 06:30',
        },
        {
          id: 'go-route',
          name: 'Route utilization',
          category: 'Operational',
          generatedAt: 'Yesterday',
        },
        {
          id: 'go-settle',
          name: 'Settlement summary',
          category: 'Executive',
          generatedAt: 'This week',
        },
      ]}
      loading={loading}
      onRetry={onRetry}
      exportTitle="Ground Operations dashboard export"
      exportPayload={data.quickStats}
    />
  )
}
