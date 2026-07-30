import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Button,
  DateRangePicker,
  FormField,
  Select,
  useToast,
  type TableState,
} from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { exportDashboardSnapshot } from '../../shared/dashboard-intelligence'
import { DASHBOARD_SPACING } from '../../shared/constants'
import {
  ACCOUNTS_REPORT_PERIOD_OPTIONS,
  ACCOUNTS_REPORT_TYPE_OPTIONS,
  buildAccountsReportRows,
  formatAccountsReportRangeLabel,
  getAccountsReportColumns,
  getAccountsReportSource,
  getAccountsReportTypeLabel,
  resolveAccountsReportRange,
  type AccountsReportPeriodId,
  type AccountsReportPreviewRow,
  type AccountsReportTypeId,
} from '../data/accountsReportsConfig'
import type { AccountsDashboardTabProps } from '../types'

function createTableState(): TableState {
  return {
    page: 0,
    pageSize: 10,
    sortKey: null,
    sortDirection: 'asc',
    filters: [],
    searchQuery: '',
    columnSearch: {},
    selectedRows: [],
    expandedRows: [],
    hiddenColumnKeys: [],
  }
}

/** Accounts Reports — select type + period, preview table, download Excel/PDF. */
export function ReportsTab({ data, loading }: AccountsDashboardTabProps) {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()

  const [reportType, setReportType] = useState<AccountsReportTypeId | ''>('')
  const [period, setPeriod] = useState<AccountsReportPeriodId | ''>('')
  const [customRange, setCustomRange] = useState<[Date | null, Date | null]>([null, null])
  const [tableState, setTableState] = useState<TableState>(createTableState)
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const hasSelection = Boolean(reportType && period)

  const range = useMemo(() => {
    if (!period) return null
    return resolveAccountsReportRange(period, customRange)
  }, [period, customRange])

  const rangeLabel = range ? formatAccountsReportRangeLabel(range.from, range.to) : ''
  const reportLabel = reportType ? getAccountsReportTypeLabel(reportType) : ''
  const reportSource = reportType ? getAccountsReportSource(reportType) : ''

  const columns = useMemo(
    () => (reportType ? getAccountsReportColumns(reportType) : []),
    [reportType],
  )
  const rows = useMemo(
    () => (reportType ? buildAccountsReportRows(reportType, data) : []),
    [reportType, data],
  )

  useEffect(() => {
    setTableState(createTableState())
    setColumnFilters({})
  }, [reportType, period, customRange])

  const handleDownload = async (format: 'excel' | 'pdf') => {
    if (!reportType || !period) {
      showToast({
        title: 'Select report filters',
        description: 'Choose a report type and period before downloading.',
        variant: 'warning',
      })
      return
    }
    const result = await exportDashboardSnapshot({
      format,
      title: `${reportLabel} ${rangeLabel}`,
      payload: rows,
      filename: `${reportType}-${period}.${format === 'excel' ? 'csv' : 'pdf'}`,
    })
    showToast({
      title: format === 'excel' ? 'Excel download started' : 'PDF export',
      description: result.message,
      variant: result.ok ? 'success' : 'error',
    })
  }

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
          flexWrap="wrap"
          useFlexGap
        >
          <Box sx={{ flex: '1 1 280px', minWidth: 200, maxWidth: { md: 380 } }}>
            <FormField label="Report type">
              <Select
                size="sm"
                fullWidth
                placeholder="Select report type"
                value={reportType}
                options={[...ACCOUNTS_REPORT_TYPE_OPTIONS]}
                onChange={(value) =>
                  setReportType(value === '' ? '' : (String(value) as AccountsReportTypeId))
                }
              />
            </FormField>
          </Box>

          <Box sx={{ flex: '1 1 160px', minWidth: 140, maxWidth: { md: 200 } }}>
            <FormField label="Period">
              <Select
                size="sm"
                fullWidth
                placeholder="Select period"
                value={period}
                options={[...ACCOUNTS_REPORT_PERIOD_OPTIONS]}
                onChange={(value) =>
                  setPeriod(value === '' ? '' : (String(value) as AccountsReportPeriodId))
                }
              />
            </FormField>
          </Box>

          {period === 'custom' ? (
            <Box sx={{ flex: '1 1 280px', minWidth: 240, maxWidth: 420 }}>
              <FormField label="Custom range">
                <DateRangePicker
                  size="sm"
                  fullWidth
                  layout="inline"
                  startPlaceholder="From"
                  endPlaceholder="To"
                  value={customRange}
                  onChange={setCustomRange}
                />
              </FormField>
            </Box>
          ) : null}

          <Stack
            direction="row"
            spacing={1}
            sx={{ ml: { md: 'auto' }, flexShrink: 0, pb: { md: 0.25 } }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              label="Download Excel"
              variant="contained"
              size="md"
              disabled={!hasSelection}
              onClick={() => void handleDownload('excel')}
            />
            <Button
              label="Download PDF"
              variant="outlined"
              size="md"
              disabled={!hasSelection}
              onClick={() => void handleDownload('pdf')}
            />
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
        {hasSelection ? (
          <>
            <Box sx={{ px: 2, pt: 1.75, pb: 1.25 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
                {reportLabel}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 12, display: 'block' }}
              >
                Applied: {rangeLabel}
              </Typography>
              {reportSource ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11, display: 'block', mt: 0.25 }}
                >
                  Source: {reportSource}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <AdminListingTable<AccountsReportPreviewRow>
                columns={columns}
                data={rows}
                filterSourceData={rows}
                rowKey="id"
                state={tableState}
                onStateChange={setTableState}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                getCellValue={(row, key) => String(row[key] ?? '')}
                stickyHeader
                enableColumnSort={false}
                enableColumnFilters={false}
                showPagination={false}
                loading={loading}
                emptyTitle="No report data"
                emptyDescription="Nothing to show for this report and period."
              />
            </Box>
          </>
        ) : (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 14 }}>
              Select a report to preview
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
            >
              Choose a report type and period above. The table preview will appear here.
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  )
}
