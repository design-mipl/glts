import { useMemo } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { Button, useToast } from '@/design-system/UIComponents'
import { Grid, Stack } from '@mui/material'
import { DashboardTable, ReportCenter, DASHBOARD_SPACING } from '../../shared'
import type { AccountsDailyReportCard, AccountsDashboardTabProps } from '../types'

/** Accounts reports — daily pack + Report Center (carry-forward from Original). */
export function ReportsTab({ data, loading, onRetry }: AccountsDashboardTabProps) {
  const { showToast } = useToast()

  const dailyColumns: Column<AccountsDailyReportCard>[] = useMemo(
    () => [
      { key: 'name', label: 'Report', widthSize: 'lg', sortable: false },
      { key: 'lastGenerated', label: 'Last generated', widthSize: 'md', sortable: false },
      {
        key: 'actions',
        label: '',
        hideable: false,
        sortable: false,
        filterable: false,
        searchable: false,
        render: (_value, row) => (
          <Stack direction="row" spacing={0.5}>
            <Button
              label="View"
              variant="text"
              size="sm"
              onClick={() =>
                showToast({
                  title: 'Report opened',
                  description: `Viewing ${row.name}.`,
                  variant: 'info',
                })
              }
            />
            <Button
              label="Download"
              variant="text"
              size="sm"
              onClick={() =>
                showToast({
                  title: 'Download started',
                  description: `Downloading ${row.name}.`,
                  variant: 'success',
                })
              }
            />
          </Stack>
        ),
      },
    ],
    [showToast],
  )

  const recentFromDaily = data.dailyReports.map((report) => ({
    id: report.id,
    name: report.name,
    category: 'Daily',
    generatedAt: report.lastGenerated,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Daily financial reports"
          subtitle="Invoice · courier · collection · vendor · revenue packs"
          columns={dailyColumns}
          data={data.dailyReports}
          rowKey="id"
          loading={loading}
          pageSize={10}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReportCenter
          recentReports={[...data.recentReports, ...recentFromDaily]}
          downloadHistory={data.reportNotifications}
          loading={loading}
          onRetry={onRetry}
          exportTitle="Accounts dashboard export"
          exportPayload={{
            quickStats: data.quickStats,
            dailyReports: data.dailyReports,
            purchaseVsRevenue: data.purchaseVsRevenue,
          }}
        />
      </Grid>
    </Grid>
  )
}
