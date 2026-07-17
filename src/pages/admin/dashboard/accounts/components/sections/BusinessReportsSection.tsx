import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { BarChart, ChartCard, Tabs } from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
import { DashboardSectionTable } from '@/pages/admin/dashboard/components'
import { buildTopRevenueColumns } from '../columns/topRevenueColumns'
import type { PurchaseVsRevenueSnapshot, TopRevenueRow } from '../../data/accountsDashboardMock'

type TopRevenueTab = 'clients' | 'countries' | 'segments'

export interface BusinessReportsSectionProps {
  topClients: TopRevenueRow[]
  topCountries: TopRevenueRow[]
  revenueBySegment: TopRevenueRow[]
  purchaseVsRevenue: PurchaseVsRevenueSnapshot
  getTopRevenueCellValue: (row: TopRevenueRow, key: string) => string
  loading?: boolean
}

export function BusinessReportsSection({
  topClients,
  topCountries,
  revenueBySegment,
  purchaseVsRevenue,
  getTopRevenueCellValue,
  loading = false,
}: BusinessReportsSectionProps) {
  const theme = useTheme()
  const ct = useChartTheme()
  const [activeTab, setActiveTab] = useState<TopRevenueTab>('clients')

  const columns = useMemo(() => buildTopRevenueColumns(), [])

  const activeData =
    activeTab === 'clients'
      ? topClients
      : activeTab === 'countries'
        ? topCountries
        : revenueBySegment

  const tabTitle =
    activeTab === 'clients'
      ? 'Top 10 clients'
      : activeTab === 'countries'
        ? 'Top 10 countries'
        : 'Revenue by business segment'

  const trendData = purchaseVsRevenue.trend.map((point) => ({
    label: point.label,
    revenue: point.revenue,
    purchase: point.purchase,
  }))

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Box>
          <Box sx={{ mb: 1 }}>
            <Tabs
              size="sm"
              items={[
                { label: 'Top 10 clients', value: 'clients' },
                { label: 'Top 10 countries', value: 'countries' },
                { label: 'By segment', value: 'segments' },
              ]}
              value={activeTab}
              onChange={(value) => setActiveTab(value as TopRevenueTab)}
            />
          </Box>
          <DashboardSectionTable
            title="Top revenue"
            subtitle={tabTitle}
            columns={columns}
            data={activeData}
            rowKey="id"
            getCellValue={getTopRevenueCellValue}
            loading={loading}
            pageSize={5}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <ChartCard title="Purchase vs revenue" subtitle="Cost, revenue, and profit margin trend">
          <Stack spacing={2}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: '10px', border: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Purchase cost
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {purchaseVsRevenue.purchaseCost}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: '10px', border: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Vendor cost
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {purchaseVsRevenue.vendorCost}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: '10px', border: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Revenue
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {purchaseVsRevenue.revenue}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Profit margin
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    {purchaseVsRevenue.profitMargin} ({purchaseVsRevenue.profitMarginPercent}%)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <BarChart
              data={trendData}
              bars={[
                { key: 'revenue', label: 'Revenue', color: ct.colors[0] },
                { key: 'purchase', label: 'Purchase', color: ct.colors[2] },
              ]}
              xKey="label"
              height={180}
            />
          </Stack>
        </ChartCard>
      </Grid>
    </Grid>
  )
}
