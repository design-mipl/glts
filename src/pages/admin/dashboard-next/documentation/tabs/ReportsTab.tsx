import { ReportCenter } from '../../shared'
import type { DocumentationDashboardTabProps } from '../types'

/** Daily documentation reports — Report Center with recent list. */
export function ReportsTab({ data, loading, onRetry }: DocumentationDashboardTabProps) {
  return (
    <ReportCenter
      recentReports={[
        {
          id: 'doc-daily',
          name: 'Daily documentation digest',
          category: 'Operational',
          generatedAt: 'Today 07:00',
        },
        {
          id: 'doc-qc',
          name: 'QC ageing report',
          category: 'Quality',
          generatedAt: 'Yesterday',
        },
        {
          id: 'doc-submission',
          name: 'Submission readiness',
          category: 'Operational',
          generatedAt: 'This week',
        },
      ]}
      loading={loading}
      onRetry={onRetry}
      exportTitle="Documentation dashboard export"
      exportPayload={data.quickStats}
    />
  )
}
