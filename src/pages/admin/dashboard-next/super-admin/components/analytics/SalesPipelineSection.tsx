import { Box, Grid, Stack, Typography } from '@mui/material'
import type { Column } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../../shared'
import { ExecutiveTable } from '../../../shared/dashboard-ui-kit'
import { SuperAdminPanel, SuperAdminSection } from '../SuperAdminChrome'
import { AnalyticsMetricKpiRow } from './AnalyticsMetricKpiRow'
import { AnalyticsLineTrendPanel } from './AnalyticsTrendPanels'
import type {
  AnalyticsLeadSourceRow,
  AnalyticsPeriodMonths,
  AnalyticsSalesPipeline,
} from '../../types/analyticsTypes'

const LEAD_SOURCE_COLUMNS: Column<AnalyticsLeadSourceRow>[] = [
  { key: 'source', label: 'Inquiry source', width: 160, sortable: true },
  { key: 'enquiries', label: 'Enquiries', width: 100, sortable: true },
  { key: 'quotationsSent', label: 'Quotations sent', width: 120, sortable: true },
  { key: 'convertedAccounts', label: 'Converted accounts', width: 140, sortable: true },
  { key: 'conversionPct', label: 'Conversion %', width: 110, sortable: true, formatValue: (v) => `${v}%` },
  { key: 'avgNetRevenue', label: 'Avg net revenue', width: 120, sortable: false },
]

export interface SalesPipelineSectionProps {
  data: AnalyticsSalesPipeline
  periodMonths: AnalyticsPeriodMonths
  loading?: boolean
}

export function SalesPipelineSection({
  data,
  periodMonths,
  loading,
}: SalesPipelineSectionProps) {
  return (
    <SuperAdminSection
      title="Sales & pipeline intelligence"
      description="Which inquiry sources produce quality business — enquiry through conversion"
    >
      <AnalyticsMetricKpiRow items={data.headlines} loading={loading} />

      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 7 }}>
          <SuperAdminPanel title="Inquiry source performance">
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Last 6 months · Enquiries → quotations sent → converted accounts
              </Typography>
              <Box sx={{ mx: -1 }}>
                <ExecutiveTable
                  columns={LEAD_SOURCE_COLUMNS}
                  data={data.leadSourceRows}
                  rowKey="id"
                  loading={loading}
                  hideToolbar
                  hidePagination
                  showColumnSearch={false}
                  enableColumnSort={false}
                  fullWidth
                />
              </Box>
            </Stack>
          </SuperAdminPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <AnalyticsLineTrendPanel
            chart={data.conversionBySourceTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
      </Grid>
    </SuperAdminSection>
  )
}
