import { useState } from 'react'
import { Stack } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared'
import {
  AnalyticsPeriodToggle,
  ClientRetentionSection,
  OperationalEfficiencySection,
  RevenueQualitySection,
  SalesPipelineSection,
} from '../components/analytics'
import type { AnalyticsPeriodMonths } from '../types/analyticsTypes'
import type { SuperAdminDashboardTabProps } from '../types'

/**
 * Analytics — trend intelligence across revenue quality, retention, operations, and sales.
 */
export function AnalyticsTab({ data, loading }: SuperAdminDashboardTabProps) {
  const [periodMonths, setPeriodMonths] = useState<AnalyticsPeriodMonths>(12)
  const analytics = data.analytics

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <Stack direction="row" justifyContent="flex-end">
        <AnalyticsPeriodToggle value={periodMonths} onChange={setPeriodMonths} />
      </Stack>

      <RevenueQualitySection
        data={analytics.revenueQuality}
        periodMonths={periodMonths}
        loading={loading}
      />

      <ClientRetentionSection
        data={analytics.clientRetention}
        periodMonths={periodMonths}
        loading={loading}
      />

      <OperationalEfficiencySection
        data={analytics.operationalEfficiency}
        periodMonths={periodMonths}
        loading={loading}
      />

      <SalesPipelineSection
        data={analytics.salesPipeline}
        periodMonths={periodMonths}
        loading={loading}
      />
    </Stack>
  )
}
