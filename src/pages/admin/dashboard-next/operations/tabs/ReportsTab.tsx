import { ReportCenter } from '../../shared'
import type { OperationsDashboardTabProps } from '../types'

/** Reports placeholder — Enterprise Report Center deferred. */
export function ReportsTab({ data, loading, onRetry }: OperationsDashboardTabProps) {
  return (
    <ReportCenter
      placeholder
      recentReports={[
        {
          id: 'ops-daily',
          name: 'Daily work digest',
          category: 'Operational',
          generatedAt: 'Today 07:00',
        },
        {
          id: 'ops-queue',
          name: 'Queue ageing report',
          category: 'Operational',
          generatedAt: 'Yesterday',
        },
        {
          id: 'ops-perf',
          name: 'Consultant performance',
          category: 'Executive',
          generatedAt: 'This week',
        },
      ]}
      loading={loading}
      onRetry={onRetry}
      exportTitle="Operations dashboard export"
      exportPayload={data.myQuickStats}
    />
  )
}
