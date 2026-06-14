import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseCard, Button, Input, Select, useToast } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { invoiceService } from '@/shared/services/invoiceService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { INVOICE_TYPE_OPTIONS } from '../config/invoiceStatusConfig'
import { getInvoiceFilterOptions } from '../utils/invoiceListingUtils'

const LISTING_PATH = '/admin/finance/invoices'

export function BillingReportsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const invoices = useMemo(() => invoiceService.list(), [])
  const filterOptions = useMemo(() => getInvoiceFilterOptions(invoices), [invoices])
  const [company, setCompany] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [invoiceType, setInvoiceType] = useState('')

  const report = useMemo(
    () =>
      invoiceService.getBillingReport({
        company: company || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        invoiceType: (invoiceType || 'all') as 'all',
      }),
    [company, dateFrom, dateTo, invoiceType],
  )

  const handleExport = () => {
    const headers = ['Company', 'Billing Entity', 'Invoices', 'Total Billed', 'Collected', 'Outstanding']
    const rows = report.rows.map(r =>
      [r.companyName, r.billingEntity, r.invoiceCount, r.totalBilled, r.totalCollected, r.outstanding].join(','),
    )
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'billing-report.csv'
    link.click()
    URL.revokeObjectURL(url)
    showToast({ title: 'Report exported', variant: 'success' })
  }

  return (
    <AdminRecordPageChrome
      breadcrumbs={[
        { label: 'Finance', href: LISTING_PATH },
        { label: 'Billing & invoices', href: LISTING_PATH },
        { label: 'Billing reports' },
      ]}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Billing reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Financial summary by company and billing entity
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button label="Back to listing" variant="neutral" onClick={() => navigate(LISTING_PATH)} />
            <Button label="Export CSV" onClick={handleExport} />
          </Stack>
        </Stack>

        <Grid container spacing={1.5}>
          {[
            { label: 'Total billed', value: formatInr(report.totalBilled) },
            { label: 'Collected', value: formatInr(report.totalCollected) },
            { label: 'Outstanding', value: formatInr(report.outstanding) },
            { label: 'Overdue invoices', value: String(report.overdueCount) },
          ].map(kpi => (
            <Grid key={kpi.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <BaseCard sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {kpi.value}
                </Typography>
              </BaseCard>
            </Grid>
          ))}
        </Grid>

        <BaseCard sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
              gap: 1.5,
              mb: 2,
            }}
          >
            <Select
              value={company}
              onChange={v => setCompany(String(v))}
              options={filterOptions.companies.map(c => ({ value: c, label: c }))}
              placeholder="All companies"
              size="sm"
              clearable
              fullWidth
            />
            <Select
              value={invoiceType}
              onChange={v => setInvoiceType(String(v))}
              options={INVOICE_TYPE_OPTIONS}
              placeholder="All types"
              size="sm"
              clearable
              fullWidth
            />
            <Input
              value={dateFrom}
              onChange={v => setDateFrom(v)}
              placeholder="Date from (YYYY-MM-DD)"
              size="sm"
              fullWidth
            />
            <Input
              value={dateTo}
              onChange={v => setDateTo(v)}
              placeholder="Date to (YYYY-MM-DD)"
              size="sm"
              fullWidth
            />
          </Box>

          <Box sx={agreementEmbeddedTableSx}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Company</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Billing entity</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Invoices</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Total billed</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Collected</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Outstanding</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.rows.map(row => (
                  <TableRow key={`${row.companyName}-${row.billingEntity}`} hover>
                    <TableCell sx={{ fontSize: 13 }}>{row.companyName}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{row.billingEntity}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{row.invoiceCount}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{formatInr(row.totalBilled)}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{formatInr(row.totalCollected)}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{formatInr(row.outstanding)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </BaseCard>
      </Stack>
    </AdminRecordPageChrome>
  )
}
