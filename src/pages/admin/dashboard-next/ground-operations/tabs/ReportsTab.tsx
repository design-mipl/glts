import { ReportCenter } from '../../shared'
import type { GroundOperationsDashboardTabProps } from '../types'

/** Reports — export live Ground Ops pulse metrics. */
export function ReportsTab({ data, loading, onRetry }: GroundOperationsDashboardTabProps) {
  return (
    <ReportCenter
      placeholder
      recentReports={[
        {
          id: 'go-desk',
          name: 'Operations Desk queue',
          category: 'Operational',
          generatedAt: 'Live',
        },
        {
          id: 'go-logistics',
          name: 'Logistics in-transit board',
          category: 'Operational',
          generatedAt: 'Live',
        },
        {
          id: 'go-claims',
          name: 'Claim sheet Finance status',
          category: 'Finance',
          generatedAt: 'Live',
        },
        {
          id: 'go-funds',
          name: 'Fund utilization settlement',
          category: 'Finance',
          generatedAt: 'Live',
        },
      ]}
      loading={loading}
      onRetry={onRetry}
      exportTitle="Ground Operations dashboard export"
      exportPayload={{
        quickStats: data.quickStats,
        claimSheets: data.claimSheetRows,
        fundBatches: data.fundCaseRows,
        inTransit: data.passportRows,
      }}
    />
  )
}
