import { Grid, Stack, Typography } from '@mui/material'
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { Vendor } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { Badge } from '@/design-system/UIComponents'
import { vendorBillStatusColor, vendorBillStatusLabel } from '../../config/vendorStatusConfig'

function FinanceKpiCard({ label, value }: { label: string; value: string }) {
  return (
    <BaseCard sx={{ p: 2, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </BaseCard>
  )
}

export function VendorFinanceTab({ vendor }: { vendor: Vendor }) {
  const { finance } = vendor

  return (
    <Stack spacing={3}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceKpiCard label="Total invoice value" value={formatInr(finance.totalInvoiceValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceKpiCard label="Total paid" value={formatInr(finance.totalPaid)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceKpiCard label="Outstanding" value={formatInr(finance.outstanding)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceKpiCard label="Overdue amount" value={formatInr(finance.overdueAmount)} />
        </Grid>
      </Grid>

      <Stack spacing={1}>
        <Typography variant="subtitle2" fontWeight={700}>
          Vendor bills
        </Typography>
        {vendor.bills.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No vendor bills on record.
          </Typography>
        ) : (
          <Box sx={agreementEmbeddedTableSx}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Invoice number</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Invoice date</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                    Invoice amount
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Due date</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendor.bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{bill.invoiceNumber}</TableCell>
                    <TableCell>{new Date(bill.invoiceDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{formatInr(bill.invoiceAmount)}</TableCell>
                    <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge label={vendorBillStatusLabel[bill.status]} color={vendorBillStatusColor[bill.status]} size="sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" fontWeight={700}>
          Payment history
        </Typography>
        {vendor.payments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No payments recorded.
          </Typography>
        ) : (
          <Box sx={agreementEmbeddedTableSx}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Payment reference</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Payment date</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                    Amount
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendor.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.paymentReference}</TableCell>
                    <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{formatInr(payment.amount)}</TableCell>
                    <TableCell>{payment.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" fontWeight={700}>
          Tax summary
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FinanceKpiCard label="GST total" value={formatInr(finance.gstTotal)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FinanceKpiCard label="TDS deducted" value={formatInr(finance.tdsDeducted)} />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}
